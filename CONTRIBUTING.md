# Contributing to LazyQoder

Thank you for improving LazyQoder. Keep changes focused, preserve the package
boundary, and avoid adding host configuration, credentials, or generated local
state to commits.

## Before opening an issue

Search existing issues first. For a bug report, include the LazyQoder version,
host version, operating system, exact reproduction steps, and sanitized output
from the verification command. Do not paste tokens, credentials, or private
workspace paths.

## Pull requests

Create one focused branch and describe the user-visible change, compatibility
impact, and verification in the pull request template. Keep pull requests
small and update documentation or `lazyqoder-plugin/CHANGELOG.md` when public
behavior changes.

Run these checks from the repository root before requesting review:

```bash
bash lazyqoder-plugin/scripts/lazyqoder-load-check.sh
bash lazyqoder-plugin/scripts/lazyqoder-plugin-doctor.sh
bash lazyqoder-plugin/scripts/lazyqoder-smoke-test.sh
bash lazyqoder-plugin/scripts/lazyqoder-security-check.sh
bash lazyqoder-plugin/scripts/lazyqoder-verify.sh
```

The CI workflow runs the same release-relevant checks on every pull request.

## Releases

Use a version tag in the form `vX.Y.Z` only after the default-branch CI is
green and the changelog documents the user-facing change. The tag-release
workflow creates GitHub release notes from merged pull requests and labels.
Review the generated notes before publishing a prerelease or major release.
