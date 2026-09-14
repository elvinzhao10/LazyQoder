'use strict';

const path = require('node:path');
const { LifecycleError } = require('./errors');
const { safeFile } = require('./files');
const {
  MCP_SERVERS,
  receiptTemplates,
  validateReceiptPath,
  validateWorkbuddyReceipt,
} = require('./qoder-receipt');
const {
  defaultRouteForHost,
  fallbackPolicy,
  validateMarketplaceRoutes,
} = require('./marketplace-routes');

const CONNECTORS = MCP_SERVERS;
const ROUTES = Object.freeze({
  'qodercli-marketplace': 'qodercli',
  'qoder-full-plugin': 'qoder',
  'manual-skills-mcp-fallback': 'qoder',
});
const OBSERVATION_KEYS = ['artifact', 'host', 'observed_at', 'type'];

function routeSelection(routes) {
  const selected = [...new Set(routes)].sort();
  const hasFull = selected.includes('qoder-full-plugin') || selected.includes('qodercli-marketplace');
  const hasFallback = selected.includes('manual-skills-mcp-fallback');
  if (hasFull && hasFallback) {
    return {
      kind: 'conflict',
      routes: selected,
      nextAction: 'Use the host UI to remove the prior LazyQoder route, start a fresh session, then select exactly one route.',
    };
  }
  if (selected.length === 0) return { kind: 'none' };
  if (selected.length !== 1) throw new LifecycleError('ROUTE_SELECTION_AMBIGUOUS', 'select exactly one host route');
  return { kind: 'route', route: selected[0], host: ROUTES[selected[0]] };
}

function parseObservation(receiptPath, host, context = {}) {
  if (receiptPath === undefined) return { status: 'pending' };
  try {
    validateReceiptPath(receiptPath);
  } catch (error) {
    throw new LifecycleError('OBSERVATION_RECEIPT_INVALID', error.message, error);
  }
  if (host === 'qoder') {
    if (context.route !== 'qoder-full-plugin') {
      throw new LifecycleError('WORKBUDDY_RECEIPT_INVALID', 'full-plugin receipt cannot validate a fallback route');
    }
    if (!context.releaseRoot || !context.manifestSha256 || !context.build || !context.session) {
      throw new LifecycleError('WORKBUDDY_RECEIPT_INVALID', 'current Qoder build and session are required');
    }
    return validateWorkbuddyReceipt(receiptPath, {
      ...context,
      now: context.now || new Date(),
    });
  }
  const now = context instanceof Date ? context : context.now || new Date();
  let receipt;
  try {
    receipt = JSON.parse(safeFile(receiptPath, 'OBSERVATION_RECEIPT_INVALID').bytes.toString('utf8'));
  } catch (error) {
    if (error instanceof LifecycleError) throw error;
    throw new LifecycleError('OBSERVATION_RECEIPT_INVALID', 'observation receipt must be valid JSON', error);
  }
  const observedAt = new Date(receipt?.observed_at);
  if (!receipt || typeof receipt !== 'object' || Array.isArray(receipt)
    || JSON.stringify(Object.keys(receipt).sort()) !== JSON.stringify(OBSERVATION_KEYS)
    || receipt.type !== 'host-observation' || receipt.host !== host
    || !/^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}(?:\.[0-9]+)?Z$/.test(receipt.observed_at)
    || Number.isNaN(observedAt.getTime())
    || !/^[A-Za-z0-9._:-]+$/.test(receipt.artifact)) {
    throw new LifecycleError('OBSERVATION_RECEIPT_INVALID', 'observation receipt does not match the selected host');
  }
  const currentDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  if (observedAt < currentDay || observedAt > now) return { status: 'pending' };
  return { status: 'observed', observation_receipt: receipt };
}

function connector(name, releaseRoot, projectRoot) {
  return {
    name,
    command: 'bash',
    args: [path.join(releaseRoot, 'lazyqoder-plugin', 'mcp', name, 'server.sh')],
    cwd: projectRoot,
    env: { CWD: projectRoot, QODER_PROJECT_DIR: projectRoot },
  };
}

function renderHandoff(route, releaseRoot, projectRoot, marketplace = null) {
  const base = { namespace: 'lazyqoder', route, host: ROUTES[route], host_mutation: 'none' };
  if (route === 'qoder-marketplace') {
    return {
      ...base,
      expected_artifacts: {
        marketplace: path.join(releaseRoot, '.qoder-plugin', 'marketplace.json'),
        plugin: 'lazyqoder@lazyqoder',
        version: marketplace.version,
      },
      degraded: { status: 'none' },
      next_action: { kind: 'host-command', command: `qoder plugin marketplace add ${releaseRoot}` },
    };
  }
  if (route === 'qoder-full-plugin') {
    const templates = receiptTemplates(releaseRoot, marketplace.qoder.manifest_sha256, marketplace.version);
    return {
      ...base,
      route_priority: { rank: 1, fallback_rank: 2 },
      expected_artifacts: {
        route: 'qoder-marketplace',
        manifest: path.join(releaseRoot, 'lazyqoder-plugin', '.qoder-plugin', 'plugin.json'),
        plugin: 'lazyqoder',
        version: marketplace.version,
      },
      preflight: { status: 'package-ready', full_plugin: 'user-observed-only' },
      receipt_templates: templates,
      next_action: { kind: 'gui', instruction: 'Open Skills → Plugins and inspect LazyQoder in the current Qoder session.' },
    };
  }
  return {
    ...base,
    route_priority: { rank: 2, recovery_only: true },
    expected_artifacts: { skills: path.join(releaseRoot, 'lazyqoder-plugin', 'skills') },
    recovery: fallbackPolicy(),
    degraded: { status: 'manual-skills-mcp-fallback', excludes: ['commands', 'agents', 'hooks'] },
    manual_mcp: { connectors: CONNECTORS.map((name) => connector(name, releaseRoot, projectRoot)) },
    next_action: { kind: 'gui', instruction: 'Open Skills and import the LazyQoder skills directory.' },
  };
}

module.exports = {
  defaultRouteForHost,
  parseObservation,
  renderHandoff,
  routeSelection,
  validateMarketplaceRoutes,
};
