import React from 'react';
import { Heart, ShoppingBag, Eye, MapPin, UserCheck, Sparkles, MessageSquare } from 'lucide-react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { 
    setSelectedProductDetail, 
    addToCart, 
    toggleLikeProduct, 
    wishlist,
    startChatWithSeller,
    locations,
    t 
  } = useApp();

  const isLiked = wishlist.includes(product.id);
  const location = locations.find(l => l.id === product.locationId);

  const formatPrice = (price: number) => {
    if (price === 0) return '0đ (Tặng miễn phí)';
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden hover:shadow-md transition-all duration-200 group flex flex-col justify-between">
      
      {/* Product Image Slot */}
      <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
        <img
          src={product.images[0] || '/src/assets/images/product_lhu_textbook_1790738203079.jpg'}
          alt={product.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
          onClick={() => setSelectedProductDetail(product)}
        />

        {/* Quiet Free Giveaway Label (or regular tag) */}
        {product.isFreeGiveaway || product.price === 0 ? (
          <div className="absolute top-2.5 left-2.5 bg-emerald-600 text-white font-bold text-[11px] px-2.5 py-0.5 rounded-md shadow-xs flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>TẶNG 0Đ</span>
          </div>
        ) : (
          <div className="absolute top-2.5 left-2.5 bg-slate-900/75 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded-md">
            {product.condition}
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleLikeProduct(product.id);
          }}
          className={`absolute top-2.5 right-2.5 p-2 rounded-xl backdrop-blur-md transition-all ${
            isLiked 
              ? 'bg-rose-50 text-rose-600 shadow-xs' 
              : 'bg-white/80 hover:bg-white text-slate-600 hover:text-rose-600'
          }`}
          aria-label="Save to wishlist"
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500' : ''}`} />
        </button>

        {/* Quick Action Overlay on hover */}
        <div className="absolute inset-x-2 bottom-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setSelectedProductDetail(product)}
            className="flex-1 py-1.5 px-2 bg-white/95 hover:bg-white text-slate-800 rounded-lg text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-1"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Xem chi tiết</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
            }}
            className="p-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg shadow-sm transition-all flex items-center justify-center"
            title="Thêm vào giỏ hàng"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Card Content & Zero-Pill Typography */}
      <div className="p-3.5 sm:p-4 flex flex-col justify-between flex-1 space-y-2.5">
        
        {/* Title */}
        <div className="cursor-pointer" onClick={() => setSelectedProductDetail(product)}>
          <h3 className="font-semibold text-sm text-slate-900 line-clamp-2 leading-snug group-hover:text-amber-700 transition-colors">
            {product.title}
          </h3>
        </div>

        {/* Price & Original Price */}
        <div className="flex items-baseline gap-2">
          <span className={`text-base font-extrabold font-mono tabular-nums ${product.price === 0 ? 'text-emerald-700' : 'text-slate-900'}`}>
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-xs text-slate-400 line-through font-mono tabular-nums">
              {new Intl.NumberFormat('vi-VN').format(product.originalPrice)}đ
            </span>
          )}
        </div>

        {/* Clean unboxed metadata with separators (NO PILL SANDWICH) */}
        <div className="text-[11px] text-slate-500 flex items-center gap-1.5 truncate">
          <span className="font-medium text-slate-700 flex items-center gap-1 truncate">
            {product.sellerName}
          </span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span className="truncate">{location?.name || 'LHU'}</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span className="shrink-0">{product.createdAt}</span>
        </div>

        {/* Bottom Card Controls */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          <button
            onClick={() => startChatWithSeller(product)}
            className="text-xs text-slate-600 hover:text-amber-700 font-medium flex items-center gap-1 py-1 px-1.5 rounded-md hover:bg-slate-50 transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Thương lượng</span>
          </button>

          <button
            onClick={() => addToCart(product)}
            className="text-xs font-semibold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100/80 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>+ Giỏ</span>
          </button>
        </div>

      </div>

    </div>
  );
};
