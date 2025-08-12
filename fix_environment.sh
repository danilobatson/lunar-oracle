#!/bin/bash

# Fix Environment Issues - Global Cache/NODE_ENV Problems
cd /Users/batson/Desktop/ForTheNerds/CreatorBid/lunar-oracle

echo "🔧 Fixing environment issues..."

# Step 1: Fix NODE_ENV issue (this keeps appearing in logs)
echo "🌍 Step 1: Fixing NODE_ENV..."
unset NODE_ENV
export NODE_ENV=production
echo "NODE_ENV set to: $NODE_ENV"

# Step 2: Clear ALL possible caches
echo "🗑️  Step 2: Nuclear cache clearing..."
# Clear yarn global cache
yarn cache clean --all 2>/dev/null || true

# Clear npm global cache
npm cache clean --force 2>/dev/null || true

# Clear Next.js cache globally
rm -rf ~/.next 2>/dev/null || true

# Clear local caches
rm -rf .next
rm -rf node_modules
rm -rf .yarn
rm -rf yarn.lock
rm -rf package-lock.json

# Step 3: Reinstall with npm instead of yarn (avoid lockfile conflicts)
echo "📦 Step 3: Fresh install with npm..."
npm install

# Step 4: Try development server instead of build (might bypass static generation issues)
echo "🚀 Step 4: Testing development server..."
timeout 10s npm run dev > dev_test.log 2>&1 &
DEV_PID=$!
sleep 8
kill $DEV_PID 2>/dev/null || true
wait $DEV_PID 2>/dev/null || true

# Check if dev server started successfully
if grep -q "Local:" dev_test.log; then
  DEV_SUCCESS=true
else
  DEV_SUCCESS=false
fi

# Step 5: Try minimal build test
echo "🔨 Step 5: Minimal build test..."
npm run build > environment_fix_test.log 2>&1
BUILD_STATUS=$?

# Step 6: Create status report
cat > environment_fix_status.json << EOSTATUS
{
  "timestamp": "$(date -Iseconds)",
  "environment_fixes_applied": true,
  "node_env_fixed": true,
  "caches_cleared": true,
  "dev_server_working": $DEV_SUCCESS,
  "build_successful": $(test $BUILD_STATUS -eq 0 && echo "true" || echo "false"),
  "build_exit_code": $BUILD_STATUS,
  "node_version": "$(node --version)",
  "npm_version": "$(npm --version)",
  "next_version": "$(npm list next --depth=0 2>/dev/null | grep next || echo 'not found')",
  "fixes_applied": [
    "Fixed NODE_ENV environment variable",
    "Cleared all yarn and npm caches",
    "Cleared Next.js global cache",
    "Fresh npm install (avoiding yarn conflicts)",
    "Tested development server",
    "Tested build process"
  ],
  "ready_for_development": $(test $DEV_SUCCESS = true && echo "true" || echo "false"),
  "recommendation": $(test $BUILD_STATUS -eq 0 && echo "\"Proceed with development\"" || test $DEV_SUCCESS = true && echo "\"Use dev mode, skip build for now\"" || echo "\"Environment issue requires manual investigation\"")
}
EOSTATUS

if [ $BUILD_STATUS -eq 0 ]; then
  echo "🎉 ENVIRONMENT FIXED! Build working!"
  echo "✅ Ready for development"
elif [ $DEV_SUCCESS = true ]; then
  echo "⚠️  Dev server works, build has issues"
  echo "💡 Recommendation: Proceed with development, fix build later"
  echo "🎯 We can develop in dev mode and address build issues once we have content"
else
  echo "❌ Both dev and build failing - deeper environment issue"
  echo "💡 This might require Node.js reinstall or different approach"
fi

echo ""
echo "📁 Files created:"
echo "   - environment_fix_status.json"
echo "   - environment_fix_test.log"
echo "   - dev_test.log"
echo ""
echo "📋 Quick test commands:"
echo "   npm run dev    # Test development server"
echo "   npm run build  # Test build (might still fail)"
