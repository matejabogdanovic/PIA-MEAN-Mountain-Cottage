import express from "express";
import KorM from "../models/korisnik";

import sharp from "sharp";

import path from "path";
export class UserController {
  validateCreditCard(cc: string): number {
    const diners = /^(3(0[0-3][0-9]{12}|6[0-9]{13}|8[0-9]{13}))$/;
    const master = /^(5[1-5][0-9]{14})$/;
    const viza = /^(4539|4556|4916|4532|4929|4485|4716)[0-9]{12}$/;
    if (diners.test(cc)) {
      return 0;
    }
    if (master.test(cc)) {
      return 1;
    }
    if (viza.test(cc)) {
      return 2;
    }

    return -1;
  }

  validatePassword(pw: string): { ok: boolean; reason: string } {
    if (!pw) return { ok: false, reason: "Password can't be empty." };

    const reLength = /^.{6,10}$/;
    const reStartsWithLetter = /^[A-Za-z]/;
    const reUpper = /[A-Z]/;
    const reThreeLower = /(?:.*[a-z]){3,}/;
    const reDigit = /\d/;
    const reSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/;

    if (!reStartsWithLetter.test(pw)) {
      return {
        ok: false,
        reason: "Password must start with a letter.",
      };
    }
    if (!reThreeLower.test(pw) || !reUpper.test(pw)) {
      return {
        ok: false,
        reason:
          "Password must have at least 3 lowercase letters and 1 uppercase letter.",
      };
    }
    if (!reDigit.test(pw)) {
      return {
        ok: false,
        reason: "Password must have at least 1 digit.",
      };
    }
    if (!reSpecial.test(pw)) {
      return {
        ok: false,
        reason: "Password must have at least 1 special character.",
      };
    }
    if (!reLength.test(pw)) {
      return {
        ok: false,
        reason: "Password length must be 6-10.",
      };
    }
    // const re =
    //   /^(?=.{6,10}$)(?=.*[A-Z])(?=(.*[a-z]){3,})(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~])[A-Za-z][A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]{5,9}$/;

    return { ok: true, reason: "" };
  }
  login = (req: express.Request, res: express.Response) => {
    let korisnicko_ime = req.body.korisnicko_ime;
    let lozinka = req.body.lozinka;

    KorM.findOne({ korisnicko_ime, lozinka })
      .then((user) => {
        if (user?.tip == "admin") user = null;
        res.json(user);
      })
      .catch((err) => {
        console.log(err);
        res.json(null);
      });
  };

  loginAdmin = (req: express.Request, res: express.Response) => {
    let korisnicko_ime = req.body.korisnicko_ime;
    let lozinka = req.body.lozinka;

    KorM.findOne({
      korisnicko_ime,
      lozinka,
      tip: "admin",
    })
      .then((user) => {
        if (user?.tip != "admin") user = null;
        res.json(user);
      })
      .catch((err) => {
        console.log(err);
        res.json(null);
      });
  };

  changeActiveStatus = (req: express.Request, res: express.Response) => {
    let korisnicko_ime = req.body.korisnicko_ime;
    let aktivan = req.body.aktivan;

    KorM.updateOne({ korisnicko_ime }, { $set: { aktivan } })
      .then((d) => {
        console.log(d);
        res.json(null);
      })
      .catch((e) => {
        console.log(e);
        res.json(null);
      });
  };

  register = async (req: any, res: express.Response) => {
    let korisnik = JSON.parse(req.body.user);
    if (!korisnik) {
      res.json(null);
      return;
    }
    korisnik.aktivan = false;
    if (this.validatePassword(korisnik.lozinka).ok == false) {
      res.json(null);
      return;
    }
    if (this.validateCreditCard(korisnik.kreditna_kartica) < 0) {
      res.json(null);
      return;
    }
    const requiredFields = [
      "korisnicko_ime",
      "ime",
      "prezime",
      "pol",
      "adresa",
      "email",
      "kreditna_kartica",
      "tip",
    ];

    for (const field of requiredFields) {
      if (!korisnik[field] || korisnik[field].trim() === "") {
        res.json(null);
        return;
      }
    }
    if (korisnik.profilna_slika == "") {
      korisnik.profilna_slika = "profile_photo.png";
    }

    if (!req.file) {
      new KorM(korisnik)
        .save()
        .then((user) => {
          const ret = user.toObject();
          ret.lozinka = "";

          res.json(ret);
        })
        .catch((err) => {
          console.log(err);
          res.json(null);
        });
      return;
    }

    try {
      const metadata = await sharp(req.file.buffer).metadata();

      // Provera dimenzija
      if (
        metadata.width < 100 ||
        metadata.width > 300 ||
        metadata.height < 100 ||
        metadata.height > 300
      ) {
        res.json(null);
        return;
      }

      // Pripremi novo ime fajla
      const ext = path.extname(req.file.originalname);
      const filename = `${korisnik.korisnicko_ime}${ext}`;
      const filePath = path.join(__dirname, "../../uploads", filename);

      // Upisi ime fajla u bazu
      korisnik.profilna_slika = filename;

      new KorM(korisnik)
        .save()
        .then((user) => {
          sharp(req.file.buffer)
            .toFile(filePath)
            .then((d) => {
              const ret = user.toObject();
              ret.lozinka = "";

              res.json(ret); // success
            })
            .catch((err) => {
              console.log(err);
              res.json(null);
            });
        })
        .catch((err) => {
          console.log(err);
          res.json(null);
        });
    } catch (err) {
      console.error(err);
      res.json(null);
    }
  };

