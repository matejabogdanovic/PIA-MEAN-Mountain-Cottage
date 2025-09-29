import express from "express";
import VikM from "../models/vikendica";
import KorM from "../models/korisnik";

export class CottageController {
  getAllCottages = (req: express.Request, res: express.Response) => {
    VikM.find({})

      .then((d) => {
        res.json(d);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  getAllCottagesUsername = async (
    req: express.Request,
    res: express.Response
  ) => {
    let korisnicko_ime = req.params["korisnicko_ime"];

    try {
      const vlasnik = await KorM.findOne({ korisnicko_ime });
      if (!vlasnik) {
        res.json({ ok: false, reason: "User doesn't exist." });
        return;
      }
      VikM.find({ vlasnik: vlasnik._id })
        .then((d) => {
          res.json(d);
        })
        .catch((err) => {
          console.log(err);
          res.json({ ok: false, reason: "Internal error." });
        });
    } catch (err) {
      console.error(err);
      res.json({ ok: false, reason: "Internal error." });
    }
  };

  addCottage = async (req: express.Request, res: express.Response) => {
    let korisnicko_ime = req.params["korisnicko_ime"];
    let vikendica = req.body.vikendica;
    try {
      const vlasnik = await KorM.findOne({ korisnicko_ime });
      if (!vlasnik) {
        res.json({ ok: false, reason: "User doesn't exist." });
        return;
      }
      vikendica.vlasnik = vlasnik._id;
      // ukloni _id ako postoji, Mongoose ce generistai sam
      if ("_id" in vikendica) delete vikendica._id;

      VikM.create(vikendica)
        .then((d) => {
          res.json({ ok: true, reason: "" });
        })
        .catch((err) => {
          console.error(err);
          res.json({
            ok: false,
            reason: "Make sure that fields are in required format.",
          });
        });
    } catch (err) {
      console.error(err);
      res.json({ ok: false, reason: "Internal error." });
    }
  };

  editCottage = (req: express.Request, res: express.Response) => {
    let vikendica = req.body.vikendica;
    // delete slike isto todo
    if (!vikendica) {
      res.json({ ok: false, reason: "Invalid query." });
      console.log("editCottage: korisnik null");
      return;
    }
    VikM.updateOne(
      {
        _id: vikendica._id,
      },
      {
        $set: {
          naziv: vikendica.naziv,
          mesto: vikendica.mesto,
          koordinate: vikendica.koordinate,
          usluge: vikendica.usluge,
          cenovnik: vikendica.cenovnik,
          telefon: vikendica.telefon,
        },
      }
    )
      .then((d) => {
        // if (d.modifiedCount == 0) {
        //   res.json({ ok: false, reason: "Cottage doesn't exist." });
        //   return;
        // }
        res.json({ ok: true, reason: "" });
      })
      .catch((e) => {
        res.json({ ok: false, reason: "Internal error." });
        console.log(e);
      });
  };
  deleteCottage = (req: express.Request, res: express.Response) => {
    let _id = req.params["_id"];
    // delete slike isto todo
    VikM.deleteOne({ _id })
      .then((d) => {
        res.json({ ok: true, reason: "" });
      })
      .catch((err) => {
        console.log(err);
        res.json({ ok: false, reason: "Internal error." });
      });
  };

  // updateBook = (req: express.Request, res: express.Response) => {
  //   BookM.updateOne({ name: req.body.name }, { pages: req.body.pages })
  //     .then((books) => {
  //       res.json({ message: "Book updated" });
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       res.json({ message: "Fail" });
  //     });
  // };
}
