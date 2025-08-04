#!/bin/bash

# Git Helper Script for What to Wear v1
# Usage: ./scripts/git-helper.sh [command] [options]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}=== $1 ===${NC}"
}

# Function to check if we're in a git repository
check_git_repo() {
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        print_error "Not in a git repository!"
        exit 1
    fi
}

# Function to check if working directory is clean
check_clean_working_dir() {
    if ! git diff-index --quiet HEAD --; then
        print_warning "Working directory is not clean. Please commit or stash your changes."
        return 1
    fi
    return 0
}

# Function to start a new feature
start_feature() {
    if [ -z "$1" ]; then
        print_error "Please provide a feature name"
        echo "Usage: $0 start-feature <feature-name>"
        exit 1
    fi
    
    check_git_repo
    check_clean_working_dir
    
    local feature_name="$1"
    local branch_name="feature/$feature_name"
    
    print_header "Starting new feature: $feature_name"
    
    git checkout develop
    git pull origin develop
    git checkout -b "$branch_name"
    
    print_status "Created feature branch: $branch_name"
    print_status "You can now start developing your feature!"
}

# Function to finish a feature
finish_feature() {
    check_git_repo
    
    local current_branch=$(git branch --show-current)
    
    if [[ ! "$current_branch" =~ ^feature/ ]]; then
        print_error "Not on a feature branch!"
        exit 1
    fi
    
    print_header "Finishing feature: $current_branch"
    
    # Check if there are uncommitted changes
    if ! check_clean_working_dir; then
        print_warning "Please commit or stash your changes before finishing the feature"
        exit 1
    fi
    
    # Push the feature branch
    git push origin "$current_branch"
    
    print_status "Feature branch pushed to remote"
    print_status "Please create a Pull Request to merge into develop"
    
    # Switch back to develop
    git checkout develop
    print_status "Switched back to develop branch"
}

# Function to start a bugfix
start_bugfix() {
    if [ -z "$1" ]; then
        print_error "Please provide a bug description"
        echo "Usage: $0 start-bugfix <bug-description>"
        exit 1
    fi
    
    check_git_repo
    check_clean_working_dir
    
    local bug_description="$1"
    local branch_name="bugfix/$bug_description"
    
    print_header "Starting bugfix: $bug_description"
    
    git checkout develop
    git pull origin develop
    git checkout -b "$branch_name"
    
    print_status "Created bugfix branch: $branch_name"
}

# Function to create a release
create_release() {
    if [ -z "$1" ]; then
        print_error "Please provide a version number"
        echo "Usage: $0 create-release <version>"
        exit 1
    fi
    
    check_git_repo
    check_clean_working_dir
    
    local version="$1"
    
    print_header "Creating release: v$version"
    
    # Ensure we're on main branch
    git checkout main
    git pull origin main
    
    # Merge develop into main
    git merge develop
    
    # Create and push tag
    git tag -a "v$version" -m "Release version $version"
    git push origin "v$version"
    
    print_status "Release v$version created and pushed"
}

# Function to show status
show_status() {
    check_git_repo
    
    print_header "Git Status"
    
    echo "Current branch: $(git branch --show-current)"
    echo "Last commit: $(git log -1 --oneline)"
    echo ""
    
    if ! git diff-index --quiet HEAD --; then
        print_warning "You have uncommitted changes:"
        git status --short
    else
        print_status "Working directory is clean"
    fi
}

# Function to show help
show_help() {
    print_header "Git Helper Script"
    echo ""
    echo "Available commands:"
    echo ""
    echo "  start-feature <name>    Start a new feature branch"
    echo "  finish-feature          Finish current feature and switch to develop"
    echo "  start-bugfix <desc>     Start a new bugfix branch"
    echo "  create-release <ver>    Create a new release tag"
    echo "  status                  Show current git status"
    echo "  help                    Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 start-feature add-weather-widget"
    echo "  $0 start-bugfix fix-date-picker"
    echo "  $0 create-release 1.2.0"
    echo ""
}

# Main script logic
case "$1" in
    "start-feature")
        start_feature "$2"
        ;;
    "finish-feature")
        finish_feature
        ;;
    "start-bugfix")
        start_bugfix "$2"
        ;;
    "create-release")
        create_release "$2"
        ;;
    "status")
        show_status
        ;;
    "help"|"--help"|"-h"|"")
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        echo "Use '$0 help' for available commands"
        exit 1
        ;;
esac 