#!/bin/bash

# Proxy Server Setup Script
# Configures GitHub token and starts the proxy

echo "🌭 Pablo Devorador - Proxy Server Setup"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "No .env file found."
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo ""
    echo "⚠️  Please edit .env and add your GitHub token:"
    echo "   GITHUB_TOKEN=ghp_your_token_here"
    echo ""
    echo "Get a token from: https://github.com/settings/tokens/new (repo scope only)"
    echo ""
    exit 1
fi

# Check if GITHUB_TOKEN is set
if ! grep -q "^GITHUB_TOKEN=" .env || grep -q "^GITHUB_TOKEN=ghp_your_token_here" .env; then
    echo "❌ GITHUB_TOKEN not configured in .env"
    echo ""
    echo "Edit .env and set:"
    echo "   GITHUB_TOKEN=ghp_your_actual_token"
    echo ""
    echo "Get a token from: https://github.com/settings/tokens/new (repo scope only)"
    exit 1
fi

# Install dotenv if not present
if ! npm list dotenv > /dev/null 2>&1; then
    echo "📦 Installing dotenv dependency..."
    npm install dotenv
fi

echo ""
echo "✅ Setup complete! Starting proxy server..."
echo ""

# Start the server
node proxy-server.js
