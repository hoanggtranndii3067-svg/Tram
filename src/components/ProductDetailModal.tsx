import React, { useState } from 'react';
import { 
  X, Heart, ShoppingBag, MessageSquare, ShieldCheck, 
  MapPin, UserCheck, Star, Award, Sparkles, Trash2, 
  Edit3, AlertTriangle, Share2, Check, Video 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';

export const ProductDetailModal: React.FC = () => {
  const { 
    selectedProductDetail, 
    setSelectedProductDetail, 
    addToCart, 
    startChatWithSeller,
    deleteProduct,
    setEditingProduct,
    setIsCreateProductOpen,
    currentUser,
    wishlist,
    toggleLikeProduct,
    locations,
    users,
    reviews,
    addReview,
    setReportingTarget,
    setIsReportOpen,
    setIsCartOpen,
    t 
  } = useApp();

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!selectedProductDetail) return null;

  const product = selectedProductDetail;
  const isLiked = wishlist.includes(product.id);
  const location = locations.find(l => l.id === product.locationId);
  const seller = users.find(u => u.id === product.sellerId) || {
    name: product.sellerName,
    studentId: product.sellerStudentId,
    avatar: product.sellerAvatar,
    faculty: 'Sinh viên ĐH Lạc Hồng',
    dormLocation: location?.name || 'Khuôn viên LHU',
    rating: 5.0,
    reviewCount: 12,
    sharingPoints: 40,
    goldHeartBadge: false,
    verified: true,
  };

  const isOwner = currentUser.id === product.sellerId || currentUser.role === 'admin' || currentUser.role === 'youth_union';
  const productReviews = reviews.filter(r => r.productId === product.id);

  const handleEdit = () => {
    setEditingProduct(product);
    setSelectedProductDetail(null);
    setIsCreateProductOpen(true);
  };

  const handleDelete = () => {
    if (window.confirm(t.confirmDelete)) {
      deleteProduct(product.id);
      setSelectedProductDetail(null);
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleAddReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewText.trim()) return;
    addReview({
      productId: product.id,
      targetUserId: product.sellerId,
      authorName: currentUser.name,
      authorStudentId: currentUser.studentId,
      rating: newReviewRating,
      comment: newReviewText.trim(),
    });
    setNewReviewText('');
  };

  const handleBuyNow = () => {
    addToCart(product, 1);
    setSelectedProductDetail(null);
    setIsCartOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6">
      <div className="relative bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Modal Top Bar */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2 text-xs text-slate-500 truncate">
            <span className="font-semibold text-slate-800">UNIMART LHU</span>
            <span aria-hidden="true">·</span>
            <span className="truncate">{product.title}</span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleShare}
              className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-200 transition-colors"
              title="Sao chép liên kết"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setSelectedProductDetail(null)}
              className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content (Split screen on desktop) */}
        <div className="overflow-y-auto p-5 sm:p-6 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">
            
            {/* Left Column: Gallery & Description */}
            <div className="md:col-span-6 space-y-4">
              
              {/* Main Image */}
              <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80">
                <img
                  src={product.images[activeImageIdx] || product.images[0]}
                  alt={product.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />

                {product.isFreeGiveaway && (
                  <div className="absolute top-3 left-3 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-lg shadow-sm flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>CHO ĐI LÀ NHẬN LẠI (0Đ)</span>
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIdx(idx)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                        activeImageIdx === idx ? 'border-amber-500 scale-102' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Video preview indicator if provided */}
              {product.videoUrl && (
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-between text-xs text-blue-900">
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-blue-600" />
                    <span>Bài đăng có đính kèm video quay thực tế vật dụng</span>
                  </div>
                  <a href={product.videoUrl} target="_blank" rel="noreferrer" className="underline font-semibold">
                    Xem clip
                  </a>
                </div>
              )}

              {/* Product Detailed Description */}
              <div className="pt-2 space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Mô tả chi tiết từ người bán
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-xl border border-slate-100">
                  {product.description}
                </p>
              </div>

              {/* Smart Keyword Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="space-y-1.5">
                  <h4 className="text-xs font-semibold text-slate-500">Từ khoá nhận diện nhanh:</h4>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {product.tags.map(tag => (
                      <span key={tag} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Reputation & Reviews Section */}
              <div className="pt-4 border-t border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                    <span>Đánh giá uy tín sinh viên ({productReviews.length})</span>
                  </h4>
                </div>

                <div className="space-y-2.5">
                  {productReviews.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">Chưa có đánh giá nào cho sản phẩm này. Hãy là người đầu tiên giao dịch và để lại nhận xét!</p>
                  ) : (
                    productReviews.map(rev => (
                      <div key={rev.id} className="p-3 bg-slate-50 rounded-xl text-xs space-y-1 border border-slate-100">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-800">{rev.authorName} ({rev.authorStudentId})</span>
                          <div className="flex text-amber-500">
                            {Array.from({ length: rev.rating }).map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-amber-400" />
                            ))}
                          </div>
                        </div>
                        <p className="text-slate-600">{rev.comment}</p>
                        <span className="text-[10px] text-slate-400">{rev.createdAt}</span>
                      </div>
                    ))
                  )}
                </div>

                {/* Add Review Form */}
                <form onSubmit={handleAddReviewSubmit} className="pt-2 flex gap-2">
                  <input
                    type="text"
                    value={newReviewText}
                    onChange={(e) => setNewReviewText(e.target.value)}
                    placeholder="Viết nhận xét uy tín cho người bán LHU..."
                    className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500"
                  />
                  <select
                    value={newReviewRating}
                    onChange={(e) => setNewReviewRating(Number(e.target.value))}
                    className="text-xs px-2 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value={5}>5 ★</option>
                    <option value={4}>4 ★</option>
                    <option value={3}>3 ★</option>
                  </select>
                  <button
                    type="submit"
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-xl"
                  >
                    Gửi
                  </button>
                </form>
              </div>

            </div>

            {/* Right Column: Contiguous Purchase Module */}
            <div className="md:col-span-6 space-y-5">
              
              {/* Header Title & Pricing */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>Tình trạng: <strong className="text-slate-800 font-semibold">{product.condition}</strong></span>
                  <span aria-hidden="true">·</span>
                  <span>Đăng: {product.createdAt}</span>
                </div>

                <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-slate-900 leading-snug">
                  {product.title}
                </h2>

                <div className="flex items-baseline gap-3 pt-1">
                  <span className={`text-2xl sm:text-3xl font-extrabold font-mono tabular-nums ${product.price === 0 ? 'text-emerald-700' : 'text-slate-900'}`}>
                    {product.price === 0 ? '0đ (Tặng miễn phí)' : new Intl.NumberFormat('vi-VN').format(product.price) + 'đ'}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-sm text-slate-400 line-through font-mono tabular-nums">
                      {new Intl.NumberFormat('vi-VN').format(product.originalPrice)}đ
                    </span>
                  )}
                </div>
              </div>

              {/* Location Card */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5 text-xs">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-800">{location?.name || 'Khu vực Trường ĐH Lạc Hồng'}</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">{location?.addressNote || 'Biên Hòa, Đồng Nai'}</p>
                </div>
              </div>

              {/* Verified Seller Info Card */}
              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                    Hồ sơ Người bán LHU
                  </span>
                  {seller.goldHeartBadge && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                      <Award className="w-3.5 h-3.5 fill-amber-500 text-amber-700" />
                      <span>Tấm Lòng Vàng</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <img
                    src={seller.avatar}
                    alt={seller.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-xs"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-slate-900 truncate">{seller.name}</h4>
                      {seller.verified && (
                        <span title="Đã xác thực SV LHU">
                          <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 font-mono">MSSV: {seller.studentId}</p>
                    <p className="text-[11px] text-slate-500 truncate">{seller.faculty}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between text-xs text-slate-600">
                  <span>Uy tín: <strong className="text-amber-700">{seller.rating} ★</strong></span>
                  <span className="text-emerald-700 font-medium">{seller.sharingPoints} Điểm sẻ chia</span>
                </div>
              </div>

              {/* Action Buttons: Contiguous buy module */}
              <div className="space-y-2.5 pt-2">
                <button
                  onClick={handleBuyNow}
                  className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-600 active:scale-98 text-slate-950 font-bold text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{product.price === 0 ? 'Nhận quà tặng 0đ ngay' : 'Mua ngay / Hẹn nhận tại LHU'}</span>
                </button>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => addToCart(product, 1)}
                    className="py-2.5 px-3 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
                  >
                    <ShoppingBag className="w-4 h-4 text-amber-600" />
                    <span>{t.addToCart}</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedProductDetail(null);
                      startChatWithSeller(product);
                    }}
                    className="py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
                  >
                    <MessageSquare className="w-4 h-4 text-emerald-600" />
                    <span>{t.contactSeller}</span>
                  </button>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => toggleLikeProduct(product.id)}
                    className="text-xs text-slate-500 hover:text-rose-600 flex items-center gap-1 transition-colors"
                  >
                    <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                    <span>{isLiked ? 'Đã yêu thích' : 'Lưu tin vào yêu thích'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setReportingTarget({
                        type: 'product',
                        id: product.id,
                        name: product.title,
                      });
                      setIsReportOpen(true);
                    }}
                    className="text-xs text-slate-400 hover:text-red-600 flex items-center gap-1 transition-colors"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Báo cáo vi phạm</span>
                  </button>
                </div>
              </div>

              {/* Owner / Creator Controls */}
              {isOwner && (
                <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 space-y-2">
                  <p className="text-xs font-semibold text-slate-700">Quyền quản trị bài đăng của bạn:</p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleEdit}
                      className="flex-1 py-1.5 px-3 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-xs font-semibold rounded-lg flex items-center justify-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>{t.editProduct}</span>
                    </button>
                    <button
                      onClick={handleDelete}
                      className="flex-1 py-1.5 px-3 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs font-semibold rounded-lg flex items-center justify-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{t.deleteProduct}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* LHU Safety Notice */}
              <div className="p-3 rounded-xl bg-slate-50 text-[11px] text-slate-500 leading-normal flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  Khuyến khích sinh viên gặp trực tiếp tại sảnh CS1, CS2, KTX Dân Chủ hoặc các quán nước quanh trường để kiểm tra đồ trước khi thanh toán.
                </span>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
