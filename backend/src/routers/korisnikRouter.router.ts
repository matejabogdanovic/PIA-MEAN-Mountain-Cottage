import express from "express";
import { UserController } from "../controllers/korisnik.controller";

const korisnikRouter = express.Router();
const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  fileFilter: (req: any, file: any, cb: any) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true);
    } else {
      cb(new Error("Dozvoljeni formati: JPG i PNG"));
    }
  },
});

korisnikRouter
  .route("/login")
  .post((req, res) => new UserController().login(req, res));
korisnikRouter
  .route("/loginAdmin")
  .post((req, res) => new UserController().loginAdmin(req, res));

korisnikRouter
  .route("/unregisteredStatistics")
  .get((req, res) => new UserController().unregisteredStatistics(req, res));

korisnikRouter
  .route("/changeProfilePhoto")
  .post(upload.single("file"), (req, res) =>
    new UserController().changeProfilePhoto(req, res).then(() => {})
  );
korisnikRouter
  .route("/deleteProfilePhoto")
  .post((req, res) => new UserController().deleteProfilePhoto(req, res));

korisnikRouter
  .route("/getOneUser/:korisnicko_ime")
  .get((req, res) => new UserController().getOneUser(req, res));

korisnikRouter
  .route("/changeUserData")
  .post((req, res) => new UserController().changeUserData(req, res, false));

korisnikRouter
  .route("/changeUserDataAdmin")
  .post((req, res) => new UserController().changeUserData(req, res, true));

korisnikRouter
  .route("/passwordChange/:korisnicko_ime")
  .post((req, res) => new UserController().passwordChange(req, res));

korisnikRouter
  .route("/register")
  .post(upload.single("file"), (req, res) =>
    new UserController().register(req, res).then(() => {})
  );

korisnikRouter
  .route("/changeActiveStatus")
  .post((req, res) => new UserController().changeActiveStatus(req, res));

korisnikRouter
  .route("/getAllUsers")
  .get((req, res) => new UserController().getAllUsers(req, res));

export default korisnikRouter;
