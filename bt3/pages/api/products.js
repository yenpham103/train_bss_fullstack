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
      const { page = 1, limit = 8 } = req.query;

      // Phân trang
      const startIndex = (Number(page) - 1) * Number(limit);
      const endIndex = startIndex + Number(limit);
      const paginatedProducts = data.products.slice(startIndex, endIndex);

      // Trả về kết quả
      res.status(200).json({
        products: paginatedProducts,
        totalPages: Math.ceil(data.products.length / Number(limit)),
        currentPage: Number(page),
        totalItems: data.products.length,
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

      // Đọc file JSON
      const jsonData = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(jsonData);

      // Tìm sản phẩm cần cập nhật
      const productIndex = data.products.findIndex(
        (product) => product.id === id
      );

      if (productIndex === -1) {
        return res.status(404).json({ error: 'Product not found' });
      }

      // Cập nhật trạng thái và/hoặc giá
      if (status !== undefined) {
        data.products[productIndex].status = status;
      }
      if (price !== undefined) {
        data.products[productIndex].price = price;
      }

      // Ghi lại vào file
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

      res
        .status(200)
        .json({
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
