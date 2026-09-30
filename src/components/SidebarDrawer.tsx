import React from 'react';
import { 
  X, UserCheck, ShieldCheck, HeartHandshake, MapPin, 
  Users, QrCode, AlertTriangle, LogOut, Sparkles, 
  GraduationCap, Mail, Phone, ExternalLink, Award 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SidebarDrawer: React.FC = () => {
  const { 
    currentUser, 
    isSidebarOpen, 
    setIsSidebarOpen, 
    setIsAccountManagerOpen, 
    setIsManageLocationsOpen, 
    setIsAppQrOpen,
    setIsReportOpen,
    setReportingTarget,
    setActiveNavTab,
    setSelectedCategory,
    t 
  } = useApp();

  if (!isSidebarOpen) return null;

  const handleOpenAccountManager = () => {
    setIsSidebarOpen(false);
    setIsAccountManagerOpen(true);
  };

  const handleOpenManageLocations = () => {
    setIsSidebarOpen(false);
    setIsManageLocationsOpen(true);
  };

  const handleOpenAppQr = () => {
    setIsSidebarOpen(false);
    setIsAppQrOpen(true);
  };

  const handleOpenReport = () => {
    setIsSidebarOpen(false);
    setReportingTarget({
      type: 'user',
      id: 'general-inquiry',
      name: 'Ban Thanh tra & Đoàn Trường ĐH Lạc Hồng',
    });
    setIsReportOpen(true);
  };

  const handleGoToGiveaway = () => {
    setIsSidebarOpen(false);
    setActiveNavTab('giveaway');
    setSelectedCategory('free_giveaway');
  };

  const handleGoToOrders = () => {
    setIsSidebarOpen(false);
    setActiveNavTab('orders');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={() => setIsSidebarOpen(false)}
      />

      <div className="fixed inset-y-0 left-0 max-w-full flex">
        <div className="w-screen max-w-sm bg-white shadow-2xl flex flex-col justify-between">
          
          {/* Top header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-white font-bold text-sm shadow-xs">
                U
              </div>
              <div>
                <h3 className="font-heading font-bold text-base text-slate-900 tracking-tight">UNIMART LHU</h3>
                <p className="text-[11px] text-slate-500 font-medium">Sàn Đồ Dùng SV Lạc Hồng</p>
              </div>
            </div>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            
            {/* Student Profile Card */}
            <div className="bg-gradient-to-br from-slate-50 to-amber-50/50 rounded-2xl p-4 border border-amber-200/60 shadow-xs relative overflow-hidden">
              <div className="flex items-start gap-3.5">
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.name} 
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-sm shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h4 className="font-semibold text-sm text-slate-900 truncate">
                      {currentUser.name}
                    </h4>
                    {currentUser.verified && (
                      <span className="inline-flex items-center text-emerald-600" title="Đã xác thực sinh viên LHU">
                        <UserCheck className="w-4 h-4" />
                      </span>
                    )}
                  </div>
                  
                  <div className="text-xs text-slate-600 mt-0.5 space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span className="font-mono font-medium text-slate-800">MSSV: {currentUser.studentId}</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate text-[11px]">{currentUser.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate text-[11px] text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{currentUser.dormLocation}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Badges and Honors */}
              <div className="mt-3.5 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
                {currentUser.goldHeartBadge ? (
                  <div className="flex items-center gap-1 text-amber-800 font-medium">
                    <Award className="w-4 h-4 text-amber-600 fill-amber-500" />
                    <span>Tấm Lòng Vàng</span>
                  </div>
                ) : (
                  <div className="text-slate-500 text-[11px]">
                    Thành viên LHU
                  </div>
                )}

                <div className="flex items-center gap-1.5 font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{currentUser.sharingPoints} Điểm sẻ chia</span>
                </div>
              </div>
            </div>

            {/* Quick Actions List */}
            <div className="space-y-1">
              <button 
                onClick={handleOpenAccountManager}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 text-slate-700 hover:text-slate-900 transition-colors text-sm font-medium text-left"
              >
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-amber-600" />
                  <span>{t.accountManagement} (Thêm / Sửa / Xóa)</span>
                </div>
                <span className="text-xs text-slate-400">SV & Admin</span>
              </button>

              <button 
                onClick={handleOpenManageLocations}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 text-slate-700 hover:text-slate-900 transition-colors text-sm font-medium text-left"
              >
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span>Quản lý khu vực & trọ LHU</span>
                </div>
                <span className="text-xs text-emerald-600 font-semibold">Tùy biến</span>
              </button>

              <button 
                onClick={handleGoToOrders}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 text-slate-700 hover:text-slate-900 transition-colors text-sm font-medium text-left"
              >
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>Quản lý Mua & Bán của tôi</span>
                </div>
              </button>

              <button 
                onClick={handleGoToGiveaway}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 transition-colors text-sm font-medium text-left"
              >
                <div className="flex items-center gap-3">
                  <HeartHandshake className="w-4 h-4 text-emerald-600" />
                  <span>Khu "Cho đi là nhận lại" (0đ)</span>
                </div>
                <span className="text-xs text-emerald-600 font-bold">Miễn phí</span>
              </button>

              <button 
                onClick={handleOpenAppQr}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 text-slate-700 hover:text-slate-900 transition-colors text-sm font-medium text-left"
              >
                <div className="flex items-center gap-3">
                  <QrCode className="w-4 h-4 text-slate-600" />
                  <span>{t.appQrCode} (Mã QR sàn Unimart)</span>
                </div>
              </button>

              <button 
                onClick={handleOpenReport}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-red-50 text-slate-700 hover:text-red-700 transition-colors text-sm font-medium text-left"
              >
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  <span>Khiếu nại / Báo vi phạm tới Đoàn LHU</span>
                </div>
              </button>
            </div>

            {/* University & Safety Guarantee */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-600 space-y-1.5">
              <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Bảo chứng bởi Trường ĐH Lạc Hồng</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-500">
                Chỉ sinh viên & cán bộ LHU có email <code>@lhu.edu.vn</code> mới được cấp quyền giao dịch. Mọi tranh chấp được Đoàn Trường can thiệp giải quyết.
              </p>
            </div>

          </div>

          {/* Bottom Footer with Creator Attribution */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/70">
            <div className="text-xs text-slate-500 leading-normal">
              <p className="font-medium text-slate-800">
                Dự án UNIMART LHU
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Nhà sáng tạo và Phát triển: <span className="text-amber-800 font-semibold">Hoàng Thị Phương Trâm</span>
              </p>
              <p className="text-[10px] text-slate-400 mt-1">
                Trường Đại học Lạc Hồng (LHU) · Đồng Nai
              </p>
            </div>

            <button 
              onClick={handleOpenAccountManager}
              className="mt-3 w-full py-2 px-3 border border-slate-200 hover:bg-white rounded-lg text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
            >
              <LogOut className="w-3.5 h-3.5 text-slate-400" />
              <span>Chuyển đổi tài khoản khác</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
