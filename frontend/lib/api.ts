import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { apiCache } from './api-cache';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: `${API_URL}/api/v1`,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 5000, // 5 second timeout for faster responses
      withCredentials: true
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.clearToken();
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token');
    }
    return null;
  }

  private clearToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    try {
      const response = await this.client.post('/auth/login', { email, password });
      if (response.data.access_token) {
        localStorage.setItem('access_token', response.data.access_token);
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
      }
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  async register(userData: any) {
    try {
      const response = await this.client.post('/auth/register', userData);
      if (response.data.access_token) {
        localStorage.setItem('access_token', response.data.access_token);
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
      }
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  async logout() {
    try {
      await this.client.post('/auth/logout');
    } catch (error) {
      // Continue with logout even if API call fails
    } finally {
      this.clearToken();
    }
  }

  // Product endpoints
  async getProducts(params?: any) {
    const cacheKey = `products_${JSON.stringify(params || {})}`;
    const cached = apiCache.get(cacheKey);
    if (cached) return cached;
    
    try {
      const response = await this.client.get('/products/', { params });
      apiCache.set(cacheKey, response.data, 30000); // Cache for 30 seconds
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch products');
    }
  }

  async getProduct(id: number) {
    try {
      const response = await this.client.get(`/products/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch product');
    }
  }

  async createProduct(productData: any) {
    try {
      const response = await this.client.post('/admin/products/', productData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to create product');
    }
  }

  async updateProduct(id: number, productData: any) {
    try {
      const response = await this.client.put(`/admin/products/${id}`, productData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to update product');
    }
  }

  async deleteProduct(id: number) {
    try {
      const response = await this.client.delete(`/products/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to delete product');
    }
  }

  async getCategories() {
    try {
      const response = await this.client.get('/products/categories/');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch categories');
    }
  }

  // Cart endpoints
  async getCart() {
    try {
      const response = await this.client.get('/cart/');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch cart');
    }
  }

  async addToCart(productId: number, quantity: number) {
    try {
      const response = await this.client.post('/cart/items', {
        product_id: productId,
        quantity,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to add to cart');
    }
  }

  async updateCartItem(itemId: number, quantity: number) {
    try {
      const response = await this.client.put(`/cart/items/${itemId}?quantity=${quantity}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to update cart item');
    }
  }

  async removeFromCart(itemId: number) {
    try {
      const response = await this.client.delete(`/cart/items/${itemId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to remove from cart');
    }
  }

  // Order endpoints
  async createOrder(orderData: any) {
    try {
      const response = await this.client.post('/orders/', orderData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to create order');
    }
  }

  async getOrders() {
    try {
      const response = await this.client.get('/orders/');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch orders');
    }
  }

  async getOrder(id: number) {
    try {
      const response = await this.client.get(`/orders/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch order');
    }
  }

  // Admin endpoints
  async getAllOrders() {
    try {
      const response = await this.client.get('/orders/admin/all');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch all orders');
    }
  }

  async updateOrderStatus(orderId: number, status: string) {
    try {
      const response = await this.client.put(`/orders/${orderId}/status?status=${status}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to update order status');
    }
  }

  async getAllUsers() {
    try {
      const response = await this.client.get('/admin/users');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch users');
    }
  }

  async createUser(userData: any) {
    try {
      const response = await this.client.post('/admin/users', userData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to create user');
    }
  }

  async updateUser(userId: number, userData: any) {
    try {
      const response = await this.client.put(`/admin/users/${userId}`, userData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to update user');
    }
  }

  async deleteUser(userId: number) {
    try {
      const response = await this.client.delete(`/admin/users/${userId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to delete user');
    }
  }

  async getAuditLogs() {
    try {
      const response = await this.client.get('/admin/audits');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch audit logs');
    }
  }





  // Photo upload endpoints
  async uploadProductPhoto(productId: number, file: File, isMain: boolean = false) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('is_main', isMain.toString());
      
      const response = await this.client.post(`/products/${productId}/photos`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000, // 30 seconds for file upload
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to upload photo');
    }
  }

  async deleteProductPhoto(productId: number, photoId: number) {
    try {
      const response = await this.client.delete(`/products/${productId}/photos/${photoId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to delete photo');
    }
  }

  async setMainPhoto(productId: number, photoId: number) {
    try {
      const response = await this.client.put(`/products/${productId}/photos/${photoId}/main`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to set main photo');
    }
  }

  async deleteProductImage(productId: number, imageId: number) {
    try {
      const response = await this.client.delete(`/admin/products/${productId}/images/${imageId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to delete image');
    }
  }

  // Health check
  async healthCheck() {
    try {
      const response = await this.client.get('/health');
      return response.data;
    } catch (error) {
      throw new Error('Backend is not accessible');
    }
  }
}

export const api = new ApiClient();