import express from "express";
import cors from "cors";
import { config } from "./config/config.js";
import morgan from "morgan";
import authRouter from "./modules/auth/auth.router.js";

export const app = express();

app.set("port", config.PORT);

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/auth", authRouter);

app.get("/", (req, res) => {
  res.send("API running");
});