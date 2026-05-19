# integrity.md Check — GitHub Action

A composite GitHub Action that validates an `integrity.md` against the
[TIF (The Integrity Framework)](https://theintegrityframework.org) base
manifest and any per-product audit rules in `audits/rules/*.json`.

Wraps [`startvest-integrity-cli`](https://github.com/Startvest-LLC/startvest-integrity-cli). Installs the CLI from a git tag at action runtime — no npm publish step needed.

## Usage

```yaml
name: integrity
on: [pull_request, push]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: Startvest-LLC/integrity-md-action@v1
        with:
          path: .
          strict: 'false'
```

### Inputs

| Name | Default | Description |
| --- | --- | --- |
| `path` | `.` | Repo root containing `integrity.md` (and optional `audits/rules/*.json`). |
| `cli-version` | `1.3.0` | CLI version (must match a git tag on the CLI repo, without the `v` prefix). Pin in CI. |
| `strict` | `false` | Fail on HIGH findings (CLI exit 2), not just CRITICAL. |
| `node-version` | `20` | Node version to install. CLI requires >= 20. |
| `badge-output` | _(empty)_ | Path (relative to `path`) to write a shields.io endpoint JSON. Empty = skip. |
| `badge-label` | `integrity.md` | Text on the left side of the badge. |

### Outputs

| Name | Description |
| --- | --- |
| `exit-code` | Raw CLI exit code. `0`=pass, `1`=CRITICAL, `2`=HIGH (strict), `3`=usage. |
| `critical-count` | Number of CRITICAL findings. |
| `high-count` | Number of HIGH findings. |
| `medium-count` | Number of MEDIUM findings. |
| `low-count` | Number of LOW findings. |
| `base-version` | Version of the TIF base manifest the CLI ran against. |
| `results-path` | Filesystem path to the full JSON results file. |
| `tier` | `bronze` / `bronze-warn` / `fail`. |
| `badge-json` | Raw shields.io endpoint JSON string. |
| `badge-path` | Path the badge JSON was written to (empty if `badge-output` unset). |

### Example — upload results as an artifact

```yaml
- uses: Startvest-LLC/integrity-md-action@v1
  id: integrity
- uses: actions/upload-artifact@v4
  if: always()
  with:
    name: integrity-results
    path: ${{ steps.integrity.outputs.results-path }}
```

## Badge

The Action emits a [shields.io endpoint JSON](https://shields.io/endpoint)
payload describing the repo's current tier.

### Option A — auto-updating badge committed by CI

Have the Action write the JSON into a known path in your repo on each run.
The badge URL points at that file via raw.githubusercontent.com, so it
refreshes whenever CI runs and pushes.

```yaml
jobs:
  integrity:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v4
      - uses: Startvest-LLC/integrity-md-action@v1
        with:
          badge-output: .github/integrity-badge.json
      - name: Commit badge if changed
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
          git add .github/integrity-badge.json
          git diff --cached --quiet || git commit -m "chore: update integrity badge"
          git push
```

Then embed the badge in your README:

```markdown
![integrity.md](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/OWNER/REPO/main/.github/integrity-badge.json)
```

### Option B — one-shot value via outputs

If you don't want a committed JSON file, consume the `tier` and
`badge-json` outputs directly in downstream steps (post to Slack, write
to a PR comment, etc.).

```yaml
- uses: Startvest-LLC/integrity-md-action@v1
  id: integrity
- env:
    TIER: ${{ steps.integrity.outputs.tier }}
    BADGE_JSON: ${{ steps.integrity.outputs.badge-json }}
  run: |
    echo "Tier: $TIER"
    echo "Shields JSON: $BADGE_JSON"
```

> Inject outputs through `env:` rather than inline `${{ ... }}` substitution.
> Badge messages can contain shell metacharacters (e.g. `Bronze (warnings)`).

### Tier mapping

| `tier` output | Condition | Badge text |
| --- | --- | --- |
| `bronze` | No CRITICAL or HIGH findings | `Bronze` |
| `bronze-warn` | HIGH findings but no CRITICAL | `Bronze (warnings)` |
| `fail` | One or more CRITICAL findings | `needs work` |

Silver-tier promotion is not computed by the Action — it lives in the
[TIF directory](https://theintegrityframework.org/listings) workflow.

## Versioning

This Action follows semver. Breaking changes to inputs/outputs bump the
major. The `cli-version` input lets consumers pin the underlying CLI
independently of the Action.

The TIF base-manifest version evolves independently of both the Action
and the CLI. See the [versioning policy on the audit log
page](https://theintegrityframework.org/framework/audit-log#versioning-policy)
for which artifact bumps when.

## License

Apache-2.0. Matches the [`integrity-cli`](https://github.com/Startvest-LLC/startvest-integrity-cli) license.
