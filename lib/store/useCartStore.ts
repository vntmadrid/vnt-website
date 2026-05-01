import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  title: Record<string, string>; // e.g., { en: "Title", es: "Titre" }
  slug: string;
  price: number;
  stock: number;
  image: any; // First image
  stripePriceId?: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  
  // Actions
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  
  // UI
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  
  // Computed (handled in component typically, but helpful)
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      
      addItem: (item) => set((state) => {
        const existing = state.items.find(i => i.id === item.id);
        if (existing) {
          // Check stock
          if (existing.quantity >= item.stock) return state;
          
          return {
            items: state.items.map(i => 
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            )
          };
        }
        
        return { items: [...state.items, { ...item, quantity: 1 }] };
      }),
      
      removeItem: (id) => set((state) => ({
        items: state.items.filter(i => i.id !== id)
      })),
      
      updateQuantity: (id, quantity) => set((state) => ({
        items: state.items.map(i => {
          if (i.id === id) {
            // Constrain by stock
            const maxStock = Math.max(0, i.stock);
            const clamped = Math.min(Math.max(1, quantity), maxStock);
            return { ...i, quantity: clamped };
          }
          return i;
        })
      })),
      
      clearCart: () => set({ items: [] }),
      
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      
      getTotal: () => get().items.reduce((total, item) => total + (item.price * item.quantity), 0),
      getItemCount: () => get().items.reduce((count, item) => count + item.quantity, 0),
    }),
    {
      name: 'vnt-cart-storage',
      // Only persist items, not UI state
      partialize: (state) => ({ items: state.items }),
    }
  )
);
