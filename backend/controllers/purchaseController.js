const Product = require("../models/productModels");
const Purchase = require("../models/purchaseModels");
const StockHistory = require("../models/stockHistoryModels");
const cloudinary = require("../utils/cloudinary/cloudinary");
const Supplier = require('../models/usersModels');

function parseDDMMYYYY(dateStr) {
    const [day, month, year] = dateStr.split('/');
    return new Date(`${year}-${month}-${day}`);
}



exports.createPurchase = async (req, res) => {
    try {
        const {
            supplier,
            purchaseDate,
            referenceNumber,
            products,
            orderTax,
            orderDiscount,
            shippingCost,
            grandTotal,
            status,
            description,

            // Payment fields
            paymentType,
            paymentStatus,
            paidAmount,
            dueAmount,
            dueDate,
            paymentMethod,
            transactionId,
            transactionDate,
            onlineMethod
        } = req.body;

        // ✅ Validate required fields
        if (
            !supplier ||
            !purchaseDate ||
            !referenceNumber ||
            !products ||
            products.length === 0 ||
            !status ||
            !paymentType
        ) {
            return res.status(400).json({ message: 'Please fill all required fields.' });
        }

        const parsedDate = parseDDMMYYYY(purchaseDate);
        if (isNaN(parsedDate.getTime())) {
            return res.status(400).json({ message: 'Invalid purchase date format. Use dd/mm/yyyy' });
        }

        const finalProducts = [];

        for (const item of products) {
            const {
                productId,
                quantity,
                unit = '',
                purchasePrice,
                discount = 0,
                tax = 0,
                taxAmount = 0,
                unitCost = 0,
                totalCost = 0,
            } = item;

            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).json({ message: `Product not found: ${productId}` });
            }

            // Update product quantity and push history
            await Product.findByIdAndUpdate(productId, {
                $inc: { quantity },
                $push: {
                    newPurchasePrice: purchasePrice,
                    newQuantity: quantity,
                },
            });

            // Stock history
            await StockHistory.create({
                product: productId,
                date: parsedDate,
                quantityChanged: quantity,
                priceChanged: purchasePrice,
                type: 'purchase',
                notes: `Purchase ref: ${referenceNumber}`,
            });

            finalProducts.push({
                product: productId,
                quantity,
                unit,
                purchasePrice,
                discount,
                tax,
                taxAmount,
                unitCost,
                totalCost,
            });
        }

        // ✅ Upload images if provided
        let imageUrls = [];
        if (req.files && req.files.length > 0) {
            const uploadedImages = await Promise.all(
                req.files.map(file =>
                    cloudinary.uploader.upload(file.path, { folder: 'purchase_images' })
                )
            );

            imageUrls = uploadedImages.map(img => ({
                url: img.secure_url,
                public_id: img.public_id,
            }));
        }

        // ✅ Build purchase object
        const purchase = new Purchase({
            supplier,
            purchaseDate: parsedDate,
            referenceNumber,
            products: finalProducts,
            orderTax,
            orderDiscount,
            shippingCost,
            grandTotal,
            status,
            description,
            image: imageUrls,
            payment: {
                paymentType,
                paymentStatus,
                paidAmount,
                dueAmount,
                dueDate: dueDate ? new Date(dueDate) : null,
                paymentMethod,
                transactionId,
                transactionDate: transactionDate ? new Date(transactionDate) : null,
                onlineMethod,
            },
        });

        await purchase.save();

        res.status(201).json({ success: true, purchase });
    } catch (error) {
        console.error('Purchase creation failed:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.getNextReferenceNumber = async (req, res) => {
    try {
        // Find the latest purchase entry
        const lastPurchase = await Purchase.findOne().sort({ createdAt: -1 });

        let nextNumber = 1;

        if (lastPurchase && lastPurchase.referenceNumber) {
            const match = lastPurchase.referenceNumber.match(/PUR-(\d+)/);
            if (match) {
                nextNumber = parseInt(match[1], 10) + 1;
            }
        }

        const newRef = `PUR-${String(nextNumber).padStart(3, "0")}`;
        res.status(200).json({ referenceNumber: newRef });
    } catch (error) {
        console.error("Error generating reference number:", error);
        res.status(500).json({ error: "Failed to generate reference number" });
    }
};


exports.getAllPurchases = async (req, res) => {
    try {
        const {
            search = "",
            status,
            supplier,
            productName,
            startDate,
            endDate,
            page = 1,
            limit = 10,
        } = req.query;

        const query = { $and: [] };

        // Unified search: referenceNumber, supplier name, or product name
        if (search) {
            const matchingProductIds = await Product.find({
                productName: { $regex: search, $options: "i" }
            }).select("_id");

            const matchingSupplierIds = await Supplier.find({
                $or: [
                    { firstName: { $regex: search, $options: "i" } },
                    { lastName: { $regex: search, $options: "i" } },
                ]
            }).select("_id");

            query.$and.push({
                $or: [
                    { referenceNumber: { $regex: search, $options: "i" } },
                    { supplier: { $in: matchingSupplierIds.map(s => s._id) } },
                    { "products.product": { $in: matchingProductIds.map(p => p._id) } }
                ]
            });
        }

        if (status) query.$and.push({ status });
        if (supplier) query.$and.push({ supplier });

        if (startDate || endDate) {
            const dateQuery = {};
            if (startDate) dateQuery.$gte = new Date(startDate);
            if (endDate) dateQuery.$lte = new Date(endDate);
            query.$and.push({ purchaseDate: dateQuery });
        }

        if (productName) {
            const products = await Product.find({
                productName: { $regex: productName, $options: 'i' },
            }).select('_id');
            query.$and.push({
                "products.product": { $in: products.map(p => p._id) },
            });
        }

        if (query.$and.length === 0) delete query.$and;

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);

        const total = await Purchase.countDocuments(query);

        const purchases = await Purchase.find(query)
            .populate("supplier", "firstName lastName email phone")
            .populate("products.product")
            .sort({ createdAt: -1 })
            .skip((pageNum - 1) * limitNum)
            .limit(limitNum);

        res.status(200).json({
            success: true,
            totalRecords: total,
            currentPage: pageNum,
            totalPages: Math.ceil(total / limitNum),
            purchases,
        });
    } catch (error) {
        console.error("Error fetching purchases:", error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};



exports.updatePurchase = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            supplier,
            purchaseDate,
            products,
            referenceNumber,
            orderTax,
            orderDiscount,
            shippingCost,
            grandTotal,
            status,
            description,
            payment
        } = req.body;

        const parsedPayment = {
            paymentType: payment?.paymentType || "",
            paymentStatus: payment?.paymentStatus || "",
            paidAmount: Number(payment?.paidAmount) || 0,
            dueAmount: Number(payment?.dueAmount) || 0,
            dueDate: payment?.dueDate || null,
            paymentMethod: payment?.paymentMethod || "",
            transactionId: payment?.transactionId || "",
            transactionDate: payment?.transactionDate || null,
            onlineMethod: payment?.onlineMethod || "",
        };



        const parsedDate = parseDDMMYYYY(purchaseDate);
        if (isNaN(parsedDate.getTime())) {
            return res.status(400).json({ message: 'Invalid purchase date format. Use dd/mm/yyyy' });
        }

        const finalProducts = [];

        for (const item of products) {
            const {
                productId,
                quantity,
                unit = '',
                purchasePrice,
                discount = 0,
                tax = 0,
                taxAmount = 0,
                unitCost = 0,
                totalCost = 0,
            } = item;

            // Ensure product exists
            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).json({ message: `Product not found: ${productId}` });
            }

            finalProducts.push({
                product: productId,
                quantity,
                unit,
                purchasePrice,
                discount,
                tax,
                taxAmount,
                unitCost,
                totalCost,


            });

            // Optionally log update to stock history
            await StockHistory.create({
                product: productId,
                date: parsedDate,
                quantityChanged: quantity,
                priceChanged: purchasePrice,
                type: 'purchase-update',
                notes: `Updated purchase ref: ${referenceNumber}`,
            });
        }

        // ✅ Handle image upload if new images provided
        let imageUrls = [];
        if (req.files && req.files.length > 0) {
            const uploadedImages = await Promise.all(
                req.files.map(file =>
                    cloudinary.uploader.upload(file.path, { folder: 'purchase_images' })
                )
            );

            imageUrls = uploadedImages.map(img => ({
                url: img.secure_url,
                public_id: img.public_id,
            }));
        }

        // ✅ Build updated purchase payload
        const updatedPayload = {
            supplier,
            purchaseDate: parsedDate,
            referenceNumber,
            products: finalProducts,
            orderTax,
            orderDiscount,
            shippingCost,
            grandTotal,
            status,
            description,
            ...(imageUrls.length > 0 && { image: imageUrls }), // only update if new images are added
            payment: parsedPayment,
            // payment: {
            //     paymentType,
            //     paymentStatus,
            //     paidAmount,
            //     dueAmount,
            //     dueDate: dueDate ? new Date(dueDate) : null,
            //     paymentMethod,
            //     transactionId,
            //     transactionDate: transactionDate ? new Date(transactionDate) : null,
            //     onlineMethod,
            // }
        };

        const updatedPurchase = await Purchase.findByIdAndUpdate(id, updatedPayload, { new: true });

        if (!updatedPurchase) {
            return res.status(404).json({ message: 'Purchase not found' });
        }

        // if (!updatedPurchase) {
        //     return res.status(404).json({ message: "Purchase not found" });
        // }

        res.status(200).json({ message: "Purchase updated successfully", data: updatedPurchase });
    } catch (error) {
        console.error("Update Purchase Error:", error);
        res.status(500).json({ message: "Failed to update purchase", error: error.message });
    }
};


