import React from 'react';
import { Sparkles, HeartHandshake, Award, PlusCircle, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProductCard } from './ProductCard';

export const GiveawaySection: React.FC = () => {
  const { 
    products, 
    setIsCreateProductOpen, 
    setEditingProduct, 
    users,
    currentUser,
    t 
  } = useApp();

  const freeItems = products.filter(p => p.isFreeGiveaway || p.price === 0);
  const goldenHeartStudents = users.filter(u => u.goldHeartBadge || u.sharingPoints >= 50);

  const handlePostGiveaway = () => {
    setEditingProduct(null);
    setIsCreateProductOpen(true);
  };

  return (
    <section className="bg-gradient-to-b from-emerald-50/60 to-white rounded-3xl border border-emerald-200/80 p-5 sm:p-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
            <HeartHandshake className="w-4 h-4 text-emerald-600" />
            <span>Chương trình cộng đồng LHU</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-slate-900">
            "Cho Đi Là Nhận Lại" – Sách & Vật Dụng 0đ
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
            Nơi các bạn sinh viên và giảng viên Trường Đại học Lạc Hồng tặng lại miễn phí giáo trình chuyên ngành, tài liệu ôn thi TOEIC, quạt phòng trọ cho các bạn tân sinh viên hoặc bạn có hoàn cảnh khó khăn.
          </p>
        </div>

        <button
          onClick={handlePostGiveaway}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center gap-2 self-start md:self-auto shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Tặng đồ miễn phí (0đ)</span>
        </button>
      </div>

      {/* Hall of Fame: "Huy hiệu Tấm Lòng Vàng" Sinh Viên LHU */}
      <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-4 border border-emerald-100 shadow-2xs space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
            <Award className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span>Vinh Danh "Huy Hiệu Tấm Lòng Vàng" & Điểm Sẻ Chia LHU</span>
          </div>
          <span className="text-[11px] text-slate-400">Được Đoàn Trường bảo chứng</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {goldenHeartStudents.slice(0, 4).map((st) => (
            <div
              key={st.id}
              className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2.5"
            >
              <img
                src={st.avatar}
                alt={st.name}
                referrerPolicy="no-referrer"
                className="w-9 h-9 rounded-full object-cover border border-amber-300"
              />
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">{st.name}</p>
                <p className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>{st.sharingPoints} Điểm sẻ chia</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">
            Danh sách vật dụng tặng miễn phí ({freeItems.length} món)
          </h3>
        </div>

        {freeItems.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
            <p className="text-xs text-slate-500">Chưa có bài tặng nào đang hoạt động. Hãy là người đầu tiên trao tặng!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {freeItems.map(prod => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}
      </div>

    </section>
  );
};
