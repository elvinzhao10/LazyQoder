#!/usr/bin/env node
'use strict';

const path = require('node:path');
const fs = require('node:fs');
const { validateInstalledMarketplacePackage, validateMarketplaceRoutes } = require('./lifecycle/marketplace-routes');

const hasExplicitReleaseRoot = process.argv[2] !== undefined;
const releaseRoot = hasExplicitReleaseRoot ? path.resolve(process.argv[2]) : path.resolve(__dirname, '..', '..');
try {
  const result = hasExplicitReleaseRoot
    ? validateMarketplaceRoutes(releaseRoot)
    : fs.existsSync(path.join(releaseRoot, 'lazyqoder-plugin'))
      ? validateMarketplaceRoutes(releaseRoot)
      : validateInstalledMarketplacePackage(path.resolve(__dirname, '..'));
  process.stdout.write(`${JSON.stringify({
    status: 'pass',
    version: result.version,
    qoder: result.qoder.plugin,
    qoder: result.qoder.plugin,
    payload_files: result.qoder.payload_inventory.length,
  })}\n`);
} catch (error) {
  process.stderr.write(`${JSON.stringify({ error: error.code || 'MARKETPLACE_ROUTE_INVALID', message: error.message })}\n`);
  process.exitCode = 1;
}
