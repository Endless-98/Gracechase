import { defineFunction } from '@aws-amplify/backend';

export const newsletterConfirm = defineFunction({
  name: 'newsletter-confirm',
  entry: './handler.ts',
  runtime: 20,
  environment: {
    FROM_EMAIL: 'contact.gracechase@gmail.com',
    SUBJECT_TEMPLATE: 'Thanks for subscribing to Gracechase',
  },
  timeoutSeconds: 15,
  permissions: {
    policies: [
      {
        Effect: 'Allow',
        Action: ['ses:SendEmail', 'ses:SendRawEmail'],
        Resource: '*',
      },
    ],
  },
});
