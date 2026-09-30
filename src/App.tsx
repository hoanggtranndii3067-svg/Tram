import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { SidebarDrawer } from './components/SidebarDrawer';
import { HeroBanner } from './components/HeroBanner';
import { SmartSearchBar } from './components/SmartSearchBar';
import { TopCategoryGrid } from './components/TopCategoryGrid';
import { LocationFilterBar } from './components/LocationFilterBar';
import { ProductCard } from './components/ProductCard';
import { GiveawaySection } from './components/GiveawaySection';
import { MyOrdersView } from './components/MyOrdersView';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CreateProductModal } from './components/CreateProductModal';
import { UniversalCartDrawer } from './components/UniversalCartDrawer';
import { ChatModal } from './components/ChatModal';
import { AccountManagerModal } from './components/AccountManagerModal';
import { ManageLocationsModal } from './components/ManageLocationsModal';
import { AppQrModal } from './components/AppQrModal';
import { CameraSearchModal } from './components/CameraSearchModal';
import { ReportModal } from './components/ReportModal';
import { 
  Sparkles, Layers, RefreshCw, Heart, 
  MapPin, ShieldCheck, HeartHandshake, Award 
} from 'lucide-react';

const MainContent: React.FC = () => {
  const { 
    filteredProducts, 
    activeNavTab, 
    setActiveNavTab, 
    searchQuery, 
    selectedCategory, 
    setSelectedCategory,
    selectedLocation,
    setSelectedLocation,
    t 
  } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      
      {/* Top Bar Contract (1 Row, 3 Zones) */}
      <Navbar />

      {/* Slide bar left menu */}
      <SidebarDrawer />

      {/* Main Body */}
      <main className="flex-1">
        
        {/* Render Orders Tab View if selected */}
        {activeNavTab === 'orders' ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <MyOrdersView />
          </div>
        ) : (
          <div className="space-y-6 sm:space-y-8 pb-12">
            
            {/* Hero Banner (Only in home mode without active search query) */}
            {activeNavTab === 'home' && !searchQuery && (
              <HeroBanner />
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
              
              {/* Smart Search Bar (Multi-tier with Camera Search, Keyword hints, History tags) */}
              <div className="pt-4 sm:pt-6">
                <SmartSearchBar />
              </div>

              {/* Grid View Window of Top Categories */}
              <TopCategoryGrid />

              {/* Real-world LHU Location Filter Bar with Creator Admin Button */}
              <LocationFilterBar />

              {/* Special Section: "Cho đi là nhận lại (0đ)" */}
              {activeNavTab === 'giveaway' && (
                <GiveawaySection />
              )}

              {/* Wishlist Notice if on wishlist tab */}
              {activeNavTab === 'wishlist' && (
                <div className="p-4 bg-rose-50 border border-rose-200/80 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                    <span className="text-sm font-bold text-rose-900">
                      Danh sách sản phẩm bạn đang lưu yêu thích ({filteredProducts.length} món)
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveNavTab('home')}
                    className="text-xs font-semibold text-rose-700 hover:underline"
                  >
                    Xem tất cả sản phẩm
                  </button>
                </div>
              )}

              {/* Product Catalog Section */}
              <section className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg sm:text-xl font-heading font-extrabold text-slate-900">
                      {searchQuery
                        ? `Kết quả tìm kiếm cho "${searchQuery}"`
                        : activeNavTab === 'giveaway'
                        ? 'Sản phẩm tặng miễn phí'
                        : 'Sàn Đồ Dùng Sinh Viên LHU Mới Nhất'}
                    </h2>
                    <span className="text-xs text-slate-500 font-mono tabular-nums">
                      ({filteredProducts.length} {t.totalItems})
                    </span>
                  </div>

                  {/* Active filters reset */}
                  {(selectedCategory || selectedLocation || searchQuery) && (
                    <button
                      onClick={() => {
                        setSelectedCategory(null);
                        setSelectedLocation(null);
                      }}
                      className="text-xs font-medium text-amber-700 hover:text-amber-800 transition-colors"
                    >
                      Đặt lại bộ lọc
                    </button>
                  )}
                </div>

                {/* Empty State */}
                {filteredProducts.length === 0 ? (
                  <div className="py-16 text-center bg-white rounded-3xl border border-slate-200/80 p-8 space-y-3">
                    <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                      <Layers className="w-8 h-8" />
                    </div>
                    <h3 className="text-base font-bold text-slate-800">
                      Không tìm thấy sản phẩm phù hợp
                    </h3>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      Thử tìm kiếm với các từ khoá gợi ý như: <span className="font-semibold text-slate-700">"tủ áo", "giày", "sách", "quạt", "nồi", "máy tính"</span> hoặc chọn khu vực LHU khác.
                    </p>
                  </div>
                ) : (
                  /* Responsive Product Grid */
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                    {filteredProducts.map((prod) => (
                      <ProductCard key={prod.id} product={prod} />
                    ))}
                  </div>
                )}
              </section>

              {/* Secondary Community Proof Module (Adjacency rule) */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Xác thực 100% Sinh Viên LHU</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Đăng nhập bằng MSSV và email trường giúp loại bỏ người ngoài, ngăn ngừa lừa đảo, mang lại sự yên tâm tuyệt đối cho người dùng.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                    <HeartHandshake className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Tiết Kiệm & Chống Lãng Phí</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Hỗ trợ tân sinh viên tìm mua giáo trình, quạt mini, bàn học giá rẻ. Kéo dài vòng đời vật dụng khi chuyển phòng trọ.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                    <Award className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Huy Hiệu Tấm Lòng Vàng</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Tặng sách và tài liệu ôn tập được vinh danh trên hồ sơ sinh viên với điểm sẻ chia và sự chứng nhận của Đoàn Trường.
                  </p>
                </div>
              </div>

            </div>

          </div>
        )}

      </main>

      {/* Clean University Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 font-heading font-extrabold text-sm text-slate-900">
                <span>UNIMART LHU</span>
                <span className="text-slate-300">·</span>
                <span className="font-normal text-slate-600">Trường Đại học Lạc Hồng (Biên Hòa, Đồng Nai)</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Dự án thiết kế & phát triển: <strong className="text-slate-700">Hoàng Thị Phương Trâm</strong> (Nhà sáng tạo và Phát triển)
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
              <span>Cơ sở 1 - Huỳnh Văn Nghệ</span>
              <span className="text-slate-300">·</span>
              <span>KTX Dân Chủ</span>
              <span className="text-slate-300">·</span>
              <span>Đoàn - Hội Sinh Viên LHU</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
            <p>© 2026 UNIMART LHU. Nền tảng trao đổi đồ dùng sinh viên Đại học Lạc Hồng.</p>
            <p>Màu sắc chủ đạo: Vàng năng động · Xanh lá tái chế sẻ chia · Trắng sạch sẽ.</p>
          </div>
        </div>
      </footer>

      {/* Global Interactive Modals */}
      <ProductDetailModal />
      <CreateProductModal />
      <UniversalCartDrawer />
      <ChatModal />
      <AccountManagerModal />
      <ManageLocationsModal />
      <AppQrModal />
      <CameraSearchModal />
      <ReportModal />

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
