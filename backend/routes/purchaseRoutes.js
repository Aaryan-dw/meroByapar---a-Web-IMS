const express = require("express");

const router = express.Router();

const {
  deletePurchase,
  getAllPurchases,
  getPurchaseById,
  createPurchase
} = require("../controller/purchaseController");


router.post('/purchase', createPurchase);
router.get('/purchase', getAllPurchases);
router.get('/purchase/:id', getPurchaseById);
router.delete('/purchase/:id', deletePurchase);


module.exports = router;
