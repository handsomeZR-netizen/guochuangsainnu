import React from 'react';
import { X, Trash2, Plus, Minus } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  nameEn: string;
  price: number;
  currency: string;
  image: string;
  quantity: number;
}

interface ShoppingCartProps {
  isOpen: boolean;
  onClose: () => void;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ isOpen, onClose }) => {
  // 示例购物车数据
  const [cartItems, setCartItems] = React.useState<CartItem[]>([
    {
      id: '1',
      name: '缠枝莲纹青花瓷瓶',
      nameEn: 'Blue & White Porcelain Vase',
      price: 1250,
      currency: 'USD',
      image: '/images/product-1.jpg',
      quantity: 1
    }
  ]);

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-start justify-end bg-black/30 backdrop-blur-sm">
      <div className="bg-white h-full w-full max-w-md shadow-2xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="bg-blue-900 text-white p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">购物车</h2>
          <button 
            onClick={onClose}
            className="hover:bg-white/20 p-2 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-slate-400 text-lg">购物车是空的</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="bg-slate-50 rounded-lg p-4 flex gap-4">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900">{item.name}</h3>
                  <p className="text-sm text-slate-500">{item.nameEn}</p>
                  <p className="text-blue-900 font-bold mt-2">
                    {item.currency} {item.price.toLocaleString()}
                  </p>
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3 mt-2">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-6 h-6 bg-slate-200 hover:bg-slate-300 rounded flex items-center justify-center"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="font-bold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-6 h-6 bg-slate-200 hover:bg-slate-300 rounded flex items-center justify-center"
                    >
                      <Plus size={14} />
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="ml-auto text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t border-slate-200 p-6 space-y-4">
            <div className="flex justify-between items-center text-lg">
              <span className="font-bold text-slate-700">总计：</span>
              <span className="text-2xl font-bold text-blue-900">
                USD {total.toLocaleString()}
              </span>
            </div>
            <button className="w-full bg-blue-900 hover:bg-blue-800 text-white py-4 rounded-lg font-bold text-lg transition-colors">
              前往结算
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingCart;
