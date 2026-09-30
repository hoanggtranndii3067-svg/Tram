import React, { useState } from 'react';
import { 
  Package, ShoppingBag, Clock, CheckCircle2, 
  MapPin, Phone, ChevronRight, Edit3, Trash2, 
  Sparkles, AlertCircle, ArrowUpRight 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Order, Product } from '../types';

export const MyOrdersView: React.FC = () => {
  const { 
    currentUser, 
    orders, 
    products, 
    updateOrderStatus, 
    setSelectedProductDetail,
    setEditingProduct,
    setIsCreateProductOpen,
    deleteProduct,
    t 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'purchases' | 'sales'>('purchases');

  // Filter orders for current user
  const myPurchases = orders.filter(o => o.buyerId === currentUser.id);
  const mySalesProducts = products.filter(p => p.sellerId === currentUser.id);

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-md">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>Chờ người bán duyệt</span>
          </span>
        );
      case 'trading_at_campus':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-800 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-md">
            <MapPin className="w-3 h-3 text-blue-600" />
            <span>Đang hẹn gặp tại LHU</span>
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Giao dịch thành công</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-800 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-md">
            <AlertCircle className="w-3 h-3 text-red-600" />
            <span>Đã hủy</span>
          </span>
        );
    }
  };

  const handleEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setIsCreateProductOpen(true);
  };

  return (
    <div className="max-w-5xl mx-auto py-6 space-y-6">
      
      {/* Title & Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-slate-900">
            Quản Lý Giao Dịch Sinh Viên LHU
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Theo dõi đơn hàng mua và quản lý các bài đăng bán của tài khoản <strong className="text-slate-800">{currentUser.name}</strong>
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl shrink-0">
          <button
            onClick={() => setActiveTab('purchases')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'purchases'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Mua của tôi ({myPurchases.length})
          </button>
          <button
            onClick={() => setActiveTab('sales')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'sales'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Bán của tôi ({mySalesProducts.length})
          </button>
        </div>
      </div>

      {/* Purchases Tab View */}
      {activeTab === 'purchases' && (
        <div className="space-y-4">
          {myPurchases.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200/80 space-y-3">
              <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-700">Bạn chưa có đơn mua nào</p>
              <p className="text-xs text-slate-400">
                Hãy dạo quanh sàn Unimart LHU và chọn mua các vật dụng hữu ích nhé!
              </p>
            </div>
          ) : (
            myPurchases.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4"
              >
                {/* Order Top Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-900">
                      Mã đơn: {order.id}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="text-xs text-slate-500">{order.createdAt}</span>
                  </div>
                  <div>{getStatusBadge(order.status)}</div>
                </div>

                {/* Items */}
                <div className="space-y-2.5">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-lg object-cover bg-slate-100 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-900 truncate">
                          {item.title}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Người bán: {item.sellerName} · SL: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold font-mono tabular-nums text-slate-800">
                          {item.price === 0 ? '0đ (Tặng)' : new Intl.NumberFormat('vi-VN').format(item.price * item.quantity) + 'đ'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Location & Total */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="text-slate-600 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Hẹn gặp: <strong>{order.buyerLocation}</strong> (SĐT: {order.buyerPhone})</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-slate-500">Tổng tiền:</span>
                    <span className="text-base font-extrabold font-mono tabular-nums text-amber-700">
                      {new Intl.NumberFormat('vi-VN').format(order.totalAmount)}đ
                    </span>
                  </div>
                </div>

                {/* Status action toggle simulation */}
                <div className="pt-2 flex items-center justify-end gap-2 text-xs">
                  {order.status === 'pending' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'trading_at_campus')}
                      className="px-3 py-1.5 bg-blue-50 text-blue-700 font-semibold rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      Xác nhận đang hẹn gặp tại trường
                    </button>
                  )}
                  {order.status === 'trading_at_campus' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'completed')}
                      className="px-3 py-1.5 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      Đã nhận đồ & Hoàn tất
                    </button>
                  )}
                  {order.status !== 'completed' && order.status !== 'cancelled' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'cancelled')}
                      className="px-3 py-1.5 text-slate-500 hover:text-red-600 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      Hủy đơn
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Sales Tab View (My Listings) */}
      {activeTab === 'sales' && (
        <div className="space-y-4">
          {mySalesProducts.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200/80 space-y-3">
              <Package className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-700">Bạn chưa đăng bài thanh lý nào</p>
              <p className="text-xs text-slate-400">
                Hãy bấm nút "Đăng tin mới" ở thanh menu để đăng bán hoặc tặng đồ cho bạn bè cùng trường!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mySalesProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={prod.images[0]}
                      alt={prod.title}
                      referrerPolicy="no-referrer"
                      className="w-20 h-20 rounded-xl object-cover bg-slate-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          prod.status === 'available' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {prod.status === 'available' ? 'Đang mở bán' : 'Đã bán'}
                        </span>
                        <span className="text-[11px] text-slate-400">{prod.createdAt}</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 mt-1 line-clamp-1">
                        {prod.title}
                      </h4>
                      <div className="text-xs font-bold font-mono tabular-nums text-slate-900 mt-0.5">
                        {prod.price === 0 ? '0đ (Tặng miễn phí)' : new Intl.NumberFormat('vi-VN').format(prod.price) + 'đ'}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Lượt xem: {prod.viewsCount} · Yêu thích: {prod.likesCount}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <button
                      onClick={() => setSelectedProductDetail(prod)}
                      className="text-slate-600 hover:text-slate-900 font-medium"
                    >
                      Xem trang bài đăng
                    </button>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleEditProduct(prod)}
                        className="p-1.5 text-slate-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
                        title="Chỉnh sửa bài đăng"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Xoá vĩnh viễn bài đăng này?')) {
                            deleteProduct(prod.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xoá bài đăng"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
