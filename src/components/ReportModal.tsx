import React, { useState } from 'react';
import { X, AlertTriangle, ShieldCheck, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ReportModal: React.FC = () => {
  const { 
    isReportOpen, 
    setIsReportOpen, 
    reportingTarget, 
    submitReport, 
    currentUser 
  } = useApp();

  const [reason, setReason] = useState('Thông tin không đúng thực tế');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isReportOpen || !reportingTarget) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim()) return;

    submitReport({
      targetType: reportingTarget.type,
      targetId: reportingTarget.id,
      targetName: reportingTarget.name,
      reason,
      details: details.trim(),
      reportedBy: currentUser.name,
      reportedByStudentId: currentUser.studentId,
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setIsReportOpen(false);
      setDetails('');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h3 className="font-heading font-bold text-base text-slate-900">
              Báo Cáo Vi Phạm / Khiếu Nại
            </h3>
          </div>
          <button
            onClick={() => setIsReportOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        {!submitted ? (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
            <div className="p-3 bg-red-50 rounded-xl text-xs text-red-900 border border-red-100">
              Đối tượng báo cáo: <strong className="font-semibold">{reportingTarget.name}</strong>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Lý do khiếu nại / vi phạm *
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-red-500"
              >
                <option value="Thông tin không đúng thực tế">Thông tin vật dụng không đúng mô tả</option>
                <option value="Có dấu hiệu lừa đảo hoặc không phải SV LHU">Nghi vấn không phải sinh viên/cán bộ LHU</option>
                <option value="Bán hàng cấm hoặc không phù hợp">Hàng cấm / không phù hợp môi trường học đường</option>
                <option value="Tranh chấp tiền nong hoặc không giao đồ">Không giao đồ đúng hẹn tại trường</option>
                <option value="Lý do khác">Lý do khác</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Chi tiết nội dung vụ việc *
              </label>
              <textarea
                required
                rows={3}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Mô tả cụ thể thời gian, địa điểm, thỏa thuận giữa hai bên để Ban Quản lý & Đoàn Trường LHU hỗ trợ giải quyết..."
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-500 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                Báo cáo của bạn được gửi trực tiếp tới Văn phòng Đoàn Thanh niên - Hội Sinh viên Trường Đại học Lạc Hồng.
              </span>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsReportOpen(false)}
                className="px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow-2xs"
              >
                Gửi khiếu nại
              </button>
            </div>
          </form>
        ) : (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Khiếu nại đã được ghi nhận!</h4>
            <p className="text-xs text-slate-500">
              Ban Quản trị & Đoàn Trường ĐH Lạc Hồng sẽ liên hệ bạn qua email hoặc số điện thoại sinh viên.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
