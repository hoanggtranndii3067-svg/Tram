import React, { useState } from 'react';
import { 
  X, Trash2, ShoppingBag, ArrowRight, Plus, 
  Minus, ShieldCheck, MapPin, Sparkles 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CheckoutModal } from './CheckoutModal';

export const UniversalCartDrawer: React.FC = () => {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    removeFromCart, 
    updateCartQuantity, 
    clearCart,
    t 
  } = useApp();

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  if (!isCartOpen) return null;

  const totalAmount = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Group cart items by seller
  const sellerGroups: { [sellerId: string]: typeof cart } = {};
  cart.forEach(item => {
    const sId = item.product.sellerId;
    if (!sellerGroups[sId]) sellerGroups[sId] = [];
    sellerGroups[sId].push(item);
  });

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
          onClick={() => setIsCartOpen(false)}
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex">
          <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
            
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-amber-600" />
                <h3 className="font-heading font-bold text-base text-slate-900">
                  {t.cart} ({cart.length} món)
                </h3>
              </div>
              <div className="flex items-center gap-2">
                {cart.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-xs text-slate-400 hover:text-red-500 transition-colors"
                  >
                    Xóa tất cả
                  </button>
                )}
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {cart.length === 0 ? (
                <div className="py-16 text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <p className="text-sm font-semibold text-slate-700">Giỏ hàng của bạn đang trống</p>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    Hãy dạo quanh sàn Unimart LHU và chọn mua sách cũ, quạt mini, bàn học giá rẻ nhé!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Giỏ hàng chung:</strong> Bạn có thể gộp nhiều món đồ từ các bạn sinh viên khác nhau để đặt mua cùng một lúc.
                    </span>
                  </div>

                  {Object.entries(sellerGroups).map(([sellerId, items]) => {
                    const sellerName = items[0]?.product.sellerName || 'Người bán LHU';
                    return (
                      <div key={sellerId} className="border border-slate-200/80 rounded-xl p-3.5 bg-slate-50/50 space-y-3">
                        <div className="flex items-center justify-between text-xs border-b border-slate-200/60 pb-2">
                          <span className="font-bold text-slate-800">Người bán: {sellerName}</span>
                          <span className="text-slate-400 text-[11px]">{items.length} món</span>
                        </div>

                        <div className="space-y-3">
                          {items.map(({ product, quantity }) => (
                            <div key={product.id} className="flex items-center gap-3 bg-white p-2.5 rounded-lg border border-slate-100">
                              <img
                                src={product.images[0]}
                                alt={product.title}
                                referrerPolicy="no-referrer"
                                className="w-14 h-14 rounded-lg object-cover bg-slate-100 shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="text-xs font-semibold text-slate-900 truncate">
                                  {product.title}
                                </h4>
                                <div className="text-xs font-bold font-mono tabular-nums text-slate-900 mt-0.5">
                                  {product.price === 0 ? '0đ (Tặng)' : new Intl.NumberFormat('vi-VN').format(product.price) + 'đ'}
                                </div>
                                <div className="flex items-center justify-between mt-2">
                                  <div className="flex items-center border border-slate-200 rounded-md">
                                    <button
                                      onClick={() => updateCartQuantity(product.id, quantity - 1)}
                                      className="p-1 hover:bg-slate-100 text-slate-600"
                                    >
                                      <Minus className="w-3 h-3" />
                                    </button>
                                    <span className="px-2 text-xs font-mono tabular-nums font-bold">
                                      {quantity}
                                    </span>
                                    <button
                                      onClick={() => updateCartQuantity(product.id, quantity + 1)}
                                      className="p-1 hover:bg-slate-100 text-slate-600"
                                    >
                                      <Plus className="w-3 h-3" />
                                    </button>
                                  </div>

                                  <button
                                    onClick={() => removeFromCart(product.id)}
                                    className="text-slate-400 hover:text-red-500 p-1"
                                    title="Xoá món này"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer & Checkout Trigger */}
            {cart.length > 0 && (
              <div className="p-4 border-t border-slate-100 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 font-medium">Tổng tiền thanh toán:</span>
                  <span className="text-xl font-extrabold font-mono tabular-nums text-slate-900">
                    {new Intl.NumberFormat('vi-VN').format(totalAmount)}đ
                  </span>
                </div>

                <button
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-600 active:scale-98 text-slate-950 font-bold text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <span>Tiến hành đặt hàng & Tạo QR</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Bảo chứng giao dịch an toàn bởi ĐH Lạc Hồng</span>
                </p>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <CheckoutModal
          cartItems={cart}
          totalAmount={totalAmount}
          onClose={() => setIsCheckoutOpen(false)}
        />
      )}
    </>
  );
};
