import React from 'react';
import { 
  BookOpen, Home, Shirt, Sparkles, Cpu, 
  HeartHandshake, ChevronRight, Layers 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const TopCategoryGrid: React.FC = () => {
  const { 
    categories, 
    selectedCategory, 
    setSelectedCategory, 
    language,
    products,
    setActiveNavTab,
    t 
  } = useApp();

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'BookOpen': return <BookOpen className="w-5 h-5 text-amber-600" />;
      case 'Home': return <Home className="w-5 h-5 text-emerald-600" />;
      case 'Shirt': return <Shirt className="w-5 h-5 text-blue-600" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-rose-500" />;
      case 'Cpu': return <Cpu className="w-5 h-5 text-purple-600" />;
      case 'HeartHandshake': return <HeartHandshake className="w-5 h-5 text-emerald-600" />;
      default: return <Layers className="w-5 h-5 text-slate-600" />;
    }
  };

  const getCategoryName = (cat: typeof categories[0]) => {
    if (language === 'en') return cat.nameEn;
    if (language === 'zh') return cat.nameZh;
    if (language === 'ko') return cat.nameKo;
    return cat.name;
  };

  const handleSelectCategory = (catId: string) => {
    if (selectedCategory === catId) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(catId);
      if (catId === 'free_giveaway') {
        setActiveNavTab('giveaway');
      } else {
        setActiveNavTab('home');
      }
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-heading font-bold text-slate-900 flex items-center gap-2">
          <span>{t.categories}</span>
          <span className="text-xs font-normal text-slate-400">· Grid View</span>
        </h2>
        {selectedCategory && (
          <button
            onClick={() => setSelectedCategory(null)}
            className="text-xs font-medium text-amber-700 hover:text-amber-800 transition-colors"
          >
            Hiện tất cả
          </button>
        )}
      </div>

      {/* Grid View Window */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const count = products.filter(p => 
            cat.id === 'free_giveaway' ? (p.isFreeGiveaway || p.price === 0) : p.categoryId === cat.id
          ).length;

          return (
            <button
              key={cat.id}
              onClick={() => handleSelectCategory(cat.id)}
              className={`p-3.5 rounded-xl border text-left transition-all relative overflow-hidden group flex flex-col justify-between min-h-[96px] ${
                isSelected
                  ? 'bg-amber-50/90 border-amber-400 shadow-sm ring-2 ring-amber-300'
                  : 'bg-white border-slate-200/80 hover:border-amber-300 hover:shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg ${isSelected ? 'bg-amber-100' : 'bg-slate-50 group-hover:bg-amber-50'} transition-colors`}>
                  {getCategoryIcon(cat.iconName)}
                </div>
                <span className="text-[11px] font-mono tabular-nums text-slate-400">
                  {count} món
                </span>
              </div>

              <div className="mt-2">
                <p className={`text-xs font-semibold leading-snug line-clamp-1 ${isSelected ? 'text-amber-900 font-bold' : 'text-slate-800 group-hover:text-amber-700'}`}>
                  {getCategoryName(cat)}
                </p>
                <p className="text-[10px] text-slate-400 truncate mt-0.5">
                  {cat.keywords.slice(0, 3).join(', ')}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
