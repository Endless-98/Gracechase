import { defineFunction } from "@aws-amplify/backend";

export const sendEmail = defineFunction({
  name: "send-email",
  entry: "./handler.ts",
  environment: {
    AWS_REGION: "us-east-1",
    FROM_EMAIL: "contact.gracechase@gmail.com",
    TO_EMAIL: "contact.gracechase@gmail.com"
  }
});