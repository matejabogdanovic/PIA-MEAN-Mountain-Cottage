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
rezervacijaRouter
  .route("/submitReview")
  .post((req, res) => new ReservationController().submitReview(req, res));

rezervacijaRouter
  .route("/acceptReservation")
  .post((req, res) => new ReservationController().acceptReservation(req, res));

rezervacijaRouter
  .route("/getTakenDates")
  .post((req, res) => new ReservationController().getTakenDates(req, res));

rezervacijaRouter
  .route("/reservationStatistics")
  .get((req, res) =>
    new ReservationController().reservationStatistics(req, res)
  );
rezervacijaRouter
  .route("/cancelReservation")
  .post((req, res) => new ReservationController().cancelReservation(req, res));
export default rezervacijaRouter;
