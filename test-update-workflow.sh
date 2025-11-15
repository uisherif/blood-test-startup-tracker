#!/bin/bash

echo "🧪 Testing Update Workflow with Mock Data"
echo "=========================================="
echo ""

API_URL="http://localhost:3001/api"

echo "Step 1: Creating a mock pending update..."
echo ""

# Create a mock update by directly adding to pending-updates.json
cat > data/pending-updates.json << 'EOF'
[
  {
    "id": "test-function-health-totalFunding-1731654321000",
    "startupId": "function-health",
    "field": "totalFunding",
    "oldValue": 306000000,
    "newValue": 500000000,
    "source": "https://techcrunch.com/2025/11/14/function-health-raises-200m-series-c",
    "confidence": "high",
    "timestamp": "2025-11-14T12:00:00Z",
    "status": "pending"
  },
  {
    "id": "test-everlywell-estimatedUsers-1731654322000",
    "startupId": "everlywell",
    "field": "estimatedUsers",
    "oldValue": 60000000,
    "newValue": 65000000,
    "source": "https://forbes.com/2025/11/13/everlywell-reaches-65-million-users",
    "confidence": "medium",
    "timestamp": "2025-11-13T10:00:00Z",
    "status": "pending"
  }
]
EOF

echo "✅ Created 2 mock updates"
echo ""

echo "Step 2: View pending updates..."
echo ""
curl -s $API_URL/updates/pending | jq '.'
echo ""

echo "Step 3: View summary..."
echo ""
curl -s $API_URL/updates/summary | jq '.'
echo ""

echo "Step 4: Review the first update details..."
echo ""
FIRST_UPDATE=$(curl -s $API_URL/updates/pending | jq -r '.[0]')
echo "$FIRST_UPDATE" | jq '.'
UPDATE_ID=$(echo "$FIRST_UPDATE" | jq -r '.id')
echo ""

echo "Update Details:"
echo "  ID: $UPDATE_ID"
echo "  Startup: $(echo "$FIRST_UPDATE" | jq -r '.startupId')"
echo "  Field: $(echo "$FIRST_UPDATE" | jq -r '.field')"
echo "  Old Value: $$(echo "$FIRST_UPDATE" | jq -r '.oldValue' | awk '{printf "%.0fM", $1/1000000}')"
echo "  New Value: $$(echo "$FIRST_UPDATE" | jq -r '.newValue' | awk '{printf "%.0fM", $1/1000000}')"
echo "  Source: $(echo "$FIRST_UPDATE" | jq -r '.source')"
echo "  Confidence: $(echo "$FIRST_UPDATE" | jq -r '.confidence')"
echo ""

echo "Step 5: Approve the first update (high confidence)..."
echo ""
curl -s -X POST $API_URL/updates/$UPDATE_ID/approve \
  -H "Content-Type: application/json" \
  -d '{"reviewedBy":"sherif"}' | jq '.'
echo ""

echo "Step 6: Reject the second update (needs verification)..."
echo ""
SECOND_UPDATE_ID=$(curl -s $API_URL/updates/pending | jq -r '.[0].id')
curl -s -X POST $API_URL/updates/$SECOND_UPDATE_ID/reject \
  -H "Content-Type: application/json" \
  -d '{
    "reviewedBy":"sherif",
    "notes":"Medium confidence - need to verify from official source before applying"
  }' | jq '.'
echo ""

echo "Step 7: View final summary..."
echo ""
curl -s $API_URL/updates/summary | jq '.'
echo ""

echo "Step 8: View all updates (including approved/rejected)..."
echo ""
cat data/pending-updates.json | jq '.'
echo ""

echo "✅ Workflow test complete!"
echo ""
echo "What happened:"
echo "  1. Created 2 mock updates (one high confidence, one medium)"
echo "  2. Viewed pending updates"
echo "  3. Approved the high-confidence update"
echo "  4. Rejected the medium-confidence update with notes"
echo "  5. Checked final status"
echo ""
echo "In production, approved updates would automatically update data/startups.json"
