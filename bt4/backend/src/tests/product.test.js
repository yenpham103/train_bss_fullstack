const {
  getAllProducts,
  updateProductStatus,
  updateProductPrice,
  searchProducts,
} = require('../controllers/product.controller');
const { Product } = require('../models');
const { Op } = require('sequelize');

// Mock the Sequelize model and Op
jest.mock('../models', () => ({
  Product: {
    findAndCountAll: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn(),
  },
}));
jest.mock('sequelize', () => ({
  Op: {
    iLike: jest.fn(),
  },
}));

describe('Product Controller', () => {
  let mockCtx;

  beforeEach(() => {
    mockCtx = {
      query: {},
      params: {},
      request: {
        body: {},
        query: {},
      },
      state: { user: { id: 1 } },
      status: null,
      body: null,
    };
    jest.clearAllMocks();
  });

  describe('getAllProducts', () => {
    it('should return products with default pagination', async () => {
      const mockProducts = [
        { id: 1, name: 'Product 1' },
        { id: 2, name: 'Product 2' },
      ];
      Product.findAndCountAll.mockResolvedValue({
        count: 2,
        rows: mockProducts,
      });

      await getAllProducts(mockCtx);

      expect(mockCtx.status).toBe(200);
      expect(mockCtx.body).toEqual({
        products: mockProducts,
        currentPage: 1,
        totalPages: 1,
        totalItems: 2,
      });
      expect(Product.findAndCountAll).toHaveBeenCalledWith({
        where: { user_id: 1 },
        limit: 8,
        offset: 0,
        order: [['created_at', 'DESC']],
      });
    });

    it('should handle custom pagination and status', async () => {
      mockCtx.query = { page: '2', limit: '5', status: 'active' };
      const mockProducts = [{ id: 3, name: 'Product 3' }];
      Product.findAndCountAll.mockResolvedValue({
        count: 11,
        rows: mockProducts,
      });

      await getAllProducts(mockCtx);

      expect(mockCtx.status).toBe(200);
      expect(mockCtx.body).toEqual({
        products: mockProducts,
        currentPage: 2,
        totalPages: 3,
        totalItems: 11,
      });
      expect(Product.findAndCountAll).toHaveBeenCalledWith({
        where: { user_id: 1, status: 'active' },
        limit: 5,
        offset: 5,
        order: [['created_at', 'DESC']],
      });
    });

    it('should return empty array when no products found', async () => {
      Product.findAndCountAll.mockResolvedValue({ count: 0, rows: [] });

      await getAllProducts(mockCtx);

      expect(mockCtx.status).toBe(200);
      expect(mockCtx.body).toEqual({
        products: [],
        currentPage: 1,
        totalPages: 0,
        totalItems: 0,
      });
    });

    it('should handle errors', async () => {
      Product.findAndCountAll.mockRejectedValue(new Error('Database error'));

      await getAllProducts(mockCtx);

      expect(mockCtx.status).toBe(500);
      expect(mockCtx.body).toEqual({ error: 'Internal server error' });
    });
  });

  describe('updateProductStatus', () => {
    it('should update product status', async () => {
      const mockProduct = { id: 1, status: 'active', update: jest.fn() };
      Product.findOne.mockResolvedValue(mockProduct);
      mockCtx.params = { id: 1 };
      mockCtx.request.body = { status: 'inactive' };

      await updateProductStatus(mockCtx);

      expect(mockProduct.update).toHaveBeenCalledWith({ status: 'inactive' });
      expect(mockCtx.body).toEqual(mockProduct);
    });

    it('should return 404 if product not found', async () => {
      Product.findOne.mockResolvedValue(null);
      mockCtx.params = { id: 999 };
      mockCtx.request.body = { status: 'inactive' };

      await updateProductStatus(mockCtx);

      expect(mockCtx.status).toBe(404);
      expect(mockCtx.body).toEqual({ error: 'Product not found' });
    });

    it('should handle errors', async () => {
      Product.findOne.mockRejectedValue(new Error('Database error'));
      mockCtx.params = { id: 1 };
      mockCtx.request.body = { status: 'inactive' };

      await updateProductStatus(mockCtx);

      expect(mockCtx.status).toBe(500);
      expect(mockCtx.body).toEqual({ error: 'Database error' });
    });
  });

  describe('updateProductPrice', () => {
    it('should update product price', async () => {
      const mockProduct = { id: 1, price: 10, update: jest.fn() };
      Product.findOne.mockResolvedValue(mockProduct);
      mockCtx.params = { id: 1 };
      mockCtx.request.body = { price: 15 };

      await updateProductPrice(mockCtx);

      expect(mockProduct.update).toHaveBeenCalledWith({ price: 15 });
      expect(mockCtx.body).toEqual(mockProduct);
    });

    it('should return 404 if product not found', async () => {
      Product.findOne.mockResolvedValue(null);
      mockCtx.params = { id: 999 };
      mockCtx.request.body = { price: 15 };

      await updateProductPrice(mockCtx);

      expect(mockCtx.status).toBe(404);
      expect(mockCtx.body).toEqual({ error: 'Product not found' });
    });

    it('should handle errors', async () => {
      Product.findOne.mockRejectedValue(new Error('Database error'));
      mockCtx.params = { id: 1 };
      mockCtx.request.body = { price: 15 };

      await updateProductPrice(mockCtx);

      expect(mockCtx.status).toBe(500);
      expect(mockCtx.body).toEqual({ error: 'Database error' });
    });
  });

  describe('searchProducts', () => {
    it('should search products with name and status', async () => {
      const mockProducts = [
        { id: 1, name: 'Product 1' },
        { id: 2, name: 'Product 2' },
      ];
      Product.findAll.mockResolvedValue(mockProducts);
      mockCtx.request.query = { search: 'Product', status: 'included' };

      await searchProducts(mockCtx);

      expect(Product.findAll).toHaveBeenCalledWith({
        where: {
          user_id: 1,
          name: { [Op.iLike]: '%Product%' },
          status: 'included',
        },
        order: [['created_at', 'DESC']],
      });
      expect(mockCtx.body).toEqual({
        status: 'success',
        products: mockProducts,
      });
    });

    it('should search products with only name', async () => {
      const mockProducts = [{ id: 1, name: 'Product 1' }];
      Product.findAll.mockResolvedValue(mockProducts);
      mockCtx.request.query = { search: 'Product' };

      await searchProducts(mockCtx);

      expect(Product.findAll).toHaveBeenCalledWith({
        where: {
          user_id: 1,
          name: { [Op.iLike]: '%Product%' },
        },
        order: [['created_at', 'DESC']],
      });
    });

    it('should search products with only status', async () => {
      const mockProducts = [{ id: 1, name: 'Product 1', status: 'excluded' }];
      Product.findAll.mockResolvedValue(mockProducts);
      mockCtx.request.query = { status: 'excluded' };

      await searchProducts(mockCtx);

      expect(Product.findAll).toHaveBeenCalledWith({
        where: {
          user_id: 1,
          status: 'excluded',
        },
        order: [['created_at', 'DESC']],
      });
    });

    it('should return empty array when no products found', async () => {
      Product.findAll.mockResolvedValue([]);
      mockCtx.request.query = { search: 'NonExistentProduct' };

      await searchProducts(mockCtx);

      expect(mockCtx.body).toEqual({
        status: 'success',
        products: [],
      });
    });

    it('should handle errors', async () => {
      Product.findAll.mockRejectedValue(new Error('Database error'));

      await searchProducts(mockCtx);

      expect(mockCtx.status).toBe(500);
      expect(mockCtx.body).toEqual({
        status: 'error',
        message: 'Internal server error',
      });
    });
  });
});
