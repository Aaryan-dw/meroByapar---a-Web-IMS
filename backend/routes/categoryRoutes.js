
const express = require("express");
const router = express.Router();

const {
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategory,
  getCategoryById,
} = require("../controller/categoryController");

router.post('/category', createCategory);
router.get('/category', getAllCategory);
router.get('/category/:id' , getCategoryById);
router.put('/category/:id', updateCategory);
router.delete('/category/:id', deleteCategory);

module.exports = router;
