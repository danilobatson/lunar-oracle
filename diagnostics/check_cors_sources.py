#!/usr/bin/env python3

import os
import re

def check_file_for_fetch_calls(filepath):
    try:
        with open(filepath, 'r') as f:
            content = f.read()

        # Look for fetch, axios, or direct HTTP calls
        patterns = [
            r'fetch\s*\(',
            r'axios\.',
            r'http://|https://',
            r'\.get\(',
            r'\.post\(',
            r'/api/',
            r'localhost:\d+'
        ]

        found_issues = []
        for i, line in enumerate(content.split('\n'), 1):
            for pattern in patterns:
                if re.search(pattern, line, re.IGNORECASE):
                    found_issues.append(f"Line {i}: {line.strip()}")

        return found_issues
    except Exception as e:
        return [f"Error reading file: {e}"]

# Check all TypeScript files
src_files = []
for root, dirs, files in os.walk('src'):
    for file in files:
        if file.endswith(('.ts', '.tsx')):
            src_files.append(os.path.join(root, file))

print("🔍 Checking for potential CORS sources...")
for filepath in src_files:
    issues = check_file_for_fetch_calls(filepath)
    if issues:
        print(f"\n📁 {filepath}:")
        for issue in issues:
            print(f"  ⚠️  {issue}")

print("\n✅ CORS source check complete")
