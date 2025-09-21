#!/bin/bash

# Script to commit and push changes from both frontend and backend

echo "🔍 Checking for changes..."

# Add all changes
git add .

# Check if there are any changes to commit
if git diff --cached --quiet; then
    echo "❌ No changes to commit"
    exit 0
fi

# Show what will be committed
echo "📝 Changes to be committed:"
git diff --cached --name-status

# Prompt for commit message
echo ""
read -p "💬 Enter commit message: " commit_message

if [ -z "$commit_message" ]; then
    echo "❌ Commit message cannot be empty"
    exit 1
fi

# Commit changes
echo "📦 Committing changes..."
git commit -m "$commit_message"

# Push to remote
echo "🚀 Pushing to remote..."
git push

echo "✅ Successfully committed and pushed changes!"