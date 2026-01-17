import { httpServerHandler } from "cloudflare:node";
import express from "express";
import cors from 'cors'
import {status} from "http-status"

import { globalErrorHandler } from "@/utils/errorHandler";
import { handleContactEmail } from "@/handlers/contact";
import ApiError from "@/utils/ApiError";

const app = express();

const corsOptions = {
  origin: [ "https://soumil4561.github.io", "http://localhost:3000"],
  methods: ["GET", "POST"]
}

app.use(cors(corsOptions))

// Middleware to parse JSON bodies
app.use(express.json());

//Route Defs:
app.post("/send-contact-email", handleContactEmail)

// Health check endpoint
app.get("/healthz", (req, res) => {
  res.status(status.OK).send({
    success: true,
    data: null,
    message: "OPERATION_COMPLETED_SUCCESSULLY",
  })
})

app.use((req, res, next) => {
  next(new ApiError(status.NOT_FOUND, 'Not found'));
});

app.use(globalErrorHandler);

app.listen(8080);
export default httpServerHandler({ port: 8080 });
