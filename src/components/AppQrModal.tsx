import React, { useState } from 'react';
import { X, QrCode, Copy, Check, Share2, Smartphone, Camera } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AppQrModal: React.FC = () => {
  const { isAppQrOpen, setIsAppQrOpen, t } = useApp();
  const [copied, setCopied] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);

  if (!isAppQrOpen) return null;

  const appUrl = window.location.origin || 'https://unimart-lhu.edu.vn';
  // Standard high resolution QR code generator URL for sharing the app
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(appUrl)}&color=1e293b`;

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScanResult('Đã quét thành công mã QR Unimart LHU! Kết nối mạng nội bộ ĐH Lạc Hồng an toàn.');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-amber-600" />
            <h3 className="font-heading font-bold text-base text-slate-900">
              Mã QR Ứng Dụng UNIMART LHU
            </h3>
          </div>
          <button
            onClick={() => setIsAppQrOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-center space-y-5">
          
          <div className="space-y-1">
            <h4 className="text-base font-bold text-slate-900">
              Chia sẻ Sàn Đồ Dùng LHU
            </h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Mời bạn bè cùng trường quét mã QR bằng camera điện thoại để truy cập nhanh Unimart
            </p>
          </div>

          {/* QR Code Container */}
          <div className="bg-gradient-to-br from-amber-50 to-emerald-50 p-6 rounded-2xl border border-amber-200/60 inline-block shadow-xs">
            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
              <img
                src={qrImageUrl}
                alt="Unimart LHU App QR Code"
                className="w-48 h-48 mx-auto object-contain"
              />
            </div>
            <p className="text-[11px] font-mono text-slate-600 font-semibold mt-2.5">
              UNIMART · TRƯỜNG ĐH LẠC HỒNG
            </p>
          </div>

          {/* Link display & copy */}
          <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
            <span className="truncate font-mono text-slate-600 flex-1 text-left px-1">
              {appUrl}
            </span>
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1 shrink-0 transition-colors shadow-2xs"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Đã chép' : 'Sao chép'}</span>
            </button>
          </div>

          {/* Scan simulator */}
          <div className="pt-2 border-t border-slate-100 flex flex-col items-center gap-2">
            <button
              onClick={handleSimulateScan}
              disabled={isScanning}
              className="text-xs text-slate-700 hover:text-amber-800 font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <Camera className="w-4 h-4 text-emerald-600" />
              <span>{isScanning ? 'Đang mở camera quét mã...' : 'Mô phỏng quét mã QR bằng camera'}</span>
            </button>

            {scanResult && (
              <p className="text-xs text-emerald-700 font-medium bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                {scanResult}
              </p>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
