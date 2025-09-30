import express from "express";
import VikM from "../models/vikendica";
import KorM from "../models/korisnik";
import path from "path";
import fs from "fs";
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

  addCottage = async (req: any, res: express.Response) => {
    let korisnicko_ime = req.params["korisnicko_ime"];
    let vikendica = JSON.parse(req.body.vikendica);
    try {
      const vlasnik = await KorM.findOne({ korisnicko_ime });
      if (!vlasnik) {
        res.json({ ok: false, reason: "User doesn't exist." });
        return;
      }
      vikendica.vlasnik = vlasnik._id;
      // ukloni _id ako postoji, Mongoose ce generistai sam
      if ("_id" in vikendica) delete vikendica._id;

      const imena = req.files.map((f: any) => f.filename);
      console.log(imena);
      if (imena.length > 0) {
        vikendica.slike = imena;
      }
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

  editCottage = (req: any, res: express.Response) => {
    let vikendica = JSON.parse(req.body.vikendica);
    // delete slike isto todo
    if (!vikendica || !req.files) {
      res.json({ ok: false, reason: "Invalid query." });
      console.log("editCottage: korisnik null");
      return;
    }
    let imena = req.files.map((f: any) => f.filename);

    VikM.findById(vikendica._id)
      .then((d) => {
        if (!d) {
          res.json({ ok: false, reason: "Cottage doesn't exist." });
          return;
        }
        let set: any = {
          naziv: vikendica.naziv,
          mesto: vikendica.mesto,
          koordinate: vikendica.koordinate,
          usluge: vikendica.usluge,
          cenovnik: vikendica.cenovnik,
          telefon: vikendica.telefon,
        };

        if (imena.length > 0) {
          set.slike = imena;
          d.slike.forEach((fileName: string) => {
            const filePath = path.join(__dirname, "../../uploads", fileName);
            fs.unlink(filePath, (err) => {
              if (err) {
                console.error("Greska pri brisanju fajla:", filePath, err);
              } else {
                console.log("Obrisan fajl:", filePath);
              }
            });
          });
        }

        VikM.updateOne({ _id: vikendica._id }, { $set: set })
          .then((d) => {
            res.json({ ok: true, reason: "" });
          })
          .catch((err) => {
            res.json({ ok: false, reason: "Internal error." });
            console.log(err);
          });
      })
      .catch((e) => {
        res.json({ ok: false, reason: "Internal error." });
        console.log(e);
      });
  };
  deleteCottage = (req: express.Request, res: express.Response) => {
    let _id = req.params["_id"];
    VikM.findById(_id).then((d) => {
      if (!d) {
        res.json({ ok: false, reason: "Cottage doesn't exist." });
        return;
      }
      d.slike.forEach((fileName: string) => {
        const filePath = path.join(__dirname, "../../uploads", fileName);
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error("Greska pri brisanju fajla:", filePath, err);
          } else {
            console.log("Obrisan fajl:", filePath);
          }
        });
      });
    });

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
