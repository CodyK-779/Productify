import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db/db.js";
import * as schema from "../db/schema/schema.js"

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins: [process.env.FRONTEND_URL!],
  advanced: {
    database: {
      joins: true,
    },
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema
  }),
  session: {
    cookieCache: {
      enabled: true,
    },
  },
  emailAndPassword: { 
    enabled: true,
  },
  socialProviders: {
    google: { 
      clientId: process.env.GOOGLE_CLIENT_ID as string, 
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
    },
    github: { 
      clientId: process.env.GITHUB_CLIENT_ID as string, 
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string, 
    },
  },
  user: {
    additionalFields: {
      imgPublicId: {
        type: "string", required: false, input: true
      }
    }
  }
});