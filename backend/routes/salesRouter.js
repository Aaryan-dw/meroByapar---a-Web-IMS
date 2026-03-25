const express = require("express");
const router = express.Router();

const {
  deleteSale,
  getSaleById,
  getAllSales,
  createSale,
} = require("../controller/salesController");

// Create sale
router.post("/sales", createSale);

// Get all sales
router.get("/sales", getAllSales);

// Get sale by ID
router.get("/sales/:id", getSaleById);

// Delete sale
router.delete("/sales/:id", deleteSale);

module.exports = router;