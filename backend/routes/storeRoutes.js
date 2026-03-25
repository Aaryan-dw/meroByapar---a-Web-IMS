const express = require("express");
const router = express.Router();

const {
  updateStore,
  deleteStore,
  getAllStores,
  getStoreById,
  createStore,
} = require("../controller/storeController");

// Create a store
router.post("/store", createStore);

// Get all stores
router.get("/store", getAllStores);

// Get store by ID
router.get("/store/:id", getStoreById);

// Update store
router.put("/store/:id", updateStore);

// Delete store
router.delete("/store/:id", deleteStore);

module.exports = router;