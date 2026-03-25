const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    product_name:{
        type:String,
        required:true,
        trim:true,
    },
    category_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Category',
        required:true,
    },

    cost_price: {
    type: Number,
    required: true,
    min: 0
  },
  sell_price: {
    type: Number,
    required: true,
    min: 0
  },
   stock_quantity: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
   store_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: true
  },



},{
    timestamps:true,
})

module.exports = mongoose.model('Product', productSchema);