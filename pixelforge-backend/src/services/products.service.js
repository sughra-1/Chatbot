const PRODUCTS_URL = 'https://santosnr6.github.io/Data/pixelforgeproducts.json';

export const getProducts = async () => {
    const response = await fetch(PRODUCTS_URL);
    if (!response.ok) throw new Error('Could not fetch products');
    return response.json();
};
