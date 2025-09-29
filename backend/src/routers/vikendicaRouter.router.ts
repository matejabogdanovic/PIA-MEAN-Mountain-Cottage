import express from "express";
import { CottageController } from "../controllers/vikendica.controller";

const vikendicaRouter = express.Router();

vikendicaRouter
  .route("/getAllCottages")
  .get((req, res) => new CottageController().getAllCottages(req, res));

vikendicaRouter
  .route("/getAllCottages/:korisnicko_ime")
  .get((req, res) => new CottageController().getAllCottagesUsername(req, res));
vikendicaRouter
  .route("/addCottage/:korisnicko_ime")
  .post((req, res) => new CottageController().addCottage(req, res));
vikendicaRouter
  .route("/editCottage")
  .post((req, res) => new CottageController().editCottage(req, res));

vikendicaRouter
  .route("/deleteCottage/:_id")
  .delete((req, res) => new CottageController().deleteCottage(req, res));

export default vikendicaRouter;