exports.deletePurchase = async (req, res) => {
    try {
        const { id } = req.params;

        const purchase = await Purchase.findById(id);
        if (!purchase) {
            return res.status(404).json({ message: 'Purchase not found' });
        }

        // 1. Revert product stock quantities
        for (const item of purchase.products) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { quantity: -item.quantity } // Revert stock
            });
        }

        // 2. Delete stock history related to this purchase
        await StockHistory.deleteMany({
            product: { $in: purchase.products.map(p => p.product) },
            notes: new RegExp(purchase.referenceNumber) // Matches purchase reference in stock history
        });

        // 3. Delete associated images from Cloudinary
        if (purchase.image && purchase.image.length > 0) {
            for (const img of purchase.image) {
                if (img.public_id) {
                    await cloudinary.uploader.destroy(img.public_id);
                }
            }
        }

        // 4. Finally, delete the purchase itself
        await Purchase.findByIdAndDelete(id);

        res.status(200).json({ success: true, message: 'Purchase deleted successfully' });
    } catch (error) {
        console.error("Delete Purchase Error:", error);
        res.status(500).json({ success: false, message: "Failed to delete purchase", error: error.message });
    }
};



exports.getNextReferenceNumber = async (req, res) => {
    try {
        const lastPurchase = await Purchase.findOne().sort({ createdAt: -1 });
        let nextNumber = 1;

        if (lastPurchase?.referenceNumber) {
            const match = lastPurchase.referenceNumber.match(/PUR-(\d+)/);
            if (match) nextNumber = parseInt(match[1], 10) + 1;
        }

        const newRef = `PUR-${String(nextNumber).padStart(3, "0")}`;
        res.status(200).json({ referenceNumber: newRef });
    } catch (error) {
        console.error("Error generating reference number:", error);
        res.status(500).json({ error: "Failed to generate reference number" });
    }
};




