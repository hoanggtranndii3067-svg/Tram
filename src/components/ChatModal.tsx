import React, { useState } from 'react';
import { X, Send, Tag, MessageSquare, DollarSign, UserCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ChatModal: React.FC = () => {
  const { 
    isChatOpen, 
    setIsChatOpen, 
    activeConversation, 
    sendMessage, 
    currentUser,
    setSelectedProductDetail,
    products 
  } = useApp();

  const [inputText, setInputText] = useState('');
  const [offerPrice, setOfferPrice] = useState<number | string>('');
  const [showOfferBox, setShowOfferBox] = useState(false);

  if (!isChatOpen || !activeConversation) return null;

  const conv = activeConversation;
  const isBuyer = currentUser.id === conv.buyerId;
  const partnerName = isBuyer ? conv.sellerName : conv.buyerName;

  const quickReplies = [
    'Chào bạn, món này bạn còn giữ không ạ?',
    'Bớt 10k tiền ship qua KTX Dân Chủ được không bạn?',
    'Hẹn gặp tại sảnh CS1 giờ ra chơi tiết 3 nhé!',
    'Bạn ở trọ hẻm nào đường Huỳnh Văn Nghệ vậy?',
  ];

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(conv.id, inputText.trim());
    setInputText('');
  };

  const handleQuickReply = (text: string) => {
    sendMessage(conv.id, text);
  };

  const handleSendOffer = (e: React.FormEvent) => {
    e.preventDefault();
    const num = Number(offerPrice);
    if (!num || num <= 0) return;
    const formatted = new Intl.NumberFormat('vi-VN').format(num) + 'đ';
    sendMessage(conv.id, `Mình xin phép gửi đề xuất giá mới: ${formatted}`, true, num);
    setOfferPrice('');
    setShowOfferBox(false);
  };

  const handleOpenProduct = () => {
    const prod = products.find(p => p.id === conv.productId);
    if (prod) {
      setSelectedProductDetail(prod);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={() => setIsChatOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          
          {/* Top Bar */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center text-sm shadow-2xs">
                {partnerName.charAt(0)}
              </div>
              <div>
                <h4 className="font-semibold text-sm text-slate-900 flex items-center gap-1">
                  <span>{partnerName}</span>
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                </h4>
                <p className="text-[11px] text-slate-500">Sinh viên ĐH Lạc Hồng</p>
              </div>
            </div>

            <button
              onClick={() => setIsChatOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Product Mini Header */}
          <div 
            onClick={handleOpenProduct}
            className="p-3 bg-amber-50/60 border-b border-amber-200/60 flex items-center justify-between gap-3 cursor-pointer hover:bg-amber-100/50 transition-colors"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={conv.productImage}
                alt={conv.productTitle}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-lg object-cover bg-white shrink-0 border border-amber-200"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-900 truncate">{conv.productTitle}</p>
                <p className="text-xs font-mono font-bold text-amber-700">
                  {conv.productPrice === 0 ? '0đ (Tặng 0đ)' : new Intl.NumberFormat('vi-VN').format(conv.productPrice) + 'đ'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowOfferBox(!showOfferBox);
              }}
              className="px-2.5 py-1 text-xs font-semibold text-amber-900 bg-white border border-amber-300 rounded-lg hover:bg-amber-50 transition-colors shrink-0"
            >
              Đề xuất giá
            </button>
          </div>

          {/* Offer Input Drawer */}
          {showOfferBox && (
            <form onSubmit={handleSendOffer} className="p-3 bg-amber-100/80 border-b border-amber-200 flex gap-2 items-center">
              <div className="relative flex-1">
                <input
                  type="number"
                  placeholder="Nhập mức giá bạn muốn thương lượng (VNĐ)..."
                  value={offerPrice}
                  onChange={(e) => setOfferPrice(e.target.value)}
                  className="w-full text-xs px-3 py-1.5 rounded-lg border border-amber-300 bg-white focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg whitespace-nowrap"
              >
                Gửi giá
              </button>
            </form>
          )}

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {conv.messages.map((msg) => {
              const isMine = msg.senderId === currentUser.id;
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                      isMine
                        ? 'bg-amber-500 text-slate-950 font-medium rounded-br-xs'
                        : 'bg-slate-100 text-slate-800 rounded-bl-xs'
                    }`}
                  >
                    {msg.isOffer && (
                      <div className="font-bold text-[11px] uppercase tracking-wide border-b border-black/10 pb-1 mb-1 flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        <span>Đề xuất thương lượng giá</span>
                      </div>
                    )}
                    <p>{msg.text}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-0.5 px-1 font-mono">
                    {msg.timestamp}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Quick Replies Buttons */}
          <div className="p-2 border-t border-slate-100 bg-slate-50 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {quickReplies.map((qr, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickReply(qr)}
                className="px-2.5 py-1 bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-300 rounded-lg text-[11px] text-slate-700 hover:text-amber-900 whitespace-nowrap transition-colors shrink-0 shadow-2xs"
              >
                {qr}
              </button>
            ))}
          </div>

          {/* Bottom Input */}
          <form onSubmit={handleSend} className="p-3 border-t border-slate-100 bg-white flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Nhắn tin thương lượng với người bán..."
              className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              className="p-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl transition-all shadow-2xs active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};
