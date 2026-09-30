import React, { useState } from 'react';
import { 
  X, QrCode, CheckCircle, MapPin, Phone, 
  CreditCard, ShieldCheck, Copy, Check, ArrowRight 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CartItem, Order } from '../types';

interface CheckoutModalProps {
  cartItems: CartItem[];
  totalAmount: number;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  cartItems,
  totalAmount,
  onClose,
}) => {
  const { 
    currentUser, 
    locations, 
    createOrder, 
    setIsCartOpen,
    setActiveNavTab,
    t 
  } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<'qr_bank' | 'cash_on_delivery'>('qr_bank');
  const [buyerLocation, setBuyerLocation] = useState(locations[0]?.name || 'Cơ sở 1 LHU (Huỳnh Văn Nghệ)');
  const [buyerPhone, setBuyerPhone] = useState(currentUser.phone || '0912345678');
  const [orderNote, setOrderNote] = useState('Hẹn gặp giờ ra chơi tại sảnh hoặc KTX');
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [copiedAccount, setCopiedAccount] = useState(false);

  const bankInfo = {
    bankName: 'BIDV Chi Nhánh Đồng Nai (LHU Student Pay)',
    accountNumber: '6701000123456',
    accountHolder: 'UNIMART LHU ESCROW',
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const order = createOrder({
      items: cartItems.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
      })),
      paymentMethod,
      buyerLocation,
      buyerPhone,
      note: orderNote,
    });
    setPlacedOrder(order);
  };

  const handleFinish = () => {
    onClose();
    setIsCartOpen(false);
    setActiveNavTab('orders');
  };

  const handleCopyAccount = () => {
    navigator.clipboard?.writeText(bankInfo.accountNumber);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  // VietQR Quicklink standard URL format for instant banking QR
  const vietQrUrl = `https://api.vietqr.io/image/970418-6701000123456-compact2.png?amount=${totalAmount}&addInfo=UNIMART%20LHU&accountName=UNIMART%20LHU%20ESCROW`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-amber-600" />
            <h3 className="font-heading font-bold text-base text-slate-900">
              {placedOrder ? 'Đặt hàng & Thanh toán thành công' : 'Thanh toán & Xác nhận đơn hàng'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {!placedOrder ? (
          <form onSubmit={handlePlaceOrder} className="p-5 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            
            {/* Order Summary Snapshot */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Tổng sản phẩm:</span>
                <span className="font-bold text-slate-800">{cartItems.length} món</span>
              </div>
              <div className="flex items-center justify-between text-sm pt-1 border-t border-slate-200/60">
                <span className="font-bold text-slate-800">Tổng số tiền:</span>
                <span className="text-lg font-extrabold font-mono tabular-nums text-amber-600">
                  {new Intl.NumberFormat('vi-VN').format(totalAmount)}đ
                </span>
              </div>
            </div>

            {/* Buyer Contact & Meetup Campus Location */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                Thông tin nhận đồ tại Trường ĐH Lạc Hồng
              </h4>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Địa điểm hẹn gặp giao nhận quanh trường LHU *
                </label>
                <select
                  value={buyerLocation}
                  onChange={(e) => setBuyerLocation(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 bg-white"
                >
                  {locations.map(loc => (
                    <option key={loc.id} value={loc.name}>
                      {loc.name} ({loc.addressNote})
                    </option>
                  ))}
                  <option value="Sảnh CS1 LHU (Huỳnh Văn Nghệ)">Sảnh CS1 LHU (Huỳnh Văn Nghệ)</option>
                  <option value="Cổng KTX Dân Chủ LHU">Cổng KTX Dân Chủ LHU</option>
                  <option value="Phòng trọ riêng của bạn">Phòng trọ riêng của bạn</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Số điện thoại người nhận (Zalo/Call) *
                </label>
                <input
                  type="tel"
                  required
                  value={buyerPhone}
                  onChange={(e) => setBuyerPhone(e.target.value)}
                  placeholder="0912 345 678"
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ghi chú cho người bán (khung giờ rảnh, tiết học)
                </label>
                <input
                  type="text"
                  value={orderNote}
                  onChange={(e) => setOrderNote(e.target.value)}
                  placeholder="VD: Giờ giải lao tiết 3, hoặc sau 17h tại cổng KTX..."
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                Phương thức thanh toán
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('qr_bank')}
                  className={`p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
                    paymentMethod === 'qr_bank'
                      ? 'border-amber-500 bg-amber-50/70 shadow-2xs ring-1 ring-amber-400'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <QrCode className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-slate-900">Quét mã VietQR tự động</p>
                    <p className="text-[11px] text-slate-500">Chuyển khoản tức thì qua App Ngân hàng</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash_on_delivery')}
                  className={`p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
                    paymentMethod === 'cash_on_delivery'
                      ? 'border-emerald-500 bg-emerald-50/70 shadow-2xs ring-1 ring-emerald-400'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <MapPin className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-slate-900">Tiền mặt khi nhận đồ</p>
                    <p className="text-[11px] text-slate-500">Kiểm tra vật dụng tại trường rồi gửi tiền</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Quay lại giỏ hàng
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-all active:scale-98"
              >
                Xác nhận đặt đơn
              </button>
            </div>

          </form>
        ) : (
          /* Success & Dynamic VietQR Generation State */
          <div className="p-6 space-y-5 text-center">
            
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div>
              <h4 className="text-lg font-bold text-slate-900">
                Đặt hàng thành công! Mã đơn: <span className="font-mono text-amber-700">{placedOrder.id}</span>
              </h4>
              <p className="text-xs text-slate-600 mt-1">
                Đơn hàng đã được gửi tới người bán LHU. Bạn có thể theo dõi trong mục "Mua của tôi".
              </p>
            </div>

            {/* If VietQR Payment Selected */}
            {placedOrder.paymentMethod === 'qr_bank' && (
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Cổng thanh toán QR tự động (VietQR)</span>
                  <span className="text-[11px] font-mono text-emerald-700 font-bold">LHU Escrow</span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Real VietQR image representation */}
                  <div className="bg-white p-2 rounded-xl border border-slate-200 shrink-0 shadow-2xs">
                    <img
                      src={vietQrUrl}
                      alt="VietQR Code"
                      className="w-36 h-36 object-contain"
                      onError={(e) => {
                        // Styled SVG QR Fallback if external image service offline
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <p className="text-[10px] text-center font-mono text-slate-500 mt-1">Quét bằng mọi App Ngân Hàng</p>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-700 min-w-0 flex-1">
                    <p>Ngân hàng: <strong>{bankInfo.bankName}</strong></p>
                    <div className="flex items-center gap-1.5">
                      <span>Số tài khoản: <strong className="font-mono">{bankInfo.accountNumber}</strong></span>
                      <button
                        onClick={handleCopyAccount}
                        className="text-slate-400 hover:text-amber-700 p-1"
                        title="Sao chép số tài khoản"
                      >
                        {copiedAccount ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <p>Chủ tài khoản: <strong>{bankInfo.accountHolder}</strong></p>
                    <p>Số tiền: <strong className="font-mono text-amber-700">{new Intl.NumberFormat('vi-VN').format(placedOrder.totalAmount)}đ</strong></p>
                    <p className="text-[11px] text-slate-500">Nội dung: <strong className="font-mono text-slate-800">{placedOrder.id}</strong></p>
                  </div>
                </div>
              </div>
            )}

            {placedOrder.paymentMethod === 'cash_on_delivery' && (
              <div className="p-3.5 bg-emerald-50 text-emerald-900 rounded-xl text-xs text-left border border-emerald-200/80">
                <p className="font-bold">Phương thức: Tiền mặt khi nhận đồ trực tiếp</p>
                <p className="text-[11px] text-emerald-700 mt-1">
                  Địa điểm hẹn: <strong>{placedOrder.buyerLocation}</strong>. Người bán sẽ liên hệ SĐT <strong>{placedOrder.buyerPhone}</strong> để trao đổi chi tiết.
                </p>
              </div>
            )}

            <button
              onClick={handleFinish}
              className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
            >
              <span>Xem đơn hàng trong "Mua của tôi"</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </div>
        )}

      </div>
    </div>
  );
};
