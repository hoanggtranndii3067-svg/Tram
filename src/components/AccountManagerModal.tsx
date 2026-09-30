import React, { useState } from 'react';
import { 
  X, UserCheck, Plus, Edit3, Trash2, Check, 
  GraduationCap, Mail, MapPin, Shield, Award 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { User, UserRole } from '../types';

export const AccountManagerModal: React.FC = () => {
  const { 
    isAccountManagerOpen, 
    setIsAccountManagerOpen, 
    users, 
    currentUser, 
    switchUser, 
    addUser, 
    updateUser, 
    deleteUser 
  } = useApp();

  const [isAdding, setIsAdding] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [faculty, setFaculty] = useState('');
  const [dormLocation, setDormLocation] = useState('');
  const [avatar, setAvatar] = useState('');

  if (!isAccountManagerOpen) return null;

  const handleStartAdd = () => {
    setName('');
    setStudentId('12400' + Math.floor(1000 + Math.random() * 9000));
    setEmail('sinhvien.lhu@lhu.edu.vn');
    setRole('student');
    setFaculty('Khoa Công nghệ Thông tin LHU');
    setDormLocation('Khu KTX Dân Chủ LHU');
    setAvatar('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80');
    setIsAdding(true);
    setEditingUserId(null);
  };

  const handleStartEdit = (user: User) => {
    setName(user.name);
    setStudentId(user.studentId);
    setEmail(user.email);
    setRole(user.role);
    setFaculty(user.faculty);
    setDormLocation(user.dormLocation);
    setAvatar(user.avatar);
    setEditingUserId(user.id);
    setIsAdding(false);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addUser({
      name: name.trim(),
      studentId: studentId.trim(),
      email: email.trim(),
      role,
      faculty: faculty.trim(),
      dormLocation: dormLocation.trim(),
      avatar: avatar.trim() || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    });
    setIsAdding(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUserId || !name.trim()) return;
    updateUser(editingUserId, {
      name: name.trim(),
      studentId: studentId.trim(),
      email: email.trim(),
      role,
      faculty: faculty.trim(),
      dormLocation: dormLocation.trim(),
      avatar: avatar.trim(),
    });
    setEditingUserId(null);
  };

  const handleDelete = (userId: string) => {
    if (users.length <= 1) {
      alert('Hệ thống cần tối thiểu 1 tài khoản sinh viên.');
      return;
    }
    if (window.confirm('Bạn có chắc chắn muốn xóa tên đăng nhập / tài khoản này khỏi danh sách?')) {
      deleteUser(userId);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="font-heading font-bold text-base text-slate-900">
              Quản Lý Tên Đăng Nhập & Hồ Sơ Sinh Viên
            </h3>
            <p className="text-xs text-slate-500">
              Thêm mới, Chỉnh sửa thông tin, hoặc Xóa tài khoản mô phỏng (Demo SV & Admin LHU)
            </p>
          </div>
          <button
            onClick={() => setIsAccountManagerOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          
          {/* Action to create new login user */}
          {!isAdding && !editingUserId && (
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">
                Danh sách tài khoản ({users.length})
              </span>
              <button
                onClick={handleStartAdd}
                className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-2xs flex items-center gap-1.5 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm tên đăng nhập mới</span>
              </button>
            </div>
          )}

          {/* Form: Add or Edit */}
          {(isAdding || editingUserId) && (
            <form onSubmit={isAdding ? handleSaveAdd : handleSaveEdit} className="p-4 bg-amber-50/50 border border-amber-200/80 rounded-2xl space-y-3.5">
              <div className="flex items-center justify-between border-b border-amber-200/60 pb-2">
                <span className="text-xs font-bold text-amber-950">
                  {isAdding ? 'Tạo mới tên đăng nhập & sinh viên' : 'Chỉnh sửa thông tin tài khoản'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setIsAdding(false);
                    setEditingUserId(null);
                  }}
                  className="text-xs text-slate-500 hover:text-slate-800"
                >
                  Hủy bỏ
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Tên hiển thị / Họ & Tên *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="VD: Nguyễn Thị An"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Mã Sinh Viên (MSSV) *
                  </label>
                  <input
                    type="text"
                    required
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="VD: 122005678"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Email LHU (@lhu.edu.vn) *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tencuaban@lhu.edu.vn"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Vai trò trong hệ thống
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="student">Sinh viên LHU</option>
                    <option value="lecturer">Giảng viên LHU</option>
                    <option value="youth_union">Đoàn Thanh niên / Quản trị</option>
                    <option value="admin">Quản trị viên (Admin)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Khoa / Viện / Chuyên ngành
                  </label>
                  <input
                    type="text"
                    value={faculty}
                    onChange={(e) => setFaculty(e.target.value)}
                    placeholder="Khoa CNTT / Khoa Dược / Ngoại ngữ..."
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Nơi ở / Dãy trọ / KTX
                  </label>
                  <input
                    type="text"
                    value={dormLocation}
                    onChange={(e) => setDormLocation(e.target.value)}
                    placeholder="KTX Dân Chủ / Hẻm 12 Huỳnh Văn Nghệ..."
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAdding(false);
                    setEditingUserId(null);
                  }}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg shadow-2xs"
                >
                  {isAdding ? 'Tạo tài khoản' : 'Lưu cập nhật'}
                </button>
              </div>
            </form>
          )}

          {/* List of Simulated Users */}
          <div className="space-y-2.5">
            {users.map((user) => {
              const isCurrent = user.id === currentUser.id;
              return (
                <div
                  key={user.id}
                  className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                    isCurrent
                      ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-200'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      referrerPolicy="no-referrer"
                      className="w-11 h-11 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="text-xs font-bold text-slate-900 truncate">{user.name}</h4>
                        {user.goldHeartBadge && (
                          <span title="Tấm Lòng Vàng">
                            <Award className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
                          </span>
                        )}
                        {isCurrent && (
                          <span className="text-[10px] bg-amber-500 text-slate-950 font-extrabold px-1.5 py-0.2 rounded-md">
                            Đang đăng nhập
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 font-mono">
                        MSSV: {user.studentId} · {user.email}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">
                        {user.faculty} · {user.dormLocation}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {!isCurrent && (
                      <button
                        onClick={() => switchUser(user.id)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 text-xs font-semibold rounded-lg transition-colors"
                      >
                        Đăng nhập
                      </button>
                    )}
                    <button
                      onClick={() => handleStartEdit(user)}
                      className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Chỉnh sửa thông tin"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Xóa tên đăng nhập"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </div>
  );
};
