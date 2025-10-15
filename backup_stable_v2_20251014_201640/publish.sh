#!/bin/bash

# UEMP Operations Hub V2 - Publish to GitHub
PROJECT_DIR="/Users/ruhh/Library/Mobile Documents/com~apple~CloudDocs/Rucarpeta/Programming/HTML Programs/UEMP Operations Hub V2"

echo "🚀 Publishing UEMP Operations Hub V2 to GitHub..."
echo ""

# Check git status
echo "📊 Checking git status..."
if git status --porcelain | grep -q .; then
    echo "✅ Changes detected"
else
    echo "ℹ️  No changes to publish"
    exit 0
fi

echo ""

# Show what will be committed
echo "📝 Files to be committed:"
git status --short
echo ""

# Prompt for commit message
read -p "Enter commit message (or press Enter for auto-generated): " COMMIT_MSG

if [ -z "$COMMIT_MSG" ]; then
    # Auto-generate commit message based on changed files
    CHANGED_FILES=$(git status --porcelain | wc -l)
    COMMIT_MSG="🔧 Update $CHANGED_FILES file(s)"
fi

# Create backup
echo "💾 Creating backup..."
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="$PROJECT_DIR/backup_stable_v2_$TIMESTAMP"

mkdir -p "$BACKUP_DIR"
cp -r *.js *.html *.css *.png *.json *.md *.sh "$BACKUP_DIR" 2>/dev/null || true

echo "📁 Backup created: backup_stable_v2_$TIMESTAMP"
echo ""

# Add and commit
echo "📤 Adding files to git..."
git add .

echo "💾 Committing changes..."
git commit -m "$COMMIT_MSG"

# Push to GitHub
echo "🌐 Pushing to GitHub..."
if git push origin main; then
    echo ""
    echo "✅ Successfully published to GitHub!"
    echo "🔗 Available at: https://github.com/ATrhu/UEMP-RideAlongReport"
    echo "📅 Backup: backup_stable_v2_$TIMESTAMP"
else
    echo ""
    echo "❌ Failed to push to GitHub. Check your connection and try again."
    exit 1
fi