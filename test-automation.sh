#!/bin/bash

echo "🩸 Blood Test Startup Tracker - Automated Updates Demo"
echo "======================================================="
echo ""

API_URL="http://localhost:3001/api"

echo "1. Checking current stats..."
curl -s $API_URL/stats | jq '.'
echo ""

echo "2. Checking for pending updates..."
PENDING=$(curl -s $API_URL/updates/pending)
echo $PENDING | jq '.'
PENDING_COUNT=$(echo $PENDING | jq 'length')
echo "Found $PENDING_COUNT pending updates"
echo ""

echo "3. Viewing updates summary..."
curl -s $API_URL/updates/summary | jq '.'
echo ""

echo "4. Triggering manual data refresh..."
echo "(Note: This will search for real news if API keys are configured)"
curl -s -X POST $API_URL/updates/refresh | jq '.'
echo ""

echo "5. Checking for new pending updates..."
NEW_PENDING=$(curl -s $API_URL/updates/pending)
echo $NEW_PENDING | jq '.'
NEW_COUNT=$(echo $NEW_PENDING | jq 'length')
echo "Now have $NEW_COUNT pending updates"
echo ""

echo "✅ Demo complete!"
echo ""
echo "To approve an update:"
echo "  curl -X POST $API_URL/updates/{id}/approve -H 'Content-Type: application/json' -d '{\"reviewedBy\":\"your-name\"}'"
echo ""
echo "To reject an update:"
echo "  curl -X POST $API_URL/updates/{id}/reject -H 'Content-Type: application/json' -d '{\"reviewedBy\":\"your-name\",\"notes\":\"reason\"}'"
echo ""
echo "Next steps:"
echo "  1. Add NEWS_API_KEY to packages/api/.env"
echo "  2. Uncomment API integration code in newsSearchService.ts"
echo "  3. Run this script again to see real updates!"
