const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
    supplier_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Supplier',
        required:true,
    },
    manager_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },

    store_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Store',
        required:true,
    },
    subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  discount: {
    type: Number,
    default: 0,
    min: 0
  },
   purchase_order_number: {
    type: String,
    required: true,
    unique: true
  },




})

purchaseSchema.pre('save', async function(next) {
  if (!this.purchase_order_number) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.purchase_order_number = `PO-${year}${month}${day}-${random}`;
  }
  next();
});

module.exports = mongoose.model('Purchase',purchaseSchema);