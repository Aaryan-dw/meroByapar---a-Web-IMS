const express = require("express");
const router = express.Router();

const {
  bulkCreatePurchaseItems,
  deletePurchaseItem,
  updatePurchaseItem,
  getItemsByPurchaseId,
  createPurchaseItem,
} = require("../controller/purchaseItemController");

// Create single purchase item
router.post("/purchase-item", createPurchaseItem);

// Create multiple purchase items
router.post("/purchase-item/bulk", bulkCreatePurchaseItems);

// Get items by purchase id
router.get("/purchase-item/:purchaseId", getItemsByPurchaseId);

// Update purchase item
router.put("/purchase-item/:id", updatePurchaseItem);

// Delete purchase item
router.delete("/purchase-item/:id", deletePurchaseItem);

module.exports = router;