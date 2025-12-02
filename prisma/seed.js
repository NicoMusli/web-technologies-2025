const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
    console.log('Starting seed...');

    // Create Admin User
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@example.com' },
        update: {
            username: 'admin',
            role: 'ADMIN' // Ensure role is ADMIN
        },
        create: {
            email: 'admin@example.com',
            username: 'admin',
            password: hashedPassword,
            firstName: 'Admin',
            lastName: 'User',
            role: 'ADMIN',
        },
    });
    console.log('Admin user created/updated:', admin.email);

    // Define Products
    const products = [
        {
            name: 'Business Cards',
            slug: 'business-cards',
            description: 'Professional business cards to make a lasting impression. Available in various finishes.',
            price: 25.00,
            category: 'Cards',
            onSale: false,
            image: null,
            formConfig: JSON.stringify([
                { label: 'Paper Type', name: 'paperType', type: 'select', options: ['Standard Matte', 'Premium Glossy', 'Recycled', 'Soft Touch'], defaultValue: 'Standard Matte' },
                { label: 'Corners', name: 'corners', type: 'select', options: ['Square', 'Rounded'], defaultValue: 'Square' },
                { label: 'Quantity', name: 'quantity', type: 'select', options: ['100', '250', '500', '1000'], defaultValue: '250' },
                { label: 'Design File', name: 'designFile', type: 'file', options: [], defaultValue: '' }
            ])
        },
        {
            name: 'Marketing Flyers',
            slug: 'flyers',
            description: 'High-quality flyers for events, promotions, and marketing. Vibrant colors and sharp text.',
            price: 45.00,
            category: 'Marketing',
            onSale: true,
            discountPercentage: 10,
            image: null,
            formConfig: JSON.stringify([
                { label: 'Size', name: 'size', type: 'select', options: ['A6', 'A5', 'A4', 'DL'], defaultValue: 'A5' },
                { label: 'Paper Weight', name: 'paperWeight', type: 'select', options: ['130gsm Gloss', '170gsm Silk', '300gsm Art Board'], defaultValue: '130gsm Gloss' },
                { label: 'Sides', name: 'sides', type: 'select', options: ['Single Sided', 'Double Sided'], defaultValue: 'Single Sided' },
                { label: 'Design File', name: 'designFile', type: 'file', options: [], defaultValue: '' }
            ])
        },
        {
            name: 'Large Format Posters',
            slug: 'posters',
            description: 'Make a big impact with our large format posters. Perfect for indoor and outdoor display.',
            price: 35.00,
            category: 'Large Format',
            onSale: false,
            image: null,
            formConfig: JSON.stringify([
                { label: 'Size', name: 'size', type: 'select', options: ['A2', 'A1', 'A0', 'Custom'], defaultValue: 'A1' },
                { label: 'Material', name: 'material', type: 'select', options: ['Satin Photo Paper', 'Matt Coated', 'Backlit Film'], defaultValue: 'Satin Photo Paper' },
                { label: 'Lamination', name: 'lamination', type: 'select', options: ['None', 'Gloss', 'Matt'], defaultValue: 'None' },
                { label: 'Artwork', name: 'artwork', type: 'file', options: [], defaultValue: '' }
            ])
        },
        {
            name: 'Vinyl Banners',
            slug: 'banners',
            description: 'Durable vinyl banners for outdoor advertising. Weather-resistant and eye-catching.',
            price: 60.00,
            category: 'Large Format',
            onSale: true,
            discountPercentage: 15,
            image: null,
            formConfig: JSON.stringify([
                { label: 'Size', name: 'size', type: 'select', options: ['2ft x 4ft', '3ft x 6ft', '4ft x 8ft', 'Custom'], defaultValue: '3ft x 6ft' },
                { label: 'Material', name: 'material', type: 'select', options: ['440gsm Standard Vinyl', '510gsm Premium Vinyl', 'Mesh Vinyl'], defaultValue: '440gsm Standard Vinyl' },
                { label: 'Finishing', name: 'finishing', type: 'select', options: ['Hems & Eyelets', 'Pole Pockets', 'Clean Cut'], defaultValue: 'Hems & Eyelets' },
                { label: 'Design', name: 'design', type: 'file', options: [], defaultValue: '' }
            ])
        },
        {
            name: 'Custom Stickers',
            slug: 'stickers',
            description: 'Versatile stickers for branding, packaging, or fun. Cut to any shape.',
            price: 15.00,
            category: 'Marketing',
            onSale: false,
            image: null,
            formConfig: JSON.stringify([
                { label: 'Shape', name: 'shape', type: 'select', options: ['Circle', 'Square', 'Rectangle', 'Custom Contour'], defaultValue: 'Circle' },
                { label: 'Size', name: 'size', type: 'select', options: ['30mm', '50mm', '70mm', '100mm'], defaultValue: '50mm' },
                { label: 'Finish', name: 'finish', type: 'select', options: ['Gloss Vinyl', 'Matt Vinyl', 'Clear Vinyl', 'Paper'], defaultValue: 'Gloss Vinyl' },
                { label: 'Quantity', name: 'quantity', type: 'select', options: ['50', '100', '200', '500'], defaultValue: '100' },
                { label: 'Logo', name: 'logo', type: 'file', options: [], defaultValue: '' }
            ])
        },
        {
            name: 'Brochures',
            slug: 'brochures',
            description: 'Informative brochures folded to perfection. Ideal for menus, price lists, and info sheets.',
            price: 55.00,
            category: 'Marketing',
            onSale: false,
            image: null,
            formConfig: JSON.stringify([
                { label: 'Fold Type', name: 'foldType', type: 'select', options: ['Half Fold', 'Tri-Fold (Roll)', 'Z-Fold'], defaultValue: 'Tri-Fold (Roll)' },
                { label: 'Flat Size', name: 'flatSize', type: 'select', options: ['A4', 'A3'], defaultValue: 'A4' },
                { label: 'Paper', name: 'paper', type: 'select', options: ['130gsm Gloss', '150gsm Silk', '170gsm Gloss'], defaultValue: '150gsm Silk' },
                { label: 'Quantity', name: 'quantity', type: 'select', options: ['100', '250', '500', '1000'], defaultValue: '250' },
                { label: 'Artwork', name: 'artwork', type: 'file', options: [], defaultValue: '' }
            ])
        }
    ];

    for (const product of products) {
        const p = await prisma.product.upsert({
            where: { slug: product.slug },
            update: {
                ...product
            },
            create: {
                ...product
            },
        });
        console.log(`Product upserted: ${p.name}`);
    }

    // Create default Settings
    const settings = await prisma.settings.upsert({
        where: { id: 1 },
        update: {},
        create: {
            shippingCost: 5.00,
            taxRate: 0.20, // 20% VAT
            currency: 'EUR'
        },
    });
    console.log('Settings upserted');

    console.log('Seed completed successfully.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

