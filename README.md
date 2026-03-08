# Clean — Automated PR Cleaner & Typo Checker

Clean is a GitHub Actions automation bot that:

- Creates draft PRs using HouseLearningCleaned[bot]
- Applies fixes when issues include `--HouseLearningCleanPlease`
- Supports co-authors
- Checks all PRs for typos
- Designed specifically for HouseLearning

## Triggers

### Create Draft PR
Add this to an issue:

```--HouseLearningCleanPlease```


### Apply Fixes to an Existing PR
```
Fixes PR: #12
--HouseLearningCleanPlease
Coauthors: @alex, @someone
```

### Typo Checking
Runs automatically on all PRs.
