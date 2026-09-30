import React from 'react';
import { 
  ShoppingBag, Search, PlusCircle, Menu, QrCode, 
  Globe, Heart, PackageCheck, Sparkles 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Language } from '../types';

export const Navbar: React.FC = () => {
  const { 
    currentUser, 
    cart, 
    wishlist,
    language, 
    setLanguage, 
    setIsSidebarOpen, 
    setIsCartOpen, 
    setIsCreateProductOpen, 
    setEditingProduct,
    setIsAppQrOpen,
    activeNavTab,
    setActiveNavTab,
    setSelectedCategory,
    setSearchQuery,
    t 
  } = useApp();

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleNavClick = (tab: 'home' | 'giveaway' | 'orders' | 'wishlist') => {
    setActiveNavTab(tab);
    if (tab === 'giveaway') {
      setSelectedCategory('free_giveaway');
    } else if (tab === 'home') {
      setSelectedCategory(null);
      setSearchQuery('');
    }
  };

  const handleOpenPostModal = () => {
    setEditingProduct(null);
    setIsCreateProductOpen(true);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Zone 1: Brand title, single line */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors focus-visible:ring-2 focus-visible:ring-amber-500"
            aria-label="Open sidebar menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2 group text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-emerald-600 flex items-center justify-center text-white font-bold text-base shadow-sm group-hover:scale-105 transition-transform">
              U
            </div>
            <div>
              <span className="font-heading font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-amber-600 transition-colors">
                UNIMART<span className="text-emerald-600">.LHU</span>
              </span>
              <span className="hidden sm:inline-block text-[11px] text-slate-500 pl-1.5 font-medium border-l border-slate-200 ml-1.5">
                ĐH Lạc Hồng
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Clean 4-6 nav links, 1-2 word labels */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <button
            onClick={() => handleNavClick('home')}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeNavTab === 'home'
                ? 'text-amber-700 bg-amber-50/80 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            Trang chủ
          </button>

          <button
            onClick={() => handleNavClick('giveaway')}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeNavTab === 'giveaway'
                ? 'text-emerald-700 bg-emerald-50/80 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            Cho đi 0đ
          </button>

          <button
            onClick={() => handleNavClick('orders')}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeNavTab === 'orders'
                ? 'text-amber-700 bg-amber-50/80 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            <PackageCheck className="w-4 h-4 text-amber-600" />
            Đơn của tôi
          </button>

          <button
            onClick={() => handleNavClick('wishlist')}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeNavTab === 'wishlist'
                ? 'text-rose-700 bg-rose-50/80 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            <Heart className="w-4 h-4 text-rose-500" />
            Yêu thích ({wishlist.length})
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions & utility controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* App QR Share Button */}
          <button
            onClick={() => setIsAppQrOpen(true)}
            title="Mã QR Unimart LHU"
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors hidden sm:flex items-center gap-1 text-xs font-medium"
          >
            <QrCode className="w-4 h-4 text-amber-600" />
            <span className="hidden xl:inline">QR Sàn</span>
          </button>

          {/* Multilingual Selector */}
          <div className="relative group">
            <button 
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1 text-xs font-medium"
              title="Change Language"
            >
              <Globe className="w-4 h-4 text-slate-500" />
              <span className="uppercase font-mono text-[11px] font-semibold">{language}</span>
            </button>
            <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg p-1.5 hidden group-hover:block min-w-32 z-50">
              <button 
                onClick={() => setLanguage('vi')}
                className={`w-full text-left px-2.5 py-1.5 text-xs rounded-md flex items-center justify-between ${language === 'vi' ? 'bg-amber-50 text-amber-800 font-semibold' : 'text-slate-700 hover:bg-slate-50'}`}
              >
                <span>🇻🇳 Tiếng Việt</span>
              </button>
              <button 
                onClick={() => setLanguage('en')}
                className={`w-full text-left px-2.5 py-1.5 text-xs rounded-md flex items-center justify-between ${language === 'en' ? 'bg-amber-50 text-amber-800 font-semibold' : 'text-slate-700 hover:bg-slate-50'}`}
              >
                <span>🇬🇧 English</span>
              </button>
              <button 
                onClick={() => setLanguage('zh')}
                className={`w-full text-left px-2.5 py-1.5 text-xs rounded-md flex items-center justify-between ${language === 'zh' ? 'bg-amber-50 text-amber-800 font-semibold' : 'text-slate-700 hover:bg-slate-50'}`}
              >
                <span>🇨🇳 中文</span>
              </button>
              <button 
                onClick={() => setLanguage('ko')}
                className={`w-full text-left px-2.5 py-1.5 text-xs rounded-md flex items-center justify-between ${language === 'ko' ? 'bg-amber-50 text-amber-800 font-semibold' : 'text-slate-700 hover:bg-slate-50'}`}
              >
                <span>🇰🇷 한국어</span>
              </button>
            </div>
          </div>

          {/* Cart Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="View Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalCartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-900 font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center tabular-nums shadow-sm border-2 border-white">
                {totalCartCount}
              </span>
            )}
          </button>

          {/* Post Product Button */}
          <button
            onClick={handleOpenPostModal}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 rounded-xl shadow-sm hover:shadow transition-all whitespace-nowrap active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t.postProduct}</span>
          </button>
        </div>

      </div>
    </header>
  );
};
