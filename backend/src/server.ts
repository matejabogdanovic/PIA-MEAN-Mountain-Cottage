import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import userRouter from "./routers/korisnikRouter.router";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/planinska_vikendica");
const conn = mongoose.connection;
conn.once("open", () => {
  console.log("DB ok");
});

const router = express.Router();

router.use("/korisnici", userRouter);
app.use("/", router);
// slike dostupne kao link
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.listen(4000, () => console.log("Express running on port 4000"));
