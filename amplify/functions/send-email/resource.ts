import { defineFunction } from "@aws-amplify/backend";

export const sendEmail = defineFunction({
  name: "send-email",
  entry: "./handler.ts",
  environment: {
    AWS_REGION: "us-east-1",
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID!,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY!,
    FROM_EMAIL: "contact.gracechase@gmail.com",
    TO_EMAIL: "contact.gracechase@gmail.com"
  }
});