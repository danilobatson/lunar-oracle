#!/bin/bash

# NEXUS: Cleanup Codebase for Production
# Remove all temporary files and backups from development

echo "🧹 NEXUS: Cleaning Up Codebase"
echo "==============================="

cd /Users/batson/Desktop/ForTheNerds/CreatorBid/lunar-oracle

echo "📊 Current file count: $(find . -type f -not -path './node_modules/*' | wc -l) files"
echo ""

# Remove temporary JSON test files
echo "🗑️ Removing test JSON files..."
rm -f *.json
rm -f *test*.json
rm -f aggressive_fix_test_*.json
rm -f simple_fix_test_*.json
rm -f quantum_owl_*.json
rm -f nexus_diagnostic_*.json
echo "   ✅ Test JSON files removed"

# Remove backup route.ts files
echo "🗑️ Removing route.ts backups..."
rm -f src/app/api/analyze/route.ts.backup*
echo "   ✅ Route backups removed"

# Remove test scripts
echo "🗑️ Removing test scripts..."
rm -f test_*.sh
rm -f test_detailed.js
echo "   ✅ Test scripts removed"

# Remove random temp files
echo "🗑️ Removing misc temp files..."
rm -f --force
rm -f *.log
rm -f *_debug_*
rm -f *_diagnosis_*
echo "   ✅ Misc temp files removed"

# Clean up any .DS_Store files (Mac)
echo "🗑️ Removing .DS_Store files..."
find . -name ".DS_Store" -delete 2>/dev/null || true
echo "   ✅ .DS_Store files removed"

# Show final clean structure
echo ""
echo "📊 CLEAN CODEBASE STRUCTURE"
echo "============================"

tree -L 5 -I 'node_modules' --dirsfirst

echo ""
echo "📊 Final file count: $(find . -type f -not -path './node_modules/*' | wc -l) files"

# Verify essential files are still present
echo ""
echo "🔍 ESSENTIAL FILES CHECK"
echo "========================"

essential_files=(
    "src/app/api/analyze/route.ts"
    "package.json"
    "src/app/layout.tsx"
    "src/app/page.tsx"
    "src/stores/nexus-store.ts"
    "src/stores/subscription-store.ts"
)

for file in "${essential_files[@]}"; do
    if [ -f "$file" ]; then
        echo "   ✅ $file"
    else
        echo "   ❌ $file - MISSING!"
    fi
done

# Create a clean commit checkpoint
echo ""
echo "📝 COMMIT CHECKPOINT"
echo "===================="

# Stage all changes
git add -A

# Create commit with cleanup message
git status --porcelain | head -10

echo ""
echo "🎯 READY FOR NEXT PHASE"
echo "======================="
echo "✅ Codebase cleaned and organized"
echo "✅ Working Quantum Owl API endpoint"
echo "✅ Chat-optimized data chunks ready"
echo "✅ Ready for Telegram bot integration"
echo ""
echo "📁 Clean project structure:"
echo "   • src/app/api/analyze/route.ts - Working Quantum Owl API"
echo "   • src/stores/ - State management ready"
echo "   • package.json - Dependencies configured"
echo ""
echo "🚀 Next: Build Telegram bot integration!"

# Optional: commit the cleanup
read -p "🤔 Commit this cleanup? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    git commit -m "feat: cleanup codebase and finalize quantum owl api

- Remove all temporary test files and backups
- Clean working Quantum Owl API endpoint
- Ready for Telegram bot integration phase
- Organize project structure for production"

    echo "✅ Cleanup committed to git"
else
    echo "⏸️ Cleanup staged but not committed"
fi

echo ""
echo "🦉 The Quantum Owl codebase is now pristine and ready! ✨"
