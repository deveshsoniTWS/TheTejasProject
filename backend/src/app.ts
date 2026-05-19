import express from "express";
import cors from "cors";
import { config } from "./config/config.js";
import morgan from "morgan";

export const app = express();

app.set("port", config.PORT);

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("API running");
});