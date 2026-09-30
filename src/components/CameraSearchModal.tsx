import React, { useState } from 'react';
import { X, Camera, Upload, Sparkles, Check, ArrowRight, Eye } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CameraSearchModal: React.FC = () => {
  const { 
    isCameraSearchOpen, 
    setIsCameraSearchOpen, 
    setSearchQuery, 
    addSearchHistory, 
    setSelectedCategory 
  } = useApp();

  const [analyzing, setAnalyzing] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [detectedItem, setDetectedItem] = useState<{
    label: string;
    keyword: string;
    confidence: string;
    category: string;
  } | null>(null);

  if (!isCameraSearchOpen) return null;

  const sampleScanScenarios = [
    {
      name: 'Quạt mini phòng trọ',
      image: '/src/assets/images/product_dorm_essentials_1790738216332.jpg',
      label: 'Quạt mini để bàn Sunhouse & Ấm đun siêu tốc',
      keyword: 'quạt',
      confidence: '98.5%',
      category: 'dorm_essentials',
    },
    {
      name: 'Giáo trình & Máy tính',
      image: '/src/assets/images/product_lhu_textbook_1790738203079.jpg',
      label: 'Giáo trình Giải tích LHU & Máy tính Casio',
      keyword: 'sách',
      confidence: '99.1%',
      category: 'books_study',
    },
    {
      name: 'Giày thể thao & Đồng phục',
      image: '/src/assets/images/product_campus_apparel_1790738226742.jpg',
      label: 'Giày Sneaker thể thao & Đồng phục LHU',
      keyword: 'giày',
      confidence: '96.8%',
      category: 'fashion_apparel',
    },
    {
      name: 'Tủ nhựa sinh viên',
      image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&auto=format&fit=crop&q=80',
      label: 'Tủ quần áo nhựa 4 tầng phòng trọ',
      keyword: 'tủ áo',
      confidence: '97.2%',
      category: 'dorm_essentials',
    },
  ];

  const handleScanSample = (scenario: typeof sampleScanScenarios[0]) => {
    setSelectedPhoto(scenario.image);
    setAnalyzing(true);
    setDetectedItem(null);

    setTimeout(() => {
      setAnalyzing(false);
      setDetectedItem({
        label: scenario.label,
        keyword: scenario.keyword,
        confidence: scenario.confidence,
        category: scenario.category,
      });
    }, 1200);
  };

  const handleApplySearchResult = () => {
    if (detectedItem) {
      setSearchQuery(detectedItem.keyword);
      addSearchHistory(detectedItem.keyword);
      setSelectedCategory(detectedItem.category);
      setIsCameraSearchOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-amber-600" />
            <h3 className="font-heading font-bold text-base text-slate-900">
              Tìm Kiếm Sản Phẩm Bằng Hình Ảnh
            </h3>
          </div>
          <button
            onClick={() => setIsCameraSearchOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <p className="text-xs text-slate-600 leading-relaxed">
            Chụp hoặc tải ảnh vật dụng phòng trọ / giáo trình cần tìm. Hệ thống AI Camera của Unimart sẽ nhận diện và đưa ra danh sách sản phẩm tương ứng trên sàn LHU.
          </p>

          {/* Quick Scenario Picker */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-800">
              Chọn ảnh chụp thử nghiệm:
            </span>
            <div className="grid grid-cols-2 gap-2.5">
              {sampleScanScenarios.map((sc, idx) => (
                <button
                  key={idx}
                  onClick={() => handleScanSample(sc)}
                  className={`p-2 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                    selectedPhoto === sc.image
                      ? 'border-amber-500 bg-amber-50 ring-1 ring-amber-400'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <img
                    src={sc.image}
                    alt={sc.name}
                    className="w-12 h-12 rounded-lg object-cover bg-slate-100 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">{sc.name}</p>
                    <p className="text-[10px] text-slate-400">Bấm để quét AI</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Scan Preview & AI Analysis */}
          {analyzing && (
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-2 animate-pulse">
              <Sparkles className="w-6 h-6 text-amber-500 mx-auto animate-spin" />
              <p className="text-xs font-semibold text-slate-700">Đang phân tích hình ảnh và nhận diện mẫu...</p>
              <p className="text-[11px] text-slate-400">Trích xuất đặc trưng vật dụng sinh viên LHU</p>
            </div>
          )}

          {detectedItem && !analyzing && (
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200/80 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Nhận diện thành công ({detectedItem.confidence})</span>
                </span>
                <span className="font-mono text-emerald-800 text-[11px]">Từ khoá: "{detectedItem.keyword}"</span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-emerald-100 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold text-slate-900">{detectedItem.label}</p>
                  <p className="text-[11px] text-slate-500">Khớp với sản phẩm đang có tại khuôn viên LHU</p>
                </div>
                <button
                  onClick={handleApplySearchResult}
                  className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-2xs flex items-center gap-1 shrink-0"
                >
                  <span>Xem sản phẩm</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
