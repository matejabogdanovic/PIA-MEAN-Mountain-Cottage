import mongoose from "mongoose";

const rezervacijaSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId(),
    },
    od: {
      type: Date,
      required: true,
    },
    do: {
      type: Date,
      required: true,
    },
    cottage_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VikendicaModel", // ime kolekcije/modela vikendice
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "KorisnikModel",
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    napomena: {
      type: String,
    },

    prihvacena: {
      type: Boolean,
      required: true,
    },
    odbijenica: {
      type: String,
    },

    komentar_i_ocena: {
      komentar: {
        type: String,
      },
      ocena: {
        type: Number,
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model(
  "RezervacijaModel",
  rezervacijaSchema,
  "rezervacije"
);
