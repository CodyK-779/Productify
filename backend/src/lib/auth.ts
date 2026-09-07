import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db/db.js";
import * as schema from "../db/schema/schema.js"

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET!,
  trustedOrigins: [process.env.FRONTEND_URL!],
  database: drizzleAdapter(db, {
    provider: "pg",
    schema
  }),
  emailAndPassword: { 
    enabled: true,
  },
  user: {
    additionalFields: {
      imgPublicId: {
        type: "string", required: false, input: true
      }
    }
  }
});