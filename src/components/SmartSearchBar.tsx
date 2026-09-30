import React, { useState } from 'react';
import { Search, Camera, Trash2, X, Sparkles, Tag } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SmartSearchBar: React.FC = () => {
  const { 
    searchQuery, 
    setSearchQuery, 
    searchHistory, 
    addSearchHistory, 
    clearSearchHistory, 
    removeSearchHistoryItem,
    setIsCameraSearchOpen,
    t 
  } = useApp();

  const [localInput, setLocalInput] = useState(searchQuery);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = localInput.trim();
    setSearchQuery(query);
    if (query) {
      addSearchHistory(query);
    }
  };

  const handleQuickKeyword = (kw: string) => {
    setLocalInput(kw);
    setSearchQuery(kw);
    addSearchHistory(kw);
  };

  const handleClearInput = () => {
    setLocalInput('');
    setSearchQuery('');
  };

  const hotKeywords = [
    { label: 'tủ áo', hint: 'Quần áo, tủ nhựa, móc treo' },
    { label: 'giày', hint: 'Giày thể thao, sandal, dép' },
    { label: 'sách', hint: 'Giáo trình LHU, vở, Casio' },
    { label: 'quạt', hint: 'Quạt mini, quạt phòng trọ' },
    { label: 'nồi', hint: 'Nồi cơm điện, ấm siêu tốc' },
    { label: 'máy tính', hint: 'Casio 580, chuột, laptop' },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-3">
      
      {/* Main Search Input Container */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <div className="flex items-center bg-white rounded-2xl border-2 border-slate-200 focus-within:border-amber-500 shadow-xs transition-all overflow-hidden p-1">
          
          {/* Camera Search Button (Left Icon) */}
          <button
            type="button"
            onClick={() => setIsCameraSearchOpen(true)}
            className="p-2.5 sm:px-3.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50/80 rounded-xl transition-colors flex items-center gap-1.5 shrink-0 group"
            title="Quét và tìm kiếm sản phẩm bằng ảnh"
          >
            <Camera className="w-5 h-5 group-hover:scale-105 transition-transform" />
            <span className="hidden sm:inline text-xs font-semibold text-slate-700 group-hover:text-amber-700">
              {t.searchCamera}
            </span>
          </button>

          <div className="h-6 w-px bg-slate-200 mx-1 shrink-0" />

          {/* Text Input */}
          <div className="flex-1 relative flex items-center min-w-0">
            <input
              type="text"
              value={localInput}
              onChange={(e) => setLocalInput(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
            />
            {localInput && (
              <button
                type="button"
                onClick={handleClearInput}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 mr-1.5 shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Right Orange / Amber Search Button */}
          <button
            type="submit"
            className="px-4 sm:px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-sm font-semibold rounded-xl transition-all shadow-xs flex items-center gap-2 shrink-0 active:scale-98"
          >
            <Search className="w-4 h-4" />
            <span className="hidden xs:inline">{t.searchButton}</span>
          </button>
        </div>
      </form>

      {/* Smart Keyword Recognition Hint */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 px-2 flex-wrap gap-2">
        <div className="flex items-center gap-1 text-slate-600">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span>{t.smartKeywordHint}</span>
        </div>
      </div>

      {/* Hot Keyword Quick Tags */}
      <div className="flex items-center gap-1.5 flex-wrap px-1 text-xs">
        <span className="text-slate-400 font-medium shrink-0 flex items-center gap-1">
          <Tag className="w-3.5 h-3.5" />
          {t.popularKeywords}
        </span>
        {hotKeywords.map((kw) => (
          <button
            key={kw.label}
            onClick={() => handleQuickKeyword(kw.label)}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 transition-colors font-medium text-xs whitespace-nowrap"
            title={kw.hint}
          >
            {kw.label}
          </button>
        ))}
      </div>

      {/* Recent Search History Tags with Trash Button */}
      {searchHistory.length > 0 && (
        <div className="pt-1 flex items-center gap-2 flex-wrap px-1 text-xs border-t border-slate-100">
          <span className="text-slate-400 font-medium shrink-0">
            {t.recentSearches}:
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {searchHistory.slice(0, 6).map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200 text-slate-600 text-[11px]"
              >
                <button
                  onClick={() => handleQuickKeyword(item)}
                  className="hover:text-amber-700 transition-colors max-w-28 truncate"
                >
                  {item}
                </button>
                <button
                  onClick={() => removeSearchHistoryItem(item)}
                  className="text-slate-400 hover:text-slate-600 p-0.5 rounded-full"
                  title="Xoá từ này"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            ))}
          </div>

          <button
            onClick={clearSearchHistory}
            className="text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1 text-[11px] font-medium ml-auto p-1"
            title={t.clearHistory}
          >
            <Trash2 className="w-3 h-3" />
            <span className="hidden sm:inline">{t.clearHistory}</span>
          </button>
        </div>
      )}

    </div>
  );
};
