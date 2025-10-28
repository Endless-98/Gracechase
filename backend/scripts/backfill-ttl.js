#!/usr/bin/env node
/**
 * Backfill TTL for newsletter records missing `ttl`.
 * Sets ttl = now + (TTL_INACTIVE_DAYS || TTL_PENDING_DAYS || 425) days.
 *
 * Usage:
 *   AWS_REGION=us-east-1 NEWSLETTER_TABLE=YourTable node scripts/backfill-ttl.js
 */

const { DynamoDBClient, ScanCommand, UpdateItemCommand } = require('@aws-sdk/client-dynamodb');

const REGION = process.env.AWS_REGION || 'us-east-1';
const TABLE = process.env.NEWSLETTER_TABLE;
const DAYS = parseInt(process.env.TTL_INACTIVE_DAYS || process.env.TTL_PENDING_DAYS || '425', 10);

if (!TABLE) {
  console.error('ERROR: Set NEWSLETTER_TABLE');
  process.exit(1);
}

const ddb = new DynamoDBClient({ region: REGION });

(async () => {
  try {
    let lastKey;
    let updated = 0;
    const nowTtl = () => Math.floor(Date.now() / 1000) + (DAYS * 24 * 60 * 60);

    do {
      const res = await ddb.send(new ScanCommand({
        TableName: TABLE,
        ProjectionExpression: '#id, ttl, #status',
        ExpressionAttributeNames: { '#id': 'id', '#status': 'status' },
        ExclusiveStartKey: lastKey,
        Limit: 100,
      }));
      const items = res.Items || [];

      for (const it of items) {
        const hasTtl = !!(it.ttl && (it.ttl.N || it.ttl.S));
        const id = it.id?.S || it.id?.s || it.id; // tolerate various shapes
        if (!id) continue;
        if (!hasTtl) {
          const ttlVal = nowTtl();
          try {
            await ddb.send(new UpdateItemCommand({
              TableName: TABLE,
              Key: { id: { S: String(id) } },
              UpdateExpression: 'SET ttl = :t',
              ExpressionAttributeValues: { ':t': { N: String(ttlVal) } },
            }));
            updated++;
            if (updated % 50 === 0) console.log('Updated', updated);
          } catch (e) {
            console.warn('Failed to set ttl for id', id, e?.message || e);
          }
        }
      }

      lastKey = res.LastEvaluatedKey;
    } while (lastKey);

    console.log(`Done. Updated ${updated} items with ttl.`);
  } catch (e) {
    console.error('Backfill failed:', e);
    process.exit(1);
  }
})();
