import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { getProducts } from '../services/products.service.js';

// ⚠️ Match these fields to the real product JSON
const toSummary = (p) => ({
    id: p.id, name: p.name, price: p.price, category: p.category, stock: p.stock
});

const matchesQuery = (product, query) => {
    const text = `${product.name} ${product.category} ${product.description ?? ''}`.toLowerCase();
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
        description: 'Söker efter produkter i PixelForge. Returnerar namn, pris, kategori och lagerstatus.',
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
