const moongoose = require("mongoose");

const supplierSchema = new moongoose.Schema(
  {
    supplier_name: {
      type: String,
      required: [true, "product ko name halnei parxa"],
      trim: true,
    },
    supplier_phone: {
      type: String,
      required: [true, "contact ta garnu paro holanta "],
      trim: true,
    },
    address: {
      type: String,
      required: [true, "address ta chaiyo nih"],
    },

    email: {
      type: String,
      unique: true,
    },

    store_id: {
      type: moongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = moongoose.model("Supplier", supplierSchema);
