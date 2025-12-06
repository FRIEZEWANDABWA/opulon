import { create } from 'zustand';

interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: number;
    image_url?: string;
  };
}

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  total: number;
  setItems: (items: CartItem[]) => void;
  addItem: (item: CartItem) => void;
  updateItem: (itemId: number, quantity: number) => void;
  removeItem: (itemId: number) => void;
  clearCart: () => void;
  setLoading: (loading: boolean) => void;
  calculateTotal: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isLoading: false,
  total: 0,
  setItems: (items: CartItem[]) => {
    set({ items });
    get().calculateTotal();
  },
  addItem: (item: CartItem) => {
    const items = get().items;
    const existingItem = items.find(i => i.product_id === item.product_id);
    
    if (existingItem) {
      set({
        items: items.map(i =>
          i.product_id === item.product_id
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        )
      });
    } else {
      set({ items: [...items, item] });
    }
    get().calculateTotal();
  },
  updateItem: (itemId: number, quantity: number) => {
    set({
      items: get().items.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    });
    get().calculateTotal();
  },
  removeItem: (itemId: number) => {
    set({ items: get().items.filter(item => item.id !== itemId) });
    get().calculateTotal();
  },
  clearCart: () => {
    set({ items: [], total: 0 });
  },
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  calculateTotal: () => {
    const total = get().items.reduce(
      (sum, item) => sum + (item.product.price * item.quantity),
      0
    );
    set({ total });
  },
}));