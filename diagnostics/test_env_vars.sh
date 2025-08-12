#!/bin/bash

echo "🔍 Environment Variable Diagnostic"
echo "================================="
echo ""

echo "📁 .env.local file contents:"
if [ -f ".env.local" ]; then
    cat .env.local | grep -v "^#" | grep -v "^$"
else
    echo "❌ .env.local file not found"
fi

echo ""
echo "🔧 Next.js process check:"
ps aux | grep "next dev" | grep -v grep || echo "No Next.js dev server running"

echo ""
echo "📋 Instructions:"
echo "1. Ensure .env.local exists in project root"
echo "2. Kill existing dev server: pkill -f 'next dev'"
echo "3. Clear Next.js cache: rm -rf .next"
echo "4. Start fresh: yarn dev"
echo "5. Check browser at http://localhost:3000"

echo ""
echo "✅ Environment variables should appear in the debug section"