  changeProfilePhoto = async (req: any, res: express.Response) => {
    const korisnicko_ime = req.body.korisnicko_ime;

    const user = await KorM.findOne({ korisnicko_ime });
    if (!user) {
      return res.json(null);
    }

    if (!req.file) {
      return res.json(null);
    }

    try {
      const metadata = await sharp(req.file.buffer).metadata();

      // Provera dimenzija
      if (
        metadata.width < 100 ||
        metadata.width > 300 ||
        metadata.height < 100 ||
        metadata.height > 300
      ) {
        return res
          .status(400)
          .send("Dimenzije slike moraju biti između 100x100 i 300x300 px");
      }

      // Pripremi novo ime fajla
      const ext = path.extname(req.file.originalname);
      const filename = `${korisnicko_ime}${ext}`;
      const filePath = path.join(__dirname, "../../uploads", filename);

      // Ako postoji stari fajl, obriši ga
      // if (user.profilna_slika) {
      //   const oldPath = path.join(
      //     __dirname,
      //     "../../uploads",
      //     user.profilna_slika
      //   );
      //   if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      // }

      // Sačuvaj fajl na disk
      await sharp(req.file.buffer).toFile(filePath);

      // Upisi ime fajla u bazu
      user.profilna_slika = filename;
      const nuser = await user.save();
      nuser.lozinka = "";

      res.json(nuser);
    } catch (err) {
      console.error(err);
      res.status(500).send("Greška pri obradi slike");
    }
  };
  //   register = (req: express.Request, res: express.Response) => {
  //     let username = req.body.username;
  //     let password = req.body.password;
  //     let firstname = req.body.firstname;
  //     let lastname = req.body.lastname;

  //     let user = {
  //       username: username,
  //       password: password,
  //       firstname: firstname,
  //       lastname: lastname,
  //     };

  //     new UserM(user)
  //       .save()
  //       .then((ok) => {
  //         res.json({ message: "ok" });
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //         res.json({ message: "fail register" });
  //       });
  //   };

  // addToFavourites= (req: express.Request, res: express.Response)=>{
  //     let dateNow = new Date();
  //     let dateStr = dateNow.getFullYear() + "-" + (dateNow.getMonth()+1) + "-" + dateNow.getDate();
  //     let fav = {
  //         name: req.body.name,
  //         author: req.body.author,
  //         date: dateStr
  //     }
  //     UserM.updateOne({username: req.body.user}, {$push: {favourites: fav}}).then(data=>{
  //             res.json({message: "Ok"})
  //         }).catch(err=>{
  //             res.json({message: "Fail"})
  //         })
  // }

  // deleteFromFavourites = (req: express.Request, res: express.Response)=>{
  //     let name = req.body.book
  //     let user = req.body.user
  //     UserM.updateOne({username: user},
  //         {$pull: {favourites: {name: name}}}).then(data=>{
  //             res.json({message: "Ok"})
  //         }).catch(err=>{
  //             res.json({message: "Fail"})
  //         })
  // }

  // updateFavourite = (req: express.Request, res: express.Response)=>{
  //     let name = req.body.book
  //     let user = req.body.user

  //     UserM.updateOne({username: user}, {$set: {"favourites.$[fav].name": "New fav changed"}}, {arrayFilters: [{
  //         "fav.name": name
  //     }]}).then(data=>{
  //         res.json({message: "Ok"})
  //     }).catch(err=>{
  //         res.json({message: "Fail"})
  //     })
  // }

  // getUser = (req: express.Request, res: express.Response)=>{
  //     let user = req.params.user
  //     // UserM.findOne({_id: "6588537a44a71c2c6f674495"}).then(user=>{
  //     //         res.json(user).status(200)
  //     // }).catch(err=>{
  //     //         res.json({message: "Fail"}).status(400)
  //     // })

  //     UserM.findOne({username: user}).then(user=>{
  //             res.json(user).status(200)
  //     }).catch(err=>{
  //             res.json({message: "Fail"}).status(400)
  //     })
  // }
}
