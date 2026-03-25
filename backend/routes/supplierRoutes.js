const express = require("express");
const router = express.Router();

const {
  deleteSupplier,
  updateSupplier,
  getSupplierById,
  getAllSuppliers,
  createSupplier
} = require("../controller/supplierController");

router.post('/supplier', createSupplier);
router.get('/suppliers', getAllSuppliers);
router.get('/supplier/:id', getSupplierById);
router.put('/supplier/:id', updateSupplier);
router.delete('/supplier/:id', deleteSupplier);

module.exports = router; 
