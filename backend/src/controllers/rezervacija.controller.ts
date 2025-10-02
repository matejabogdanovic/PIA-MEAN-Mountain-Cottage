import express from "express";
import RezM from "../models/rezervacija";
import VikM from "../models/vikendica";
import mongoose from "mongoose";

export class ReservationController {
  getAllReservations = (req: express.Request, res: express.Response) => {
    RezM.find({})
      .then((d) => {
        res.json(d);
      })
      .catch((err) => {
        console.log(err);
        res.json([]);
      });
  };
  getMyReservations = (req: express.Request, res: express.Response) => {
    let user_id = req.body.user_id; // string

    let query: any = { user_id: new mongoose.Types.ObjectId(user_id) };

    RezM.find(query)
      .populate("cottage_id") // fetch vikendicu
      .then((rezervacije) => {
        res.json(rezervacije);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json([]);
      });
  };
  getMyReservationsOwner = (req: express.Request, res: express.Response) => {
    let user_id = req.body.user_id; // string

    let query: any = { vlasnik: new mongoose.Types.ObjectId(user_id) };

    VikM.find(query)
      .then((vikendice) => {
        const promises = vikendice.map((vik) => {
          return RezM.find({ cottage_id: vik._id }).then((rezervacije) => {
            // za svaku rezervaciju zamenimo cottage_id sa objekatom vikendice
            return rezervacije.map((r) => ({
              ...r.toObject(),
              cottage_id: vik.toObject(),
            }));
          });
        });

        Promise.all(promises)
          .then((rezervacijePoVikendicama) => {
            const sveRezervacije: any[] = rezervacijePoVikendicama.flat();
            res.json(sveRezervacije);
          })
          .catch((err) => {
            console.error(err);
            res.json([]);
          });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json([]);
      });
  };
  book = (req: express.Request, res: express.Response) => {
    console.log(req.body);
    RezM.create({
      ...req.body,
      prihvacena: false,
      odbijenica: "",
      komentar_i_ocena: {
        komentar: "",
        ocena: 0,
      },
    })
      .then((d) => {
        res.json({ ok: true, reason: "" });
      })
      .catch((err) => {
        console.log(err);
        res.json({ ok: false, reason: "Internal error." });
      });
  };
}
