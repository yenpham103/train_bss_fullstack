import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const filePath = path.join(process.cwd(), 'data', 'products.json');

  if (req.method === 'GET') {
    try {
      if (!fs.existsSync(filePath)) {
        throw new Error('Products file not found');
      }

      const jsonData = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(jsonData);

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 8;
      const { status, search } = req.query;

      if (page < 1 || limit < 1) {
        return res.status(400).json({ error: 'Invalid page or limit value' });
      }

      let filteredProducts = data.products;
      if (status && status !== 'all') {
        filteredProducts = filteredProducts.filter(
          (product) => product.status === status
        );
      }

      if (search) {
        const searchLower = search.toLowerCase();
        filteredProducts = filteredProducts.filter(
          (product) =>
            (product.name &&
              product.name.toLowerCase().includes(searchLower)) ||
            (product.description &&
              product.description.toLowerCase().includes(searchLower))
        );
      }

      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

      res.status(200).json({
        products: paginatedProducts,
        totalPages: Math.ceil(filteredProducts.length / limit),
        currentPage: page,
        totalItems: filteredProducts.length,
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      res
        .status(500)
        .json({ error: 'Unable to fetch products', details: error.message });
    }
  } else if (req.method === 'PATCH') {
    try {
      const { id, status, price } = req.body;

      if (!id) {
        return res.status(400).json({ error: 'Product ID is required' });
      }

      const jsonData = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(jsonData);

      const productIndex = data.products.findIndex(
        (product) => product.id === id
      );

      if (productIndex === -1) {
        return res.status(404).json({ error: 'Product not found' });
      }

      if (status !== undefined) {
        data.products[productIndex].status = status;
      }
      if (price !== undefined) {
        data.products[productIndex].price = price;
      }

      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

      res.status(200).json({
        message: 'Product updated successfully',
        product: data.products[productIndex],
      });
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ error: 'Unable to update product' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PATCH']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
