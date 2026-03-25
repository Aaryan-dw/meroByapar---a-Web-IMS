const moongoose = require("mongoose");

const saleSchema = new moongoose.Schema({
  invoice_number: {
    type: String,
    required: true,
    unique: true,
  },
  cashier_id: {
    type: moongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  store_id: {
    type: moongoose.Schema.Types.ObjectId,
    ref: "Store",
    required: true,
  },
  sum_total: {
    type: Number,
    default: 0,
    min: 0,
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
  },
  payment_method: {
    type: String,
    enum: ["cash", "credit", "esewa"],
    required: true,
  },
},{
    timestamps:true,
});

saleSchema.pre('save', async function(next) {
  if (!this.invoice_number) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.invoice_number = `INV-${year}${month}${day}-${random}`;
  }
  next();
});



module.exports = moongoose.model('Sale',saleSchema);
