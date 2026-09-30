import React from 'react';
import { Sparkles, Camera, PlusCircle, ArrowRight, ShieldCheck, HeartHandshake, Leaf } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const HeroBanner: React.FC = () => {
  const { 
    setIsCreateProductOpen, 
    setEditingProduct, 
    setIsCameraSearchOpen, 
    setActiveNavTab, 
    setSelectedCategory,
    t 
  } = useApp();

  const handlePost = () => {
    setEditingProduct(null);
    setIsCreateProductOpen(true);
  };

  const handleGiveaway = () => {
    setActiveNavTab('giveaway');
    setSelectedCategory('free_giveaway');
  };

  return (
    <section className="relative overflow-hidden bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Value Proposition & Intent Actions */}
          <div className="lg:col-span-7 space-y-5 text-left">
            
            {/* Unboxed natural editorial badge */}
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 tracking-wide uppercase">
              <span className="text-emerald-700">Trường Đại học Lạc Hồng (LHU)</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="text-slate-600">Sáng tạo bởi Hoàng Thị Phương Trâm</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-slate-900 tracking-tight leading-[1.15] text-balance">
              Sàn Trao Đổi Đồ Dùng <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-500 to-emerald-600">
                Sinh Viên ĐH Lạc Hồng
              </span>
            </h1>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl">
              Nền tảng thanh lý, trao đổi giáo trình, quạt mini, bàn học, tủ phòng trọ và tặng đồ miễn phí 
              dành riêng cho cộng đồng sinh viên, giảng viên và Đoàn Thanh niên LHU. 
              Tiết kiệm tối đa chi phí – Kéo dài vòng đời vật dụng – Chống lãng phí.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={handlePost}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-amber-500 hover:bg-amber-600 active:scale-98 rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-2 whitespace-nowrap"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{t.postProduct} ngay</span>
              </button>

              <button
                onClick={handleGiveaway}
                className="px-5 py-2.5 text-sm font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100/80 active:scale-98 border border-emerald-200/80 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap"
              >
                <HeartHandshake className="w-4 h-4 text-emerald-600" />
                <span>Khu "Cho đi là nhận lại" (0đ)</span>
              </button>

              <button
                onClick={() => setIsCameraSearchOpen(true)}
                className="px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 active:scale-98 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap"
              >
                <Camera className="w-4 h-4 text-slate-600" />
                <span>Quét tìm bằng ảnh</span>
              </button>
            </div>

            {/* Adjacency Proof Elements (Quiet unboxed trust points) */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-500">
              <div className="flex items-center gap-1.5 text-slate-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% Xác thực MSSV @lhu.edu.vn</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-700">
                <Leaf className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Bảo vệ môi trường & Giảm rác thải trọ</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-700">
                <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Bảo chứng bởi Đoàn Trường LHU</span>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual Asset */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200/80 bg-slate-100 aspect-16/10">
              <img 
                src="/src/assets/images/hero_unimart_banner_1790738189688.jpg" 
                alt="Chợ sinh viên Đại học Lạc Hồng UNIMART" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
              
              {/* Subtle glass overlay card inside hero */}
              <div className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur-md rounded-xl p-3 border border-white/80 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900">Chiến dịch tân sinh viên LHU</p>
                  <p className="text-[11px] text-slate-600">Hàng trăm giáo trình & quạt phòng trọ giá 0đ - 100k</p>
                </div>
                <button 
                  onClick={handleGiveaway}
                  className="px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors shrink-0 flex items-center gap-1"
                >
                  <span>Xem</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
