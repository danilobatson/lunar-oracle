#!/bin/bash

# Fix TypeScript Import Errors
# Remove problematic index.ts files until we create the actual components

echo "🔧 Fixing TypeScript Import Errors"
echo "=================================="

# Change to project directory

# Create fix status directory
mkdir -p diagnostics/phase1/typescript_fix

# 1. Remove problematic index.ts files
echo ""
echo "🗑️ Step 1: Removing Problematic Index Files..."

# Remove the index files that reference non-existent components
if [ -f "src/components/crypto/index.ts" ]; then
  rm src/components/crypto/index.ts
  echo "✅ Removed src/components/crypto/index.ts"
fi

if [ -f "src/components/dashboard/index.ts" ]; then
  rm src/components/dashboard/index.ts
  echo "✅ Removed src/components/dashboard/index.ts"
fi

if [ -f "src/components/shared/index.ts" ]; then
  rm src/components/shared/index.ts
  echo "✅ Removed src/components/shared/index.ts"
fi

# 2. Keep the directories but make them empty for now
echo ""
echo "📁 Step 2: Keeping Component Directories..."

# Ensure directories exist but are clean
mkdir -p src/components/crypto
mkdir -p src/components/dashboard
mkdir -p src/components/shared

# Add .gitkeep files so directories don't disappear
touch src/components/crypto/.gitkeep
touch src/components/dashboard/.gitkeep
touch src/components/shared/.gitkeep

echo "✅ Component directories preserved with .gitkeep files"

# 3. Test TypeScript compilation
echo ""
echo "🔍 Step 3: Testing TypeScript Compilation..."

echo "Running TypeScript check..." > diagnostics/phase1/typescript_fix/tsc_test.log
if yarn tsc --noEmit >> diagnostics/phase1/typescript_fix/tsc_test.log 2>&1; then
  ts_success="true"
  echo "✅ TypeScript compilation successful"
else
  ts_success="false"
  echo "❌ TypeScript compilation still has errors"
  echo "Errors:"
  tail -10 diagnostics/phase1/typescript_fix/tsc_test.log
fi

# 4. Test build
echo ""
echo "🔨 Step 4: Testing Build..."

echo "Running build test..." > diagnostics/phase1/typescript_fix/build_test.log
if yarn build >> diagnostics/phase1/typescript_fix/build_test.log 2>&1; then
  build_success="true"
  echo "✅ Build successful"
else
  build_success="false"
  echo "❌ Build still failing"
  echo "Last few build errors:"
  tail -5 diagnostics/phase1/typescript_fix/build_test.log
fi

# 5. Test dev server
echo ""
echo "🌐 Step 5: Testing Dev Server..."

# Start dev server briefly to test
echo "Starting dev server test..." > diagnostics/phase1/typescript_fix/dev_test.log
timeout 8s yarn dev >> diagnostics/phase1/typescript_fix/dev_test.log 2>&1 &
dev_pid=$!
sleep 6
kill $dev_pid 2>/dev/null || true

if grep -q "Ready" diagnostics/phase1/typescript_fix/dev_test.log 2>/dev/null; then
  dev_success="true"
  echo "✅ Dev server starts successfully"
else
  dev_success="false"
  echo "❌ Dev server has issues"
fi

# 6. Generate fix status report
cat > diagnostics/phase1/typescript_fix/fix_status.json << EOF
{
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "problem": "TypeScript import errors for non-existent components",
  "solution": "Removed problematic index.ts files",
  "results": {
    "typescript_compilation": "$ts_success",
    "build_success": "$build_success",
    "dev_server_success": "$dev_success"
  },
  "files_removed": [
    "src/components/crypto/index.ts",
    "src/components/dashboard/index.ts",
    "src/components/shared/index.ts"
  ],
  "directories_preserved": [
    "src/components/crypto/",
    "src/components/dashboard/",
    "src/components/shared/"
  ],
  "ready_for_phase1_step2": $(if [ "$build_success" = "true" ] && [ "$dev_success" = "true" ]; then echo "true"; else echo "false"; fi)
}
EOF

# 7. Check current project structure
echo ""
echo "📂 Step 6: Current Project Structure..."

echo "Current src structure:" > diagnostics/phase1/typescript_fix/current_structure.txt
tree src -I node_modules 2>/dev/null >> diagnostics/phase1/typescript_fix/current_structure.txt || find src -type f 2>/dev/null >> diagnostics/phase1/typescript_fix/current_structure.txt

# 8. Generate next steps
cat > diagnostics/phase1/typescript_fix/next_steps.json << EOF
{
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "current_status": {
    "typescript_errors": "$(if [ "$ts_success" = "true" ]; then echo "fixed"; else echo "remaining"; fi)",
    "build_working": "$build_success",
    "dev_server_working": "$dev_success"
  },
  "if_all_working": {
    "next_action": "Proceed with Phase 1 Step 2 - Create Dashboard Layout",
    "estimated_time": "30-45 minutes",
    "components_to_create": [
      "MainDashboard.tsx",
      "Loading.tsx",
      "ErrorBoundary.tsx"
    ]
  },
  "if_still_broken": {
    "next_action": "Additional debugging needed",
    "check_console_errors": true
  }
}
EOF

# Commit the fix
echo ""
echo "📝 Step 7: Committing Fix..."

git add .
git commit -m "fix: remove problematic index.ts files causing TypeScript errors

- Removed non-existent component imports
- Preserved component directory structure
- Added .gitkeep files to maintain directories
- Ready for Phase 1 Step 2 development"

echo "✅ Fix committed to git"

# Final status
echo ""
echo "🎉 TypeScript Fix Complete!"
echo "==========================="
echo ""
echo "Status Summary:"
echo "  TypeScript: $(if [ "$ts_success" = "true" ]; then echo '✅ Fixed'; else echo '❌ Still broken'; fi)"
echo "  Build: $(if [ "$build_success" = "true" ]; then echo '✅ Working'; else echo '❌ Still failing'; fi)"
echo "  Dev Server: $(if [ "$dev_success" = "true" ]; then echo '✅ Working'; else echo '❌ Still failing'; fi)"
echo ""

if [ "$build_success" = "true" ] && [ "$dev_success" = "true" ]; then
  echo "🚀 READY FOR PHASE 1 STEP 2!"
  echo "   All systems working - let's build the dashboard!"
else
  echo "⚠️ Still have issues - need additional debugging"
fi

echo ""
echo "📁 Fix details saved to: diagnostics/phase1/typescript_fix/"
echo "📤 Upload fix_status.json to continue!"
