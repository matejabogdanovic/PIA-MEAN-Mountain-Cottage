import mongoose from "mongoose";

const VikendicaSchema = new mongoose.Schema({
  naziv: {
    type: String,
    required: true,
  },
  mesto: {
    type: String,
    required: true,
  },
  koordinate: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  usluge: {
    type: String,
  },
  cenovnik: [{ type: Number }],
  telefon: {
    type: String,
    required: true,
  },
  slike: [
    { type: String }, // URL ili putanja do slike
  ],
  vlasnik: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "korisnici", // ime kolekcije korisnika
    required: true,
  },
});
export default mongoose.model("Vikendica", VikendicaSchema, "vikendice");
