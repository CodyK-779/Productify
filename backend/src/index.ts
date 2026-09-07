import express from "express";
import { ENV } from "./config/env.js";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: ENV.FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.all('/api/auth/*splat', toNodeHandler(auth));

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to my Productify API - Powered by PostgreSQL, Drizzle ORM & Better Auth",
    endpoints: {
      users: "/api/users",
      products: "/api/products",
      comments: "/api/comments"
    }
  })
})

app.listen(ENV.PORT, () => console.log(`Server is running on http://localhost:${ENV.PORT}`))