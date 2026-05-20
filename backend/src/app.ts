import express from "express";
import cors from "cors";
import { config } from "./config/config.js";

export const app = express();

app.set("port", config.PORT);

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API running");
});