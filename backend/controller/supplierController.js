const Supplier = require('../model/Supplier');

const createSupplier = async (req, res) => {
  try {
    const { supplier_name, supplier_phone, address, email, store_id } = req.body;

    const existingSupplier = await Supplier.findOne({ email });
    if (existingSupplier) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    const supplier = new Supplier({
      supplier_name,
      supplier_phone,
      address,
      email,
      store_id
    });

    await supplier.save();

    res.status(201).json({
      success: true,
      message: 'Supplier created successfully',
      data: supplier
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find()
      .populate('store_id', 'store_name')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: suppliers.length,
      data: suppliers
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const getSupplierById = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id)
      .populate('store_id', 'store_name');

    if (!supplier) {
      return res.status(404).json({ success: false, message: 'Supplier not found' });
    }

    res.status(200).json({ success: true, data: supplier });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const updateSupplier = async (req, res) => {
  try {
    const { supplier_name, supplier_phone, address, email, store_id } = req.body;

    let supplier = await Supplier.findById(req.params.id);
    if (!supplier) return res.status(404).json({ success: false, message: 'Supplier not found' });

    supplier.supplier_name = supplier_name || supplier.supplier_name;
    supplier.supplier_phone = supplier_phone || supplier.supplier_phone;
    supplier.address = address || supplier.address;
    supplier.email = email || supplier.email;
    supplier.store_id = store_id || supplier.store_id;

    await supplier.save();

    res.status(200).json({
      success: true,
      message: 'Supplier updated successfully',
      data: supplier
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) return res.status(404).json({ success: false, message: 'Supplier not found' });

    await Supplier.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: 'Supplier deleted successfully' });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {deleteSupplier,updateSupplier,getSupplierById,getAllSuppliers, createSupplier}