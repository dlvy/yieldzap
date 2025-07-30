#!/bin/bash
set -e

echo "🧪 Testing YieldZap Contract..."

CONTRACT_DIR="contracts/zap"
cd $CONTRACT_DIR

echo "📋 Running unit tests..."
cargo test

echo "🔍 Running cargo check..."
cargo check

echo "🛠️ Running clippy for linting..."
cargo clippy -- -D warnings

echo "📖 Checking documentation..."
cargo doc --no-deps

echo "✅ All tests passed!"
echo ""
echo "🚀 Ready to deploy! Run ./deploy.zap.sh"
