const Store = require("../model/Store");

const createStore = async (req, res) => {
  try {
    const { store_name, store_owner, phone, address } = req.body;

    const store = new Store({
      store_name,
      store_owner,
      phone,
      address,
    });

    await store.save();

    res.status(201).json({
      success: true,
      message: "Store created successfully",
      data: store,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

const getAllStores = async (req, res) => {
  try {
    const stores = await Store.find();

    res.status(200).json({
      success: true,
      count: stores.length,
      data: stores,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

const getStoreById = async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);

    if (!store) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
      });
    }

    res.status(200).json({
      success: true,
      data: store,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

const updateStore = async (req, res) => {
  try {
    const { store_name, address, phone, store_owner } = req.body;

    let store = await Store.findById(req.params.id);

    if (!store) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
      });
    }

    store = await Store.findByIdAndUpdate(
      req.params.id,
      { store_name, address, phone, store_owner },
      {
        new: true,
        runValidators: true, // fixed typo from runValidatores
      }
    );

    res.status(200).json({
      success: true,
      message: "Store updated successfully",
      data: store,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

const deleteStore = async (req, res) => {
  try {
    const store = await Store.findByIdAndDelete(req.params.id);

    if (!store) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
      });
    }

    // fixed: removed User.deleteOne() which was crashing (User not imported)
    // fixed: added proper success response so request doesn't hang
    res.status(200).json({
      success: true,
      message: "Store deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

module.exports = { createStore, getAllStores, getStoreById, updateStore, deleteStore };
