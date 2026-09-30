import React, { useState, useEffect } from 'react';
import { 
  X, Camera, Plus, Trash2, Video, Sparkles, 
  MapPin, Tag, Check, Image as ImageIcon 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProductCondition } from '../types';

export const CreateProductModal: React.FC = () => {
  const { 
    isCreateProductOpen, 
    setIsCreateProductOpen, 
    editingProduct, 
    setEditingProduct,
    addProduct, 
    updateProduct, 
    categories, 
    locations,
    t 
  } = useApp();

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState<number | string>(100000);
  const [isFree, setIsFree] = useState(false);
  const [originalPrice, setOriginalPrice] = useState<number | string>(250000);
  const [condition, setCondition] = useState<ProductCondition>('90% tốt');
  const [categoryId, setCategoryId] = useState('books_study');
  const [locationId, setLocationId] = useState('cs1');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  // Sample quick gallery images for students to choose easily
  const sampleImages = [
    '/src/assets/images/product_lhu_textbook_1790738203079.jpg',
    '/src/assets/images/product_dorm_essentials_1790738216332.jpg',
    '/src/assets/images/product_campus_apparel_1790738226742.jpg',
    'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1544233726-9f1d2b27be8b?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80',
  ];

  useEffect(() => {
    if (editingProduct) {
      setTitle(editingProduct.title);
      setPrice(editingProduct.price);
      setIsFree(editingProduct.isFreeGiveaway || editingProduct.price === 0);
      setOriginalPrice(editingProduct.originalPrice || '');
      setCondition(editingProduct.condition);
      setCategoryId(editingProduct.categoryId);
      setLocationId(editingProduct.locationId);
      setDescription(editingProduct.description);
      setImages(editingProduct.images || []);
      setVideoUrl(editingProduct.videoUrl || '');
      setTagsInput(editingProduct.tags?.join(', ') || '');
    } else {
      // Default new product
      setTitle('');
      setPrice(80000);
      setIsFree(false);
      setOriginalPrice(200000);
      setCondition('90% tốt');
      setCategoryId('dorm_essentials');
      setLocationId(locations[0]?.id || 'cs1');
      setDescription('');
      setImages([sampleImages[1]]);
      setVideoUrl('');
      setTagsInput('quạt, phòng trọ, đồ dùng');
    }
  }, [editingProduct, locations]);

  if (!isCreateProductOpen) return null;

  const handleToggleFree = (checked: boolean) => {
    setIsFree(checked);
    if (checked) {
      setPrice(0);
      setCategoryId('free_giveaway');
      setCondition('Tặng miễn phí 0đ');
      if (!tagsInput.includes('tặng')) {
        setTagsInput(prev => prev ? `${prev}, tặng 0đ, cho đi, chia sẻ` : 'tặng 0đ, cho đi, chia sẻ');
      }
    } else {
      setPrice(50000);
      setCategoryId('books_study');
      setCondition('90% tốt');
    }
  };

  const handleAddSampleImage = (url: string) => {
    if (!images.includes(url)) {
      setImages(prev => [...prev, url]);
    }
  };

  const handleSimulateCameraCapture = () => {
    // Simulate capturing a live camera snapshot on mobile / web
    const randomSample = sampleImages[Math.floor(Math.random() * sampleImages.length)];
    setImages(prev => [randomSample, ...prev]);
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleAddQuickTag = (tag: string) => {
    const current = tagsInput ? tagsInput.split(',').map(s => s.trim()) : [];
    if (!current.includes(tag)) {
      setTagsInput([...current, tag].join(', '));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Vui lòng nhập tên sản phẩm.');
      return;
    }

    const parsedTags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const numericPrice = isFree ? 0 : Number(price) || 0;
    const numericOriginalPrice = Number(originalPrice) || undefined;

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        title: title.trim(),
        price: numericPrice,
        originalPrice: numericOriginalPrice,
        condition,
        categoryId,
        locationId,
        description: description.trim(),
        images: images.length > 0 ? images : [sampleImages[0]],
        videoUrl: videoUrl.trim() || undefined,
        tags: parsedTags,
        isFreeGiveaway: isFree,
      });
    } else {
      addProduct({
        title: title.trim(),
        price: numericPrice,
        originalPrice: numericOriginalPrice,
        condition,
        categoryId,
        locationId,
        description: description.trim(),
        images: images.length > 0 ? images : [sampleImages[0]],
        videoUrl: videoUrl.trim() || undefined,
        tags: parsedTags,
        isFreeGiveaway: isFree,
      });
    }

    setIsCreateProductOpen(false);
    setEditingProduct(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="font-heading font-bold text-base text-slate-900">
              {editingProduct ? t.editProduct : t.postProduct}
            </h3>
            <p className="text-xs text-slate-500">
              Sàn Trao Đổi Đồ Dùng Sinh Viên ĐH Lạc Hồng (LHU)
            </p>
          </div>
          <button
            onClick={() => {
              setIsCreateProductOpen(false);
              setEditingProduct(null);
            }}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {/* Free Giveaway Switch ("Cho đi là nhận lại") */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-50 to-amber-50 border border-emerald-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <div>
                <p className="text-xs font-bold text-emerald-950">Chương trình "Cho đi là nhận lại" (0đ)</p>
                <p className="text-[11px] text-emerald-700">Tặng miễn phí cho sinh viên khóa dưới & nhận Huy hiệu Tấm Lòng Vàng</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isFree}
                onChange={(e) => handleToggleFree(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          {/* Product Title */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Tên món đồ / Tiêu đề bài đăng *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Quạt mini để bàn Sunhouse, Giáo trình Giải tích LHU, Bàn gấp gỗ..."
              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Pricing & Condition */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Giá thanh lý (VNĐ) *
              </label>
              <input
                type="number"
                disabled={isFree}
                required
                value={isFree ? 0 : price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="VD: 50000"
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 disabled:bg-slate-100 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Tình trạng vật dụng
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as ProductCondition)}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 bg-white"
              >
                <option value="99% như mới">99% như mới</option>
                <option value="90% tốt">90% tốt (Hoạt động hoàn hảo)</option>
                <option value="Đã qua sử dụng">Đã qua sử dụng</option>
                <option value="Tặng miễn phí 0đ">Tặng miễn phí 0đ</option>
              </select>
            </div>
          </div>

          {/* Category & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Danh mục nhóm hàng
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 bg-white"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Địa điểm gặp nhận đồ (Quanh LHU)
              </label>
              <select
                value={locationId}
                onChange={(e) => setLocationId(e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 bg-white"
              >
                {locations.map(loc => (
                  <option key={loc.id} value={loc.id}>{loc.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Smart Keywords Tags */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-amber-600" />
                <span>Thẻ từ khoá thông minh (Phân cách bằng dấu phẩy)</span>
              </label>
              <span className="text-[10px] text-slate-400">Gõ đúng từ sẽ ra ngay hàng</span>
            </div>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="VD: tủ áo, quạt, giày, sách, nồi, máy tính, lhu"
              className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500"
            />
            {/* Quick Keyword Suggestions */}
            <div className="flex items-center gap-1.5 flex-wrap mt-1.5 text-xs">
              <span className="text-slate-400 text-[11px]">Gợi ý gắn thẻ:</span>
              {['tủ áo', 'giày', 'sách', 'quạt', 'nồi', 'máy tính', 'lhu'].map(kw => (
                <button
                  type="button"
                  key={kw}
                  onClick={() => handleAddQuickTag(kw)}
                  className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-amber-100 text-slate-600 hover:text-amber-800 text-[11px]"
                >
                  +{kw}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Mô tả chi tiết vật dụng
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả công năng, lý do pass lại, thời gian rảnh để hẹn tại trường hoặc phòng trọ..."
              className="w-full text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Photos & Camera Capture */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                <Camera className="w-3.5 h-3.5 text-amber-600" />
                <span>Hình ảnh sản phẩm ({images.length})</span>
              </label>
              <button
                type="button"
                onClick={handleSimulateCameraCapture}
                className="text-xs text-amber-700 hover:text-amber-800 font-semibold flex items-center gap-1"
              >
                <Camera className="w-3 h-3" />
                <span>Chụp ảnh trực tiếp</span>
              </button>
            </div>

            {/* Image Preview Row */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200 shrink-0 group">
                  <img src={img} alt="preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-md shadow-xs opacity-80 hover:opacity-100 transition-opacity"
                    title="Xoá ảnh này"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={handleSimulateCameraCapture}
                className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-200 hover:border-amber-500 flex flex-col items-center justify-center text-slate-400 hover:text-amber-600 shrink-0 transition-colors"
              >
                <Plus className="w-5 h-5 mb-0.5" />
                <span className="text-[10px] font-medium">Thêm ảnh</span>
              </button>
            </div>

            {/* Quick Sample Selector */}
            <div className="mt-2 text-xs text-slate-500">
              <span className="text-[11px]">Hoặc chọn ảnh mẫu nhanh:</span>
              <div className="flex gap-1.5 mt-1 overflow-x-auto pb-1">
                {sampleImages.map((sImg, sIdx) => (
                  <button
                    key={sIdx}
                    type="button"
                    onClick={() => handleAddSampleImage(sImg)}
                    className="w-12 h-12 rounded-lg overflow-hidden border border-slate-200 hover:border-amber-400 shrink-0 opacity-70 hover:opacity-100"
                  >
                    <img src={sImg} alt="sample" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Video URL Link */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1">
              <Video className="w-3.5 h-3.5 text-blue-600" />
              <span>Link video quay thực tế (Tùy chọn)</span>
            </label>
            <input
              type="text"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="VD: https://youtube.com/watch?v=... hoặc link Drive"
              className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => {
                setIsCreateProductOpen(false);
                setEditingProduct(null);
              }}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-all active:scale-98"
            >
              {editingProduct ? t.saveChanges : 'Đăng bài lên Unimart LHU'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
