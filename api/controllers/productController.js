const prisma = require('../config/prisma');
const sanitize = require('../utils/sanitizer');

exports.getAllProducts = async (req, res) => {
    try {
        const products = await prisma.product.findMany();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching products' });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        let product;

        if (!isNaN(id)) {
            product = await prisma.product.findUnique({ where: { id: parseInt(id) } });
        } else {
            product = await prisma.product.findUnique({ where: { slug: id } });
        }

        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error: 'Error fetching product' });
    }
};

exports.createProduct = async (req, res) => {
    if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Not authorized' });
    try {
        const { name, description, price, category, sizeFormat, onSale, discountPercentage, formConfig, slug } = sanitize(req.body);

        const dataToCreate = {
            name,
            description,
            price: parseFloat(price),
            category,
            sizeFormat,
            onSale: onSale === 'true' || onSale === true,
            discountPercentage: discountPercentage ? parseInt(discountPercentage) : null,
            formConfig,
            slug
        };

        if (req.files && req.files['image']) {
            dataToCreate.image = req.files['image'][0].path;
        }

        if (req.files && req.files['images']) {
            const additionalImages = req.files['images'].map(file => file.path);
            dataToCreate.images = JSON.stringify(additionalImages);
        }

        const product = await prisma.product.create({ data: dataToCreate });
        res.json(product);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: 'Error creating product' });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        if (req.user.role !== 'ADMIN') {
            return res.status(403).json({ error: 'Not authorized' });
        }

        const { id } = req.params;
        const { name, description, price, category, sizeFormat, onSale, discountPercentage, formConfig, slug, existingImages } = sanitize(req.body);

        const dataToUpdate = {
            name,
            description,
            price: parseFloat(price),
            category,
            sizeFormat,
            onSale: onSale === 'true' || onSale === true,
            discountPercentage: discountPercentage ? parseInt(discountPercentage) : null,
            formConfig,
            slug
        };

        if (req.files && req.files['image']) {
            dataToUpdate.image = req.files['image'][0].path;
        }

        let finalImages = [];

        if (existingImages) {
            try {
                const parsedExisting = JSON.parse(existingImages);
                if (Array.isArray(parsedExisting)) {
                    finalImages = [...parsedExisting];
                }
            } catch (e) {
                console.error('Error parsing existingImages:', e);
            }
        }

        if (req.files && req.files['images']) {
            const newImageUrls = req.files['images'].map(file => file.path);
            finalImages = [...finalImages, ...newImageUrls];
        }

        if (finalImages.length > 5) {
            finalImages = finalImages.slice(0, 5);
        }

        dataToUpdate.images = JSON.stringify(finalImages);

        const product = await prisma.product.update({
            where: { id: parseInt(id) },
            data: dataToUpdate
        });

        res.json(product);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Error updating product' });
    }
};

exports.deleteProduct = async (req, res) => {
    if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Not authorized' });
    try {
        await prisma.product.delete({ where: { id: parseInt(req.params.id) } });
        res.json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting product' });
    }
};
