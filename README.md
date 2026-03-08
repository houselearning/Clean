# Clean — Automated Draft PR & Fix Engine

Clean is a GitHub Actions–powered automation system that creates draft pull requests, applies automated fixes, and checks incoming PRs for typos. It can be used as a standalone automation service or as a reusable composite action that other repositories call.

Clean uses a modular, repo-style architecture and the bot identity `HouseLearningCleaned[bot]` to ensure consistent, auditable automation across repositories.

## Features

### Automated draft PR creation
When an issue contains the trigger phrase:

```
--HouseLearningCleanPlease
```

Clean will automatically:

## Extending Clean
Clean is designed to be extended. Possible directions:

- Per-repository configuration files
- Multi-repo routing and orchestration
- Priority queues for cleanup tasks
- Custom linting, formatting, or typo rules
- Integration with GitHub Apps for secure cross-repo automation

## Example usage

Below is a ready-to-copy workflow demonstrating the three job modes. Paste this into `.github/workflows/clean.yml` in a repository that uses the published `houselearning/Clean` action or your local action path.

```yaml
name: Use Clean Automation

on:
	issues:
		types: [opened, edited]
	pull_request:
		types: [opened, synchronize, reopened]

jobs:
	create-clean-pr:
		if: >-
			contains(github.event.issue.body, '--HouseLearningCleanPlease') &&
			!contains(github.event.issue.body, 'Fixes PR:')
		runs-on: ubuntu-latest
		steps:
			- name: Run Clean (create PR)
				uses: houselearning/Clean@main
				with:
					mode: create-pr
					issue-body: ${{ github.event.issue.body }}
					issue-number: ${{ github.event.issue.number }}
					repo: ${{ github.repository }}
					token: ${{ secrets.APP_TOKEN }}

	apply-clean-fixes:
		if: >-
			contains(github.event.issue.body, '--HouseLearningCleanPlease') &&
			contains(github.event.issue.body, 'Fixes PR:')
		runs-on: ubuntu-latest
		steps:
			- name: Run Clean (apply fixes)
				uses: houselearning/Clean@main
				with:
					mode: apply-fixes
					issue-body: ${{ github.event.issue.body }}
					repo: ${{ github.repository }}
					token: ${{ secrets.APP_TOKEN }}

	typo-check:
		if: github.event_name == 'pull_request'
		runs-on: ubuntu-latest
		steps:
			- name: Run Clean (typo check)
				uses: houselearning/Clean@main
				with:
					mode: typo-check
					repo: ${{ github.repository }}
					token: ${{ secrets.APP_TOKEN }}
```
			- name: Run Clean (create PR)
				uses: ./.github/actions/clean
				with:
					mode: create-pr
					issue-body: "${{ github.event.issue.body }}"
					issue-number: "${{ github.event.issue.number }}"
					token: ${{ secrets.GITHUB_TOKEN }}

For `apply-fixes` supply `issue-body` and the token; for `typo-check` supply `token` and any configuration inputs required by your typo checker.

## Inputs
Clean accepts these inputs (via the action `with:` block):

- `mode` — Operation to run: `create-pr`, `apply-fixes`, or `typo-check`.
- `issue-body` — Raw issue text (used for PR creation and fix application).
- `issue-number` — Issue number (used when creating a PR from an issue).
- `repo` — Target repository in `owner/name` format (optional; used for cross-repo operations).
- `token` — GitHub App token or PAT with appropriate permissions.

## Bot identity
All automated commits and PRs are authored as:

```
HouseLearningCleaned[bot]
bot@houselearning.com
```

This provides clear attribution and auditability for automated changes.

## Repository structure
Typical layout for the Clean project:

- `.github/workflows/` — event-driven workflows
- `scripts/` — Node-based automation logic and helpers
- `action.yml` — composite action definition
- `package.json` — dependencies and metadata

## Extending Clean
Clean is designed to be extended. Possible directions:

- Per-repository configuration files
- Multi-repo routing and orchestration
- Priority queues for cleanup tasks
- Custom linting, formatting, or typo rules
- Integration with GitHub Apps for secure cross-repo automation
