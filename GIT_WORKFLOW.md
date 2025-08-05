# Git Workflow Guide

This document outlines the Git workflow and conventions used in the What to Pack v1 project.

## 🌿 Branching Strategy

We use a simplified Git Flow approach with the following branches:

### Main Branches

- **`main`**: Production-ready code
- **`develop`**: Integration branch for features

### Feature Branches

- **`feature/feature-name`**: New features
- **`bugfix/bug-description`**: Bug fixes
- **`hotfix/urgent-fix`**: Critical production fixes

## 📝 Commit Message Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Format
```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- **`feat`**: A new feature
- **`fix`**: A bug fix
- **`docs`**: Documentation only changes
- **`style`**: Changes that do not affect the meaning of the code
- **`refactor`**: A code change that neither fixes a bug nor adds a feature
- **`perf`**: A code change that improves performance
- **`test`**: Adding missing tests or correcting existing tests
- **`chore`**: Changes to the build process or auxiliary tools

### Examples

```bash
# Feature
git commit -m "feat: add custom date picker component"

# Bug fix
git commit -m "fix: resolve form submission issue with date picker"

# Documentation
git commit -m "docs: update README with API integration details"

# Refactor
git commit -m "refactor: improve weather data processing logic"

# Style
git commit -m "style: update button hover states"

# Performance
git commit -m "perf: optimize API calls with caching"

# Test
git commit -m "test: add unit tests for weather utility functions"

# Chore
git commit -m "chore: update dependencies to latest versions"
```

## 🔄 Development Workflow

### 1. Starting a New Feature

```bash
# Ensure you're on develop branch
git checkout develop
git pull origin develop

# Create feature branch
git checkout -b feature/amazing-new-feature

# Make your changes and commit
git add .
git commit -m "feat: add amazing new feature"

# Push to remote
git push origin feature/amazing-new-feature
```

### 2. Completing a Feature

```bash
# Ensure all tests pass
npm run test

# Update documentation if needed
git add .
git commit -m "docs: update documentation for new feature"

# Push final changes
git push origin feature/amazing-new-feature

# Create Pull Request to develop branch
```

### 3. Bug Fixes

```bash
# Create bugfix branch from develop
git checkout develop
git checkout -b bugfix/fix-date-picker-issue

# Fix the bug
git add .
git commit -m "fix: resolve date picker calendar display issue"

# Push and create PR
git push origin bugfix/fix-date-picker-issue
```

### 4. Hotfixes (Production Issues)

```bash
# Create hotfix branch from main
git checkout main
git checkout -b hotfix/critical-api-fix

# Fix the critical issue
git add .
git commit -m "fix: resolve critical API timeout issue"

# Push and create PR to main
git push origin hotfix/critical-api-fix
```

## 🚀 Release Process

### 1. Prepare Release

```bash
# Merge develop into main
git checkout main
git merge develop

# Create release tag
git tag -a v1.1.0 -m "Release version 1.1.0"
git push origin v1.1.0
```

### 2. Update Version

```bash
# Update package.json version
npm version patch  # or minor/major

# Commit version bump
git commit -m "chore: bump version to 1.1.1"
git push origin main
```

## 📋 Pre-commit Checklist

Before committing, ensure:

- [ ] Code follows project style guidelines
- [ ] All tests pass (`npm run test`)
- [ ] No console errors in browser
- [ ] Documentation is updated if needed
- [ ] Commit message follows convention
- [ ] No sensitive data is included

## 🔧 Useful Git Commands

### Viewing History

```bash
# View commit history
git log --oneline

# View changes in last commit
git show

# View file history
git log --follow filename.tsx
```

### Managing Branches

```bash
# List all branches
git branch -a

# Delete local branch
git branch -d feature-name

# Delete remote branch
git push origin --delete feature-name
```

### Stashing

```bash
# Stash changes
git stash

# List stashes
git stash list

# Apply last stash
git stash pop

# Apply specific stash
git stash apply stash@{1}
```

### Resetting

```bash
# Soft reset (keep changes staged)
git reset --soft HEAD~1

# Mixed reset (keep changes unstaged)
git reset HEAD~1

# Hard reset (discard changes)
git reset --hard HEAD~1
```

## 🚨 Emergency Procedures

### Reverting a Bad Commit

```bash
# Revert last commit
git revert HEAD

# Revert specific commit
git revert <commit-hash>
```

### Recovering Lost Work

```bash
# Find lost commits
git reflog

# Recover from reflog
git checkout <commit-hash>
```

## 📚 Additional Resources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/)
- [Git Best Practices](https://github.com/trein/dev-best-practices/wiki/Git-Commit-Best-Practices)

---

**Remember**: Always communicate with your team about major changes and coordinate releases! 