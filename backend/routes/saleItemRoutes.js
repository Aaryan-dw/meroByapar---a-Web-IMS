const express = require("express");
const router = express.Router();

const {
  bulkCreateSaleItems,
  deleteSaleItem,
  updateSaleItem,
  getItemsBySaleId,
  createSaleItem,
} = require("../controller/saleItemsController");

// Create single sale item
router.post("/sale-item", createSaleItem);

// Create multiple sale items
router.post("/sale-item/bulk", bulkCreateSaleItems);

// Get items by sale id
router.get("/sale-item/:saleId", getItemsBySaleId);

// Update sale item
router.put("/sale-item/:id", updateSaleItem);

// Delete sale item
router.delete("/sale-item/:id", deleteSaleItem);

module.exports = router;