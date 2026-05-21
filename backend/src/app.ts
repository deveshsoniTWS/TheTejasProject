import express from "express";
import cors from "cors";
import { config } from "./config/config";
import morgan from "morgan";
import authRouter from "./modules/auth/auth.router";

export const app = express();

app.set("port", config.PORT);

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

const apiRouter = express.Router();
apiRouter.use("/auth", authRouter);

app.use("/api/v1", apiRouter);

app.get("/", (req, res) => {
  res.send("API running");
});