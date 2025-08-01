const Warranty = require("../models/variantModel");

const createVariant = async (req, res) => {
    try {
        const newWarranty = new Warranty(req.body);
        await newWarranty.save();
        res.status(201).json(newWarranty);
    } catch (err) {
        res.status(400).json({ Error: err.message });
    }
};

const getVariant = async (req, res) => {
    try {
        const warrantys = await Warranty.find();
        res.status(200).json(warrantys);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
};

const updateVariant = async (req, res) => {
    try {
        const userId = req.params.id;
        const updatedWarranty = await Warranty.findByIdAndUpdate(userId, req.body, { new: true });
        res.status(200).json({ message: "updated : " }, updatedWarranty);
    } catch (err) {
        res.status(400).json({ Error: err.message });
    }
};

const deleteVariant = async (req, res) => {
    try {
        const deletewar = await Warranty.findByIdAndDelete(req.params.id);
        res.status(204).json({ message: "Warranty Deleted" }, deletewar);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = { createVariant, getVariant, updateVariant, deleteVariant };