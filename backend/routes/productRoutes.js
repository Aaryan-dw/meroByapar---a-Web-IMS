const express = require("express");
const router = express.Router();

const {
  getAllProduct,

  createProduct,
  deleteProduct,
  updateProduct,
  getProductByID,
} = require("../controller/productController");

router.post("/product", createProduct);
router.get("/product", getAllProduct);
router.get("/product/:id", getProductByID);
router.put("/product/:id", updateProduct);
router.delete("/product/:id", deleteProduct);

module.exports = router;
