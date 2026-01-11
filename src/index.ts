import { httpServerHandler } from "cloudflare:node";
import express from "express";

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Health check endpoint
app.get("/healthz", (req, res) => {
  res.status(200).send("looks healthy")
})

app.listen(3000);
export default httpServerHandler({ port: 3000 });