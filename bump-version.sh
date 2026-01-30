#!/bin/bash

# Auto-increment version in index.html on each deployment
# Usage: ./bump-version.sh before committing

VERSION_FILE="index.html"

# Extract current version (e.g., v=1.1 -> 1.1)
CURRENT_VERSION=$(grep -oP 'v=\K[0-9]+\.[0-9]+' "$VERSION_FILE" | head -1)

# Split version into major.minor
MAJOR=$(echo $CURRENT_VERSION | cut -d. -f1)
MINOR=$(echo $CURRENT_VERSION | cut -d. -f2)

# Increment minor version
NEW_MINOR=$((MINOR + 1))
NEW_VERSION="$MAJOR.$NEW_MINOR"

# Replace version in HTML
sed -i "s/v=[0-9]\+\.[0-9]\+/v=$NEW_VERSION/g" "$VERSION_FILE"

echo "✅ Version bumped: $CURRENT_VERSION → $NEW_VERSION"
