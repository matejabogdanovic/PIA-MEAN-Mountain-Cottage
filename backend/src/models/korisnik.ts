import mongoose from "mongoose";

const korisnikSchema = new mongoose.Schema(
  {
    korisnicko_ime: {
      type: String,
      required: true,
      unique: true,
    },
    lozinka: {
      type: String,
      required: true,
    },
    ime: {
      type: String,
      required: true,
    },
    prezime: {
      type: String,
      required: true,
    },
    pol: {
      type: String,
      enum: ["m", "z"], // m = muski, z = zenski
      required: true,
    },
    adresa: {
      type: String,
      required: true,
    },
    kontakt_telefon: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    profilna_slika: {
      type: String, // binarni podaci slike
      required: false,
    },
    kreditna_kartica: {
      type: String, // cuvamo kao string zbog velikih brojeva
      required: true,
    },
    aktivan: {
      type: Boolean,
      required: true,
    },
    tip: {
      type: String,
      enum: ["admin", "vlasnik", "turista"],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("KorisnikModel", korisnikSchema, "korisnici");
