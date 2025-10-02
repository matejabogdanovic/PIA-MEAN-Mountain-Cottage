import express from "express";
import { ReservationController } from "../controllers/rezervacija.controller";

const rezervacijaRouter = express.Router();

rezervacijaRouter
  .route("/getAllReservations")
  .get((req, res) => new ReservationController().getAllReservations(req, res));
rezervacijaRouter
  .route("/book")
  .post((req, res) => new ReservationController().book(req, res));
rezervacijaRouter
  .route("/getMyReservations")
  .post((req, res) => new ReservationController().getMyReservations(req, res));
rezervacijaRouter
  .route("/getMyReservationsOwner")
  .post((req, res) =>
    new ReservationController().getMyReservationsOwner(req, res)
  );

export default rezervacijaRouter;
