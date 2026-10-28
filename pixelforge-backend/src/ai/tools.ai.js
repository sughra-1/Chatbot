import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { getProducts } from '../services/products.service.js';

// The product fields the model needs to answer questions.
// stock is a number: 0 = out of stock, 1-5 = only a few left.
const toSummary = (p) => ({
    id: p.id,
    name: p.name,
    brand: p.brand,
    category: p.category,
    price: p.price,
    originalPrice: p.originalPrice,
    rating: p.rating,
    stock: p.stock
});

const matchesQuery = (product, query) => {
    const text = `${product.name} ${product.brand ?? ''} ${product.category} ${product.description ?? ''}`.toLowerCase();
    return query.toLowerCase().split(/\s+/)
        .some((word) => word.length > 1 && text.includes(word));
};

const searchProducts = tool(
    async ({ query, category, maxPrice }) => {
        let products = await getProducts();
        if (query) products = products.filter((p) => matchesQuery(p, query));
        if (category) products = products.filter(
            (p) => p.category.toLowerCase() === category.toLowerCase()
        );
        if (maxPrice) products = products.filter((p) => p.price <= maxPrice);

        if (!products.length) return 'Inga produkter hittades.';
        return JSON.stringify(products.slice(0, 10).map(toSummary));
    },
    {
        name: 'search_products',
        description: 'Söker efter produkter i PixelForge. Returnerar namn, märke, pris, kategori och lagerstatus (stock = antal i lager, 0 = slut i lager).',
        schema: z.object({
            query: z.string().optional().describe('Sökord, t.ex. produktnamn eller produkttyp'),
            category: z.string().optional().describe('Exakt kategorinamn'),
            maxPrice: z.number().optional().describe('Högsta pris')
        })
    }
);

const listCategories = tool(
    async () => {
        const products = await getProducts();
        return [...new Set(products.map((p) => p.category))].join(', ');
    },
    {
        name: 'list_categories',
        description: 'Listar alla produktkategorier i butiken.',
        schema: z.object({})
    }
);

export const tools = [searchProducts, listCategories];
