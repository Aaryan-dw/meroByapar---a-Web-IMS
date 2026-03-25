const PurchaseItem = require('../model/PurchaseItem');
const Purchase = require('../model/Purchase');
const Product = require('../model/Product');


const createPurchaseItem = async (req, res) => {
  try {

    const { purchase_id, product_id, quantity, unit_cost, discount } = req.body;

    // Check purchase
    const purchase = await Purchase.findById(purchase_id);
    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: "Purchase not found"
      });
    }

    // Check product
    const product = await Product.findById(product_id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    const purchaseItem = new PurchaseItem({
      purchase_id,
      product_id,
      quantity,
      unit_cost,
      discount
    });

    await purchaseItem.save();

    // 🔹 Update stock
    product.stock_quantity += quantity;
    await product.save();

    await purchaseItem.populate("product_id", "product_name");

    res.status(201).json({
      success: true,
      message: "Purchase item created",
      data: purchaseItem
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      error: err.message
    });

  }
};



const getItemsByPurchaseId = async (req, res) => {
  try {

    const items = await PurchaseItem.find({
      purchase_id: req.params.purchaseId
    })
      .populate("product_id", "product_name sell_price");

    res.status(200).json({
      success: true,
      count: items.length,
      data: items
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      error: err.message
    });

  }
};



const updatePurchaseItem = async (req, res) => {
  try {

    const { quantity, unit_cost, discount } = req.body;

    const item = await PurchaseItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Purchase item not found"
      });
    }

    // update fields
    if (quantity) item.quantity = quantity;
    if (unit_cost) item.unit_cost = unit_cost;
    if (discount !== undefined) item.discount = discount;

    await item.save();

    await item.populate("product_id", "product_name");

    res.status(200).json({
      success: true,
      message: "Purchase item updated",
      data: item
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      error: err.message
    });

  }
};



const deletePurchaseItem = async (req, res) => {
  try {

    const item = await PurchaseItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Purchase item not found"
      });
    }

    // Reduce stock
    const product = await Product.findById(item.product_id);
    if (product) {
      product.stock_quantity -= item.quantity;
      await product.save();
    }

    await PurchaseItem.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Purchase item deleted"
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      error: err.message
    });

  }
};



const bulkCreatePurchaseItems = async (req, res) => {
  try {

    const { purchase_id, items } = req.body;

    const purchase = await Purchase.findById(purchase_id);

    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: "Purchase not found"
      });
    }

    const createdItems = [];

    for (const item of items) {

      const product = await Product.findById(item.product_id);

      if (!product) continue;

      const purchaseItem = new PurchaseItem({
        purchase_id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_cost: item.unit_cost,
        discount: item.discount
      });

      await purchaseItem.save();

      // update stock
      product.stock_quantity += item.quantity;
      await product.save();

      createdItems.push(purchaseItem);
    }

    res.status(201).json({
      success: true,
      message: "Bulk purchase items created",
      count: createdItems.length,
      data: createdItems
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      error: err.message
    });

  }
};

module.exports = {bulkCreatePurchaseItems,deletePurchaseItem,updatePurchaseItem, getItemsByPurchaseId, createPurchaseItem };