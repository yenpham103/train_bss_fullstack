import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const filePath = path.join(process.cwd(), 'data', 'products.json');

  if (req.method === 'GET') {
    try {
      // Đọc file JSON
      const jsonData = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(jsonData);

      // Lấy query parameters
      const { page = 1, limit = 8, status, search } = req.query;

      // Lọc sản phẩm theo status
      let filteredProducts = data.products;
      if (status && status !== 'all') {
        filteredProducts = data.products.filter(
          (product) => product.status === status
        );
      }

      if (search) {
        const searchLower = search.toLowerCase();
        filteredProducts = filteredProducts.filter(
          (product) =>
            product.name.toLowerCase().includes(searchLower) ||
            product.description.toLowerCase().includes(searchLower)
        );
      }

      const startIndex = (Number(page) - 1) * Number(limit);
      const endIndex = startIndex + Number(limit);
      const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

      res.status(200).json({
        products: paginatedProducts,
        totalPages: Math.ceil(filteredProducts.length / Number(limit)),
        currentPage: Number(page),
        totalItems: filteredProducts.length,
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: 'Unable to fetch products' });
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
