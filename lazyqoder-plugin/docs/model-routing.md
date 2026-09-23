# Model routing

LazyQoder describes task intent. Qoder chooses and bills the model. A package
alias or recommendation is not proof of a concrete backing model, account
availability, host loading, or a particular Credit rate.

The package's declared agents omit `model` and inherit the current model.
Before dispatch, propose delegation and any model switches in the plan, remind
the user that switching can change quality, latency, and cost, and record the
decision. If the plan is silent, keep the same model across all subagents and
retries. Qoder CLI can use these plan options when switching is enabled:

| Task class | Optional plan choice | Use |
| --- | --- | --- |
| Mechanical work | `efficient` with low effort | Repository indexing, bounded search, and routine memory maintenance. |
| Default work | `inherit` | All roles keep the current parent-session model unless the plan explicitly enables a switch. |
| Quality-focused work | `performance` with high or xhigh effort | Planning, review, security review, final gates, and verification. |

`performance` is a provisional tier choice for those roles. It does not claim a
specific model or a quality guarantee. Qoder CLI documents model aliases in
Subagent frontmatter. Qoder IDE documentation does not: it shows a current
`[ModelName](modelId)` value or omission to inherit the conversation, with a
user selecting a role model in Quest settings. Therefore these literal aliases
are CLI-scoped plan options. For IDE/app routes they are advisory task
classes until the current UI shows a valid selection; package metadata alone
does not prove the host applied them.

## Produce a recommendation

The shared helper is a read-only recommendation surface. It does not query a
host, select a model, write settings, or contact a provider:

```bash
node contracts/model-routing.js --host qoder-cli --task mechanical --list
node contracts/model-routing.js --host qoder-ide --task architecture --risk high
node contracts/model-routing.js --host qoder-cli --task review --failed-attempts 1
node contracts/model-routing.js --host qoder-cli --task mechanical --allow-switch
```

Supported task classes are `mechanical`, `implementation`, `architecture`,
`review`, `security`, and `visual`. Pass `--host qoder-cli` or
`--host qoder-ide`. Without a catalog, `qoder-ide` returns an advisory tier
with `chosenModel: null`. With a caller catalog it may recommend a qualified
`chosenModel`, but `dispatch.kind` remains `manual-only` and `dispatch.value`
remains `null`: it never binds an alias or catalog model to IDE Agent
frontmatter. A recommendation remains **unobserved** until the current host
visibly offers and accepts a selection. The orchestrator consults it once
before a task's first dispatch, records the result in the handoff, and reuses
it for retries. Without `--allow-switch`, `chosenModel` is null and dispatch is
`inherit`. Re-evaluate only when the plan's switching decision, task class,
risk, failed attempts, or explicit user choice changes.

`--failed-attempts` means completed task-acceptance failures. It does not count
an expected test-first red state, a missing host catalog, or an unavailable
host. An explicit user model choice takes precedence when it meets the required
tier, declared availability, and required capabilities. The helper refuses an
underqualified choice; it does not silently substitute another model. `inherit`
roles deliberately retain the accepted session choice; do not invent a model
argument for an Agent call.

## Discover the current catalog

For Qoder CLI, the signed-in user's visible catalog is:

```bash
qoder --list-models
```

The `/model` UI and the Qoder IDE/app model selector are the corresponding
visible surfaces. The official [CLI model guide](https://docs.qoder.com/cli/model)
and [Qoder model selector guide](https://docs.qoder.com/qoder/model-selector)
publish snapshots only: client version, account availability, service updates,
parameters, and displayed rates can differ. Check the host before acting on a
recommendation.

Qoder CLI supports per-agent local overrides only after an agent is discovered.
The documented `settings.json` shape is shown here as a user-owned preview;
LazyQoder never writes it:

```json
{
  "agents": {
    "overrides": {
      "lazyqoder-reviewer": {
        "modelConfig": {
          "model": "performance"
        }
      }
    }
  }
}
```

See [Qoder CLI subagents](https://docs.qoder.com/cli/subagent) for the current
frontmatter and override schema. In Qoder IDE, choose an agent model through
Quest settings only when the current UI exposes it; the package does not know
the host-specific model ID or claim that an alias in package metadata is
applied.

## Custom models

Use a custom model only after the user has configured and validated it through
the host's supported UI. In Qoder CLI this is `/model` → Custom; do not
hand-configure BYOK in `settings.json`. In Qoder IDE/app it is Settings →
Models. A validated custom model can then remain the parent session selection
for `inherit` roles.

After the plan enables switching, a documented Qoder CLI alias can be passed
as `--model` with `--allow-switch` and no catalog.
An explicit direct or custom ID requires safe-catalog input. The file is
non-secret availability input and does not query Qoder:

```json
{
  "schema_version": 1,
  "host": "qoder-cli",
  "models": [
    {
      "id": "custom:example/review-model-v1",
      "origin": "custom",
      "tier": "strong",
      "available": true,
      "capabilities": ["tools", "code"],
      "costRank": 2
    }
  ]
}
```

Use it only with the exact current visible ID:

```bash
node contracts/model-routing.js --host qoder-cli --task review \
  --allow-switch --catalog safe.json --model "custom:example/review-model-v1"
```

`costRank` is a declared relative rank, never a price, Credit multiplier, or
provider bill. Supplying an entry does not register it with Qoder or prove it
is visible in the current task/session. Qoder IDE ignores catalog model binding
and remains manual-only. If no current visible catalog entry is supplied, the
user-selected session model remains authoritative.

The shared catalog schema also permits an optional `subagentSupported` boolean.
It is accepted as caller-declared metadata for every host, but the current
routing policy uses it only for Trae. It does not make a Qoder custom model
visible to an Agent.

Custom-provider costs are billed by the provider and cannot be compared safely
with Qoder Credit multipliers. See [Qoder CLI custom models](https://docs.qoder.com/cli/custom-models)
and [Qoder custom models](https://docs.qoder.com/qoder/custom-models).

## Native testing boundary

Run package tests for frontmatter and helper behavior locally. Listing a real
account catalog, selecting a tier/direct/custom model, and observing a
per-agent override are host and user-owned checks. This worktree has no Qoder
CLI account catalog evidence, so it makes no availability claim.
