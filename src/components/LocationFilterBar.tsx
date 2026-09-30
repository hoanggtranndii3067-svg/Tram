import React from 'react';
import { MapPin, Settings2, Check, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LocationFilterBar: React.FC = () => {
  const { 
    locations, 
    selectedLocation, 
    setSelectedLocation, 
    setIsManageLocationsOpen,
    t 
  } = useApp();

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-3 sm:p-4 shadow-2xs space-y-2.5">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
          <MapPin className="w-4 h-4 text-emerald-600" />
          <span>{t.filterByLocation}</span>
          <span className="text-slate-400 font-normal hidden sm:inline">
            (Cơ sở 1-4, KTX & Dãy trọ Bửu Long)
          </span>
        </div>

        {/* Creator / Admin Action: Manage Campus Locations */}
        <button
          onClick={() => setIsManageLocationsOpen(true)}
          className="text-xs text-amber-700 hover:text-amber-800 font-medium flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-amber-50 transition-colors"
          title="Tùy biến thêm/xóa/sửa các khu vực LHU"
        >
          <Settings2 className="w-3.5 h-3.5" />
          <span>{t.manageLocations} (Nhà sáng tạo)</span>
        </button>
      </div>

      {/* Horizontal Scrollable Area Tags */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        <button
          onClick={() => setSelectedLocation(null)}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
            selectedLocation === null
              ? 'bg-emerald-600 text-white shadow-xs font-semibold'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          {selectedLocation === null && <Check className="w-3 h-3" />}
          <span>{t.allLocations}</span>
        </button>

        {locations.map((loc) => {
          const isSelected = selectedLocation === loc.id;
          return (
            <button
              key={loc.id}
              onClick={() => setSelectedLocation(isSelected ? null : loc.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                isSelected
                  ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {isSelected && <Check className="w-3 h-3" />}
              <span>{loc.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
