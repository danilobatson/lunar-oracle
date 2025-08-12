#!/bin/bash

# Ensure we're in the right directory
cd /Users/batson/Desktop/ForTheNerds/CreatorBid/lunar-oracle

echo "🔍 Starting Phase 2 Diagnostic Check..."
echo "Project: LunarOracle"
echo "Phase: Starting Phase 2 - Core Prediction Engine"
echo "Date: $(date)"

# Create diagnostic output file
cat > diagnostics/phase2/current_status.json << EOD
{
  "diagnostic_timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "phase": "Phase 2 Diagnostic",
  "project_location": "$(pwd)",
  "git_status": {
    "current_branch": "$(git branch --show-current 2>/dev/null || echo 'not_git_repo')",
    "last_commit": "$(git log -1 --oneline 2>/dev/null || echo 'no_commits')",
    "working_directory_clean": $(git diff --quiet 2>/dev/null && echo 'true' || echo 'false'),
    "untracked_files": $(git ls-files --others --exclude-standard 2>/dev/null | wc -l || echo '0')
  },
  "project_structure": {
    "package_json_exists": $(test -f package.json && echo 'true' || echo 'false'),
    "src_directory_exists": $(test -d src && echo 'true' || echo 'false'),
    "components_directory_exists": $(test -d src/components && echo 'true' || echo 'false'),
    "lib_directory_exists": $(test -d src/lib && echo 'true' || echo 'false'),
    "api_directory_exists": $(test -d src/app/api && echo 'true' || echo 'false')
  }
}
EOD

# Check file structure in detail
echo "📁 Checking project file structure..."
if [ -d "src" ]; then
  find src -type f -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | sort > diagnostics/phase2/file_list.txt

  cat > diagnostics/phase2/file_structure.json << EOD
{
  "src_files": [
$(find src -type f -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | sort | sed 's/.*/"&"/' | paste -sd, -)
  ],
  "total_files": $(find src -type f -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | wc -l),
  "components_found": [
$(find src/components -name "*.tsx" 2>/dev/null | sort | sed 's/.*/"&"/' | paste -sd, - || echo '')
  ],
  "lib_files": [
$(find src/lib -name "*.ts" 2>/dev/null | sort | sed 's/.*/"&"/' | paste -sd, - || echo '')
  ],
  "api_routes": [
$(find src/app/api -name "route.ts" 2>/dev/null | sort | sed 's/.*/"&"/' | paste -sd, - || echo '')
  ]
}
EOD
else
  echo '{"error": "src directory not found"}' > diagnostics/phase2/file_structure.json
fi

# Check environment variables
echo "🔐 Checking environment variables..."
ENV_FILE=""
if [ -f ".env.local" ]; then
  ENV_FILE=".env.local"
elif [ -f ".env" ]; then
  ENV_FILE=".env"
fi

if [ -n "$ENV_FILE" ]; then
  cat > diagnostics/phase2/env_status.json << EOD
{
  "env_file_found": "$ENV_FILE",
  "lunarcrush_key_present": $(grep -q "LUNARCRUSH_API_KEY" "$ENV_FILE" && echo 'true' || echo 'false'),
  "gemini_key_present": $(grep -q "GEMINI_API_KEY" "$ENV_FILE" && echo 'true' || echo 'false'),
  "environment_set": $(grep -q "ENVIRONMENT" "$ENV_FILE" && echo 'true' || echo 'false'),
  "total_env_vars": $(grep -c "=" "$ENV_FILE" 2>/dev/null || echo '0')
}
EOD
else
  echo '{"env_file_found": false, "error": "No .env or .env.local file found"}' > diagnostics/phase2/env_status.json
fi

# Check package.json and dependencies
echo "📦 Checking package.json and dependencies..."
if [ -f "package.json" ]; then
  cat > diagnostics/phase2/dependencies.json << EOD
{
  "package_manager": "$(which yarn >/dev/null && echo 'yarn' || echo 'npm')",
  "node_modules_exists": $(test -d node_modules && echo 'true' || echo 'false'),
  "dependencies": $(cat package.json | python3 -c "import sys, json; data=json.load(sys.stdin); print(json.dumps(data.get('dependencies', {}), indent=2))" 2>/dev/null || echo '{}'),
  "dev_dependencies": $(cat package.json | python3 -c "import sys, json; data=json.load(sys.stdin); print(json.dumps(data.get('devDependencies', {}), indent=2))" 2>/dev/null || echo '{}'),
  "scripts": $(cat package.json | python3 -c "import sys, json; data=json.load(sys.stdin); print(json.dumps(data.get('scripts', {}), indent=2))" 2>/dev/null || echo '{}')
}
EOD
else
  echo '{"error": "package.json not found"}' > diagnostics/phase2/dependencies.json
fi

# Test build status
echo "🔨 Testing build status..."
if [ -f "package.json" ]; then
  echo "Running TypeScript check..."
  yarn tsc --noEmit > diagnostics/phase2/typescript_check.log 2>&1
  TS_EXIT_CODE=$?

  echo "Testing build..."
  yarn build > diagnostics/phase2/build_test.log 2>&1
  BUILD_EXIT_CODE=$?

  cat > diagnostics/phase2/build_status.json << EOD
{
  "typescript_check": {
    "passed": $([ $TS_EXIT_CODE -eq 0 ] && echo 'true' || echo 'false'),
    "exit_code": $TS_EXIT_CODE
  },
  "build_test": {
    "passed": $([ $BUILD_EXIT_CODE -eq 0 ] && echo 'true' || echo 'false'),
    "exit_code": $BUILD_EXIT_CODE
  }
}
EOD
else
  echo '{"error": "Cannot test build - package.json not found"}' > diagnostics/phase2/build_status.json
fi

# Check if specific Phase 1 files exist
echo "✅ Checking Phase 1 deliverables..."
PHASE1_FILES=(
  "src/components/dashboard/MainDashboard.tsx"
  "src/components/shared/Loading.tsx"
  "src/components/shared/ErrorBoundary.tsx"
  "src/lib/lunarcrush.ts"
  "src/lib/gemini.ts"
  "src/app/api/health/route.ts"
  "src/app/api/topic/[symbol]/route.ts"
  "src/app/api/predict/route.ts"
)

cat > diagnostics/phase2/phase1_deliverables.json << EOD
{
  "phase1_files_status": {
EOD

for i in "${!PHASE1_FILES[@]}"; do
  file="${PHASE1_FILES[$i]}"
  exists=$(test -f "$file" && echo 'true' || echo 'false')
  echo "    \"$file\": $exists$([ $i -lt $((${#PHASE1_FILES[@]} - 1)) ] && echo ',')" >> diagnostics/phase2/phase1_deliverables.json
done

echo "  }" >> diagnostics/phase2/phase1_deliverables.json
echo "}" >> diagnostics/phase2/phase1_deliverables.json

# Generate summary report
echo "📊 Generating summary report..."
cat > diagnostics/phase2/diagnostic_summary.json << EOD
{
  "diagnostic_complete": true,
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "phase": "Ready for Phase 2",
  "next_steps": [
    "Review all diagnostic JSON files",
    "Verify Phase 1 deliverables are complete",
    "Begin Phase 2 Step 1: Enhanced LunarCrush Service"
  ],
  "files_generated": [
    "diagnostics/phase2/current_status.json",
    "diagnostics/phase2/file_structure.json",
    "diagnostics/phase2/env_status.json",
    "diagnostics/phase2/dependencies.json",
    "diagnostics/phase2/build_status.json",
    "diagnostics/phase2/phase1_deliverables.json",
    "diagnostics/phase2/diagnostic_summary.json"
  ]
}
EOD

echo ""
echo "✅ Diagnostic complete!"
echo "📁 All diagnostic files saved to: diagnostics/phase2/"
echo ""
echo "📋 Please upload these JSON files to the conversation:"
echo "   • diagnostics/phase2/current_status.json"
echo "   • diagnostics/phase2/file_structure.json"
echo "   • diagnostics/phase2/env_status.json"
echo "   • diagnostics/phase2/dependencies.json"
echo "   • diagnostics/phase2/build_status.json"
echo "   • diagnostics/phase2/phase1_deliverables.json"
echo "   • diagnostics/phase2/diagnostic_summary.json"
echo ""
echo "🚀 Ready to begin Phase 2 development!"
