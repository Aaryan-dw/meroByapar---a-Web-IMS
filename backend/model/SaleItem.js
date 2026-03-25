const mongoose = require("mongoose");

const saleItemsSchema = new mongoose.Schema({
  sale_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Sale",
    required: true,
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0,
  },
  discount: {
    type: Number,
    default: 0, // fixed: was default: true (boolean) which made discount = 1 always
    min: 0,
  },
});

// Calculate subtotal before saving
saleItemsSchema.pre("save", function (next) {
  this.subtotal = this.quantity * this.price - this.discount;
  next();
});

module.exports = mongoose.model("SaleItem", saleItemsSchema);
