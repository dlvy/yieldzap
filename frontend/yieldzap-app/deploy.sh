#!/bin/bash

# YieldZap Netlify Deployment Script
set -e

echo "🚀 Starting YieldZap deployment to Netlify..."

# Navigate to the frontend directory
cd "$(dirname "$0")"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the frontend/yieldzap-app directory."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Type check
echo "🔍 Type checking..."
pnpm run type-check

# Build the project
echo "🏗️  Building the project..."
pnpm run netlify-build

# Check if build was successful
if [ ! -d "out" ]; then
    echo "❌ Error: Build failed - no 'out' directory found."
    exit 1
fi

echo "✅ Build successful! Files ready for deployment in ./out directory"

# If Netlify CLI is available, offer to deploy
if command -v netlify &> /dev/null; then
    echo ""
    echo "Netlify CLI detected. Would you like to deploy now? (y/n)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        echo "🚀 Deploying to Netlify..."
        netlify deploy --dir=out --prod
        echo "🎉 Deployment complete!"
    else
        echo "📁 Build files are ready in ./out directory"
        echo "💡 You can deploy manually by:"
        echo "   1. Run 'netlify deploy --dir=out --prod'"
        echo "   2. Or drag the ./out folder to netlify.com"
    fi
else
    echo ""
    echo "📁 Build files are ready in ./out directory"
    echo "💡 To deploy:"
    echo "   1. Install Netlify CLI: npm install -g netlify-cli"
    echo "   2. Run: netlify deploy --dir=out --prod"
    echo "   3. Or drag the ./out folder to netlify.com"
fi

echo ""
echo "🌟 YieldZap is ready to launch! 🌟"
