import express from "express";
import { CottageController } from "../controllers/vikendica.controller";
import path from "path";
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req: any, file: any, cb: any) {
    cb(null, "uploads/");
  },
  filename: function (req: any, file: any, cb: any) {
    cb(
      null,
      path.basename(file.originalname) +
        Date.now() +
        path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage,
  fileFilter(req: any, file: any, cb: any) {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only pictures allowed!"), false);
    }
  },
});

const vikendicaRouter = express.Router();

vikendicaRouter
  .route("/getAllCottages")
  .get((req, res) => new CottageController().getAllCottages(req, res));

vikendicaRouter
  .route("/getAllCottages/:korisnicko_ime")
  .get((req, res) => new CottageController().getAllCottagesUsername(req, res));

vikendicaRouter
  .route("/addCottage/:korisnicko_ime")
  .post(upload.array("files", 10), (req, res) =>
    new CottageController().addCottage(req, res)
  );

vikendicaRouter
  .route("/editCottage")
  .post(upload.array("files", 10), (req, res) =>
    new CottageController().editCottage(req, res)
  );

vikendicaRouter
  .route("/deleteCottage/:_id")
  .delete((req, res) => new CottageController().deleteCottage(req, res));

export default vikendicaRouter;