// purchase return
exports.createProductReturn = async (req, res) => {
    try {
        const {
            referenceNumber,
            originalPurchase,
            supplier,
            reason,
            returnedProducts,
            refundMethod,
            refundStatus,
            notes,
        } = req.body;

        if (!originalPurchase || !returnedProducts || returnedProducts.length === 0) {
            return res.status(400).json({ message: 'Missing required return fields' });
        }

        const purchase = await Purchase.findById(originalPurchase);
        if (!purchase) {
            return res.status(404).json({ message: 'Original purchase not found' });
        }

        for (const item of returnedProducts) {
            const { product, quantity, purchasePrice } = item;

            await Product.findByIdAndUpdate(product, {
                $inc: { quantity: -quantity }
            });

            await StockHistory.create({
                product,
                date: new Date(),
                quantityChanged: -quantity,
                priceChanged: purchasePrice,
                type: 'return',
                notes: `Return for purchase ref: ${purchase.referenceNumber}`,
            });
        }

        const newReturn = new ProductReturn({
            referenceNumber,
            originalPurchase,
            supplier,
            reason,
            returnedProducts,
            refundMethod,
            refundStatus,
            notes,
        });

        await newReturn.save();

        res.status(201).json({ success: true, data: newReturn });
    } catch (error) {
        console.error("Product Return Error:", error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

exports.getAllReturns = async (req, res) => {
    try {
        const returns = await ProductReturn.find()
            .populate('originalPurchase', 'referenceNumber')
            .populate('supplier', 'firstName lastName')
            .populate('returnedProducts.product', 'productName');

        res.status(200).json({ success: true, returns });
    } catch (error) {
        console.error("Fetch Returns Error:", error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};






