const mongoose = require('mongoose');

const purchaseItemSchema = new mongoose.Schema({
  purchase_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Purchase',
    required: true
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  unit_cost: {
    type: Number,
    required: true,
    min: 0
  },
  discount: {
    type: Number,
    default: 0,
    min: 0
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0
  }
});

// Calculate subtotal before saving
purchaseItemSchema.pre('save', function(next) {
  this.subtotal = (this.unit_cost * this.quantity) - this.discount;
  next();
});

module.exports = mongoose.model('PurchaseItem', purchaseItemSchema);