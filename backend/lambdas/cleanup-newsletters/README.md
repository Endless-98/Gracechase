Deploy instructions for cleanup-newsletters Lambda

- Purpose: Remove newsletter records that were marked for deletion (have a `ttl` attribute <= now).

- Steps:
  1. Package and deploy the Lambda to AWS (Node 18+ runtime recommended).
  2. Set environment variable `NEWSLETTER_TABLE` to the DynamoDB table name used by Amplify for NewsletterSignup.
  3. Give the Lambda an IAM role with permissions:
     - dynamodb:Scan on the table
     - dynamodb:DeleteItem on the table
  4. Create an EventBridge rule to run the Lambda hourly (or as needed).

- Optional: Alternatively enable DynamoDB TTL on the table using the `ttl` attribute. This requires the table name and console/API access and is often simpler.

- Note: The Lambda assumes the Newsletter table's primary key is `id`. If your table uses a different key shape (composite key), adjust the DeleteItem key in the code accordingly.
