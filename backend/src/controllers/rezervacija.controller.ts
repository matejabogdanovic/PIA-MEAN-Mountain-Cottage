import express from "express";
import RezM from "../models/rezervacija";
import VikM from "../models/vikendica";
import mongoose from "mongoose";
import { read } from "fs";

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
  normalizeDate(d: Date): Date {
    const date = new Date(d);
    date.setHours(0, 0, 0, 0);
    return date;
  }
  doesRangeOverlap(
    start: Date,
    end: Date,
    reservedRanges: { od: Date; do: Date }[]
  ): boolean {
    const startNorm = this.normalizeDate(start);
    const endNorm = this.normalizeDate(end);

    return reservedRanges.some((range) => {
      const rStart = this.normalizeDate(range.od);
      const rEnd = this.normalizeDate(range.do);

      // Ako postoji preklapanje raspona
      return startNorm < rEnd && endNorm > rStart;
    });
  }
  book = (req: express.Request, res: express.Response) => {
    console.log(req.body);
    let cottage_id = req.body.cottage_id;
    VikM.findById(cottage_id).then((cot) => {
      if (!cot) {
        console.log("Vikendica ne postoji.");
        res.json({
          ok: false,
          reason: "Cottage doesn't exist.",
        });
        return;
      }
      if (new Date() < new Date(cot.blokirana_do ?? 0)) {
        console.log("Vikendica je blokirana.");
        res.json({
          ok: false,
          reason: "Cottage not available for booking.",
        });
        return;
      }
      RezM.find({ cottage_id: cottage_id, odbijenica: "", prihvacena: true })
        .then((d) => {
          let takenDates: { od: Date; do: Date }[] = [];
          takenDates = d.map((rez) => ({
            od: new Date(rez.od),
            do: new Date(rez.do),
          }));

          if (
            this.doesRangeOverlap(
              new Date(req.body.od),
              new Date(req.body.do),
              takenDates
            )
          ) {
            res.json({
              ok: false,
              reason: "Please select available dates only. Refresh the page.",
            });
            return;
          }
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
        })
        .catch((err) => {
          console.log(err);
          res.json({
            ok: false,
            reason: "Internal error.",
          });
        });
    });
  };

  acceptReservation = (req: express.Request, res: express.Response) => {
    RezM.findByIdAndUpdate(req.body._id, {
      prihvacena: Boolean(req.body.prihvacena),
      odbijenica: req.body.odbijenica,
    })
      .then((d) => {
        res.json({ ok: true, reason: "" });
      })
      .catch((err) => {
        console.log(err);
        res.json({ ok: false, reason: "Internal error." });
      });
  };
  submitReview = (req: express.Request, res: express.Response) => {
    RezM.findByIdAndUpdate(
      req.body._id,
      {
        $set: {
          komentar_i_ocena: {
            komentar: req.body.komentar,
            ocena: Number(req.body.ocena),
          },
        },
      },
      { new: true }
    )
      .then((d) => {
        if (!d) {
          res.json({ ok: false, reason: "Reservation doesn't exist." });
          return;
        }
        RezM.find({
          cottage_id: d.cottage_id,
          prihvacena: true,
          "komentar_i_ocena.ocena": { $ne: 0 },
        })
          .select("komentar_i_ocena.ocena -_id")
          .then((komentar_i_ocena) => {
            if (!komentar_i_ocena) {
              console.log("Greska komentar i ocene ");
              res.json({ ok: false, reason: "Internal error 2." });
              return;
            }
            console.log(komentar_i_ocena);
            const samoOcene = komentar_i_ocena.map(
              (o) => o.komentar_i_ocena?.ocena
            );

            const suma = samoOcene.reduce((acc: any, val: any) => acc + val, 0);
            const prosek = suma / samoOcene.length;

            VikM.findByIdAndUpdate(d.cottage_id, { $set: { ocena: prosek } })
              .then((result) => {
                res.json({ ok: true, reason: "" });
              })
              .catch((err) => {
                res.json({ ok: true, reason: "Internal error 3." });
                console.log(err);
              });
          });
        // update vikendicu
      })
      .catch((err) => {
        console.log(err);
        res.json({ ok: false, reason: "Internal error." });
      });
  };

  getTakenDates = (req: express.Request, res: express.Response) => {
    let cottage_id = req.body._id;
    RezM.find({ cottage_id: cottage_id, odbijenica: "", prihvacena: true })
      .then((d) => {
        let result: { od: string; do: string }[] = [];
        result = d.map((rez) => ({
          od: rez.od.toISOString(),
          do: rez.do.toISOString(),
        }));
        res.json(result);
      })
      .catch((err) => {
        console.log(err);
        res.json([]);
      });
  };

  cancelReservation = (req: express.Request, res: express.Response) => {
    let _id = req.body._id;
    let cottage_id = req.body.cottage_id;
    let od: Date = new Date(req.body.od);

    let sada: Date = new Date();

    let razlikaMS = od.getTime() - sada.getTime();
    let razlikaDana = razlikaMS / (1000 * 60 * 60 * 24);

    if (razlikaDana >= 1) {
      RezM.deleteOne({ _id, cottage_id, od })
        .then((d) => {
          if (d.deletedCount == 0) {
            res.json({ ok: false, reason: "Cottage doesn't exist." });
            return;
          }
          res.json({ ok: true, reason: "" });
        })
        .catch((err) => {
          console.log(err);
          res.json({ ok: false, reason: "Internal error." });
        });
    } else {
      res.json({ ok: false, reason: "Can't cancel now." });
    }
  };

  reservationStatistics = async (
    req: express.Request,
    res: express.Response
  ) => {
    const sada = new Date();

    const granice = {
      "24h": new Date(sada.getTime() - 24 * 60 * 60 * 1000),
      "7d": new Date(sada.getTime() - 7 * 24 * 60 * 60 * 1000),
      "30d": new Date(sada.getTime() - 30 * 24 * 60 * 60 * 1000),
    };

    const rezultati: any = {};

    Promise.all(
      Object.entries(granice).map(([period, granica]) =>
        RezM.countDocuments({
          createdAt: { $gte: granica },
          prihvacena: true,
        }).then((broj) => {
          rezultati[period] = broj;
        })
      )
    ).then(() => {
      res.json(rezultati);
    });
  };
}
