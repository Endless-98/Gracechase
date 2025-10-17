import { defineFunction } from "@aws-amplify/backend";

export const sendEmail = defineFunction({
  name: "send-email",
  entry: "./index.ts",
  environment: {
    FROM_EMAIL: "contact.gracechase@gmail.com",
    TO_EMAIL: "contact.gracechase@gmail.com"
  }
});