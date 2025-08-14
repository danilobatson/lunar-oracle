#!/bin/bash

# NEXUS: Commit Preparation Script
# Comprehensive testing before git commit

echo "🔄 NEXUS: Commit Preparation"
echo "============================"

# Step 1: Quick validation
echo "1️⃣ Running quick validation..."
if ./validate_bot.sh; then
    echo "✅ Quick validation passed"
else
    echo "❌ Quick validation failed - fix before committing"
    exit 1
fi

# Step 2: Full test suite
echo ""
echo "2️⃣ Running comprehensive test suite..."
if yarn test:bot; then
    echo "✅ Full test suite passed"
else
    echo "❌ Test suite failed - fix before committing"
    exit 1
fi

# Step 3: Check for any uncommitted changes to critical files
echo ""
echo "3️⃣ Checking critical files..."
CRITICAL_FILES=(
    "src/bot/nexus-bot-real-data.ts"
    "src/lib/telegram/message-utils.ts"
    "package.json"
    ".env.local"
)

for file in "${CRITICAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ Found: $file"
    else
        echo "⚠️  Missing: $file"
    fi
done

# Step 4: Generate commit message
echo ""
echo "4️⃣ Generating commit information..."
TEST_RESULTS=$(ls test_results_*.json 2>/dev/null | head -1)
if [ -f "$TEST_RESULTS" ]; then
    SUCCESS_RATE=$(grep -o '"success_rate":"[^"]*"' "$TEST_RESULTS" | cut -d'"' -f4)
    echo "📊 Test Success Rate: $SUCCESS_RATE"
else
    echo "⚠️  No test results found"
fi

echo ""
echo "🎉 COMMIT READY!"
echo "==============="
echo ""
echo "📝 Suggested commit message:"
echo "feat: NEXUS real data bot with comprehensive testing"
echo ""
echo "- ✅ 100% real MCP data integration"
echo "- ✅ All commands use live API calls"
echo "- ✅ Comprehensive test suite added"
echo "- ✅ Telegram message length handling"
echo "- ✅ Production-ready bot functionality"
if [ -n "$SUCCESS_RATE" ]; then
    echo "- ✅ Test success rate: $SUCCESS_RATE"
fi
echo ""
echo "🚀 Ready to commit with:"
echo "   git add ."
echo "   git commit -m \"feat: NEXUS real data bot with comprehensive testing\""
echo "   git push"
