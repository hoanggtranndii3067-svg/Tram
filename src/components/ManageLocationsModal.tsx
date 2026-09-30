import React, { useState } from 'react';
import { X, MapPin, Plus, Edit3, Trash2, Check, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LocationArea } from '../types';

export const ManageLocationsModal: React.FC = () => {
  const { 
    isManageLocationsOpen, 
    setIsManageLocationsOpen, 
    locations, 
    addLocation, 
    updateLocation, 
    deleteLocation 
  } = useApp();

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [campusCode, setCampusCode] = useState('');
  const [addressNote, setAddressNote] = useState('');
  const [description, setDescription] = useState('');

  if (!isManageLocationsOpen) return null;

  const handleStartAdd = () => {
    setName('');
    setCampusCode('CS_MOI');
    setAddressNote('P. Bửu Long, TP. Biên Hòa');
    setDescription('Khuôn viên trường & phòng trọ lân cận LHU');
    setIsAdding(true);
    setEditingId(null);
  };

  const handleStartEdit = (loc: LocationArea) => {
    setName(loc.name);
    setCampusCode(loc.campusCode);
    setAddressNote(loc.addressNote);
    setDescription(loc.description);
    setEditingId(loc.id);
    setIsAdding(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (isAdding) {
      addLocation({
        name: name.trim(),
        campusCode: campusCode.trim(),
        addressNote: addressNote.trim(),
        description: description.trim(),
      });
      setIsAdding(false);
    } else if (editingId) {
      updateLocation(editingId, {
        name: name.trim(),
        campusCode: campusCode.trim(),
        addressNote: addressNote.trim(),
        description: description.trim(),
      });
      setEditingId(null);
    }
  };

  const handleDelete = (id: string) => {
    if (locations.length <= 1) {
      alert('Phải giữ lại ít nhất 1 khu vực địa điểm quanh trường LHU.');
      return;
    }
    if (window.confirm('Bạn có chắc chắn muốn xóa khu vực này khỏi bộ lọc sàn?')) {
      deleteLocation(id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="font-heading font-bold text-base text-slate-900 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>Quản Lý Khu Vực & Bộ Lọc Vị Trí LHU</span>
            </h3>
            <p className="text-xs text-slate-500">
              Quyền quản trị của Nhà sáng tạo: Thêm mới, Chỉnh sửa hoặc Xóa địa bàn quanh trường
            </p>
          </div>
          <button
            onClick={() => setIsManageLocationsOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {!isAdding && !editingId && (
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">
                Khu vực hiện có ({locations.length})
              </span>
              <button
                onClick={handleStartAdd}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-2xs flex items-center gap-1.5 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm khu vực mới</span>
              </button>
            </div>
          )}

          {/* Form */}
          {(isAdding || editingId) && (
            <form onSubmit={handleSave} className="p-4 bg-emerald-50/60 border border-emerald-200/80 rounded-2xl space-y-3">
              <div className="flex items-center justify-between border-b border-emerald-200/60 pb-2">
                <span className="text-xs font-bold text-emerald-950">
                  {isAdding ? 'Thêm mới khu vực quanh LHU' : 'Chỉnh sửa khu vực'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setIsAdding(false);
                    setEditingId(null);
                  }}
                  className="text-xs text-slate-500 hover:text-slate-800"
                >
                  Hủy
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Tên khu vực hiển thị *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="VD: Cơ sở 5 LHU, Dãy trọ hẻm 20, Quán Cà phê SV..."
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Mã định danh (Campus Code)
                  </label>
                  <input
                    type="text"
                    value={campusCode}
                    onChange={(e) => setCampusCode(e.target.value)}
                    placeholder="VD: CS5, TRO_HEM20"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Địa chỉ chi tiết / Ghi chú
                  </label>
                  <input
                    type="text"
                    value={addressNote}
                    onChange={(e) => setAddressNote(e.target.value)}
                    placeholder="VD: Đường Huỳnh Văn Nghệ, P. Bửu Long..."
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Mô tả đặc điểm
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="VD: Cổng chính, dễ gửi đồ trước giờ học..."
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAdding(false);
                    setEditingId(null);
                  }}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-2xs"
                >
                  Lưu khu vực
                </button>
              </div>
            </form>
          )}

          {/* Locations List */}
          <div className="space-y-2">
            {locations.map((loc) => (
              <div
                key={loc.id}
                className="p-3 bg-white rounded-xl border border-slate-200 hover:border-slate-300 flex items-center justify-between gap-3 transition-colors"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{loc.name}</h4>
                    <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                      {loc.campusCode}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">{loc.addressNote}</p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleStartEdit(loc)}
                    className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Chỉnh sửa"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(loc.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Xóa khu vực"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
};
