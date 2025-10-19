const { DynamoDBClient, ScanCommand, DeleteItemCommand } = require('@aws-sdk/client-dynamodb');

// This lambda should be scheduled (CloudWatch Events / EventBridge) to run periodically (e.g., hourly).
// It scans the newsletter table for items with a ttl (epoch seconds) <= now and deletes them.

const REGION = process.env.AWS_REGION || 'us-east-1';
const TABLE_NAME = process.env.NEWSLETTER_TABLE;

if (!TABLE_NAME) {
  console.error('NEED NEWSLETTER_TABLE env var');
}

const client = new DynamoDBClient({ region: REGION });

exports.handler = async () => {
  if (!TABLE_NAME) return { statusCode: 500, body: 'Missing TABLE_NAME' };

  try {
    let ExclusiveStartKey = undefined;
    const nowEpoch = Math.floor(Date.now() / 1000);
    let deleted = 0;

    do {
      const scanCmd = new ScanCommand({
        TableName: TABLE_NAME,
        // No FilterExpression to avoid type mismatches; we'll filter client-side
        ExclusiveStartKey,
        Limit: 1000,
      });

      const res = await client.send(scanCmd);
      const items = res.Items || [];

      for (const it of items) {
        // Determine TTL if present (support both Number and String attributes)
        let ttlVal;
        if (it.ttl && typeof it.ttl.N === 'string') {
          ttlVal = parseInt(it.ttl.N, 10);
        } else if (it.ttl && typeof it.ttl.S === 'string') {
          const parsed = parseInt(it.ttl.S, 10);
          ttlVal = Number.isFinite(parsed) ? parsed : undefined;
        }

        if (ttlVal && ttlVal <= nowEpoch) {
          const key = { id: it.id }; // assumes simple PK { id }
          const del = new DeleteItemCommand({ TableName: TABLE_NAME, Key: key });
          try {
            await client.send(del);
            deleted += 1;
          } catch (e) {
            console.warn('Failed to delete', key, e);
          }
        }
      }

      ExclusiveStartKey = res.LastEvaluatedKey;
    } while (ExclusiveStartKey);

    return { statusCode: 200, body: `Deleted ${deleted} expired items` };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: String(err) };
  }
};
