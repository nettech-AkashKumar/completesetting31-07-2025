// controllers/hsnController.js
const xlsx = require('xlsx');
const HSN = require('../models/hsnModels');

exports.getPaginatedHSN = async (req, res) => {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 10, 1);
    try {
        const [items, total] = await Promise.all([
            HSN.find().skip((page - 1) * limit).limit(limit).sort({ hsnCode: 1 }),
            HSN.countDocuments()
        ]);
        res.json({ items, page, limit, total, pages: Math.ceil(total / limit) });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createHSN = async (req, res) => {
    const { hsnCode, description } = req.body;
    try {
        const hsn = new HSN({ hsnCode, description });
        await hsn.save();
        res.status(201).json(hsn);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateHSN = async (req, res) => {
    const { hsnCode, description } = req.body;
    try {
        const updated = await HSN.findByIdAndUpdate(
            req.params.id,
            { hsnCode, description },
            { new: true }
        );
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteHSN = async (req, res) => {
    try {
        await HSN.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.importHSN = async (req, res) => {
    try {
        const wb = xlsx.read(req.file.buffer, { type: 'buffer' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const data = xlsx.utils.sheet_to_json(ws);
        for (const item of data) {
            if (item.HSNCode && item.Description) {
                await HSN.updateOne(
                    { hsnCode: item.HSNCode },
                    { hsnCode: item.HSNCode, description: item.Description },
                    { upsert: true }
                );
            }
        }
        res.json({ message: 'Imported' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.exportHSN = async (req, res) => {
    try {
        const data = await HSN.find();
        const exportData = data.map(item => ({
            HSNCode: item.hsnCode,
            Description: item.description
        }));
        const ws = xlsx.utils.json_to_sheet(exportData);
        const wb = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(wb, ws, 'HSN');
        const buffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });
        res.setHeader('Content-Disposition', 'attachment; filename=hsn.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(buffer);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

