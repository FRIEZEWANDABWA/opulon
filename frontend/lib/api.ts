import axios, { AxiosInstance, AxiosResponse } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: `${API_URL}/api/v1`,
      headers: {
        'Content-Type': 'application/json',
      },
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
          window.location.href = '/login';
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
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const response = await this.client.post('/auth/login', { email, password });
    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
    }
    return response.data;
  }

  async register(userData: any) {
    const response = await this.client.post('/auth/register', userData);
    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
    }
    return response.data;
  }

  // Product endpoints
  async getProducts(params?: any) {
    const response = await this.client.get('/products', { params });
    return response.data;
  }

  async getProduct(id: number) {
    const response = await this.client.get(`/products/${id}`);
    return response.data;
  }

  async createProduct(productData: any) {
    const response = await this.client.post('/products', productData);
    return response.data;
  }

  async updateProduct(id: number, productData: any) {
    const response = await this.client.put(`/products/${id}`, productData);
    return response.data;
  }

  async getCategories() {
    const response = await this.client.get('/products/categories');
    return response.data;
  }

  // Cart endpoints
  async getCart() {
    const response = await this.client.get('/cart');
    return response.data;
  }

  async addToCart(productId: number, quantity: number) {
    const response = await this.client.post('/cart/items', {
      product_id: productId,
      quantity,
    });
    return response.data;
  }

  async updateCartItem(itemId: number, quantity: number) {
    const response = await this.client.put(`/cart/items/${itemId}?quantity=${quantity}`);
    return response.data;
  }

  async removeFromCart(itemId: number) {
    const response = await this.client.delete(`/cart/items/${itemId}`);
    return response.data;
  }

  // Order endpoints
  async createOrder(orderData: any) {
    const response = await this.client.post('/orders', orderData);
    return response.data;
  }

  async getOrders() {
    const response = await this.client.get('/orders');
    return response.data;
  }

  async getOrder(id: number) {
    const response = await this.client.get(`/orders/${id}`);
    return response.data;
  }

  // Admin endpoints
  async getAllOrders() {
    const response = await this.client.get('/orders/admin/all');
    return response.data;
  }

  async updateOrderStatus(orderId: number, status: string) {
    const response = await this.client.put(`/orders/${orderId}/status?status=${status}`);
    return response.data;
  }
}

export const api = new ApiClient();