export type UserRole = 'student' | 'lecturer' | 'youth_union' | 'admin';

export interface User {
  id: string;
  name: string;
  studentId: string; // MSSV: e.g. 121001234
  email: string; // @lhu.edu.vn
  role: UserRole;
  faculty: string;
  dormLocation: string;
  avatar: string;
  sharingPoints: number;
  goldHeartBadge: boolean;
  rating: number;
  reviewCount: number;
  verified: boolean;
  phone?: string;
  joinedDate: string;
}

export type ProductCondition = '99% như mới' | '90% tốt' | 'Tặng miễn phí 0đ' | 'Đã qua sử dụng';

export interface Product {
  id: string;
  title: string;
  price: number; // 0 for giveaway
  originalPrice?: number;
  condition: ProductCondition;
  categoryId: string;
  sellerId: string;
  sellerName: string;
  sellerStudentId: string;
  sellerAvatar: string;
  sellerPhone: string;
  locationId: string;
  description: string;
  images: string[];
  videoUrl?: string;
  tags: string[]; // Smart keywords: e.g. ["tủ áo", "quần áo", "tủ vải"]
  createdAt: string;
  status: 'available' | 'reserved' | 'sold';
  isFreeGiveaway: boolean;
  viewsCount: number;
  likesCount: number;
}

export interface Category {
  id: string;
  name: string;
  nameEn: string;
  nameZh: string;
  nameKo: string;
  iconName: string;
  slug: string;
  keywords: string[];
}

export interface LocationArea {
  id: string;
  name: string;
  campusCode: string;
  addressNote: string;
  description: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = 'pending' | 'trading_at_campus' | 'completed' | 'cancelled';

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  sellerId: string;
  sellerName: string;
  image: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  totalAmount: number;
  buyerId: string;
  buyerName: string;
  buyerStudentId: string;
  buyerPhone: string;
  buyerLocation: string;
  note?: string;
  paymentMethod: 'qr_bank' | 'cash_on_delivery';
  status: OrderStatus;
  qrTransactionId: string;
  bankAccountInfo?: {
    bankName: string;
    accountNumber: string;
    accountHolder: string;
  };
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isOffer?: boolean;
  offerAmount?: number;
}

export interface ChatConversation {
  id: string;
  productId: string;
  productTitle: string;
  productPrice: number;
  productImage: string;
  sellerId: string;
  sellerName: string;
  buyerId: string;
  buyerName: string;
  messages: ChatMessage[];
  lastUpdated: string;
}

export interface Review {
  id: string;
  productId: string;
  targetUserId: string;
  authorName: string;
  authorStudentId: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: string;
}

export interface ViolationReport {
  id: string;
  targetType: 'product' | 'user';
  targetId: string;
  targetName: string;
  reason: string;
  details: string;
  reportedBy: string;
  reportedByStudentId: string;
  status: 'pending' | 'reviewed' | 'resolved';
  createdAt: string;
}

export type Language = 'vi' | 'en' | 'zh' | 'ko';
