import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, Product, Category, LocationArea, CartItem, Order, 
  ChatConversation, ViolationReport, Review, Language 
} from '../types';
import { 
  INITIAL_USERS, INITIAL_CATEGORIES, INITIAL_LOCATIONS, INITIAL_PRODUCTS 
} from '../data/mockData';
import { translations, getTranslation } from '../data/translations';
import confetti from 'canvas-confetti';

interface AppContextType {
  // User state & CRUD
  currentUser: User;
  users: User[];
  setCurrentUser: (user: User) => void;
  addUser: (user: Omit<User, 'id' | 'sharingPoints' | 'goldHeartBadge' | 'rating' | 'reviewCount' | 'verified' | 'joinedDate'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  switchUser: (id: string) => void;

  // Language
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.vi;

  // Products & CRUD
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'status' | 'viewsCount' | 'likesCount' | 'sellerId' | 'sellerName' | 'sellerStudentId' | 'sellerAvatar' | 'sellerPhone'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleLikeProduct: (id: string) => void;

  // Categories & Locations
  categories: Category[];
  locations: LocationArea[];
  addLocation: (loc: Omit<LocationArea, 'id'>) => void;
  updateLocation: (id: string, updates: Partial<LocationArea>) => void;
  deleteLocation: (id: string) => void;

  // Filter & Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (catId: string | null) => void;
  selectedLocation: string | null;
  setSelectedLocation: (locId: string | null) => void;
  searchHistory: string[];
  addSearchHistory: (query: string) => void;
  clearSearchHistory: () => void;
  removeSearchHistoryItem: (query: string) => void;
  filteredProducts: Product[];

  // Cart & Orders
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  orders: Order[];
  createOrder: (orderData: {
    items: { productId: string; quantity: number }[];
    paymentMethod: 'qr_bank' | 'cash_on_delivery';
    buyerLocation: string;
    buyerPhone: string;
    note?: string;
  }) => Order;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;

  // Chat
  conversations: ChatConversation[];
  activeConversation: ChatConversation | null;
  setActiveConversation: (conv: ChatConversation | null) => void;
  sendMessage: (conversationId: string, text: string, isOffer?: boolean, offerAmount?: number) => void;
  startChatWithSeller: (product: Product) => void;

  // Reviews & Reports
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'createdAt'>) => void;
  reports: ViolationReport[];
  submitReport: (report: Omit<ViolationReport, 'id' | 'createdAt' | 'status'>) => void;

  // Modals & Navigation
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  isCreateProductOpen: boolean;
  setIsCreateProductOpen: (open: boolean) => void;
  editingProduct: Product | null;
  setEditingProduct: (prod: Product | null) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  isAccountManagerOpen: boolean;
  setIsAccountManagerOpen: (open: boolean) => void;
  isManageLocationsOpen: boolean;
  setIsManageLocationsOpen: (open: boolean) => void;
  isAppQrOpen: boolean;
  setIsAppQrOpen: (open: boolean) => void;
  isCameraSearchOpen: boolean;
  setIsCameraSearchOpen: (open: boolean) => void;
  isReportOpen: boolean;
  setIsReportOpen: (open: boolean) => void;
  reportingTarget: { type: 'product' | 'user'; id: string; name: string } | null;
  setReportingTarget: (target: { type: 'product' | 'user'; id: string; name: string } | null) => void;
  selectedProductDetail: Product | null;
  setSelectedProductDetail: (prod: Product | null) => void;
  activeNavTab: 'home' | 'giveaway' | 'orders' | 'wishlist';
  setActiveNavTab: (tab: 'home' | 'giveaway' | 'orders' | 'wishlist') => void;

  // Celebration helper for sharing/giving
  triggerCelebration: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Helper function to remove accents for smart Vietnamese search
function removeAccents(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load saved state or default
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('unimart_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const savedId = localStorage.getItem('unimart_current_user_id');
    const found = users.find(u => u.id === savedId);
    return found || users[0] || INITIAL_USERS[0];
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('unimart_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [locations, setLocations] = useState<LocationArea[]>(() => {
    const saved = localStorage.getItem('unimart_locations');
    return saved ? JSON.parse(saved) : INITIAL_LOCATIONS;
  });

  const [categories] = useState<Category[]>(INITIAL_CATEGORIES);

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('unimart_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('unimart_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('unimart_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('unimart_language');
    return (saved as Language) || 'vi';
  });

  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    const saved = localStorage.getItem('unimart_search_history');
    return saved ? JSON.parse(saved) : ['tủ áo', 'giáo trình', 'quạt', 'giày', 'máy tính'];
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  // Modals state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCreateProductOpen, setIsCreateProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAccountManagerOpen, setIsAccountManagerOpen] = useState(false);
  const [isManageLocationsOpen, setIsManageLocationsOpen] = useState(false);
  const [isAppQrOpen, setIsAppQrOpen] = useState(false);
  const [isCameraSearchOpen, setIsCameraSearchOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportingTarget, setReportingTarget] = useState<{ type: 'product' | 'user'; id: string; name: string } | null>(null);
  const [selectedProductDetail, setSelectedProductDetail] = useState<Product | null>(null);
  const [activeNavTab, setActiveNavTab] = useState<'home' | 'giveaway' | 'orders' | 'wishlist'>('home');

  // Chat conversations
  const [conversations, setConversations] = useState<ChatConversation[]>(() => {
    const saved = localStorage.getItem('unimart_conversations');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeConversation, setActiveConversation] = useState<ChatConversation | null>(null);

  // Reviews & Reports
  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('unimart_reviews');
    return saved ? JSON.parse(saved) : [
      {
        id: 'rev-1',
        productId: 'prod-textbook-bundle',
        targetUserId: 'user-nam',
        authorName: 'Hoàng Thị Phương Trâm',
        authorStudentId: '121008899',
        rating: 5,
        comment: 'Bạn Nam giao sách đúng hẹn tại sảnh CS1 LHU, sách giữ rất kỹ và sạch đẹp!',
        createdAt: 'Hôm qua',
      }
    ];
  });

  const [reports, setReports] = useState<ViolationReport[]>(() => {
    const saved = localStorage.getItem('unimart_reports');
    return saved ? JSON.parse(saved) : [];
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('unimart_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('unimart_current_user_id', currentUser.id);
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('unimart_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('unimart_locations', JSON.stringify(locations));
  }, [locations]);

  useEffect(() => {
    localStorage.setItem('unimart_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('unimart_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('unimart_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('unimart_language', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('unimart_search_history', JSON.stringify(searchHistory));
  }, [searchHistory]);

  useEffect(() => {
    localStorage.setItem('unimart_conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem('unimart_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('unimart_reports', JSON.stringify(reports));
  }, [reports]);

  // Current translation strings
  const t = getTranslation(language);

  // Confetti celebration
  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#10B981', '#3B82F6', '#EC4899'],
      });
    } catch {
      // fallback safe
    }
  };

  // User Management
  const addUser = (userData: Omit<User, 'id' | 'sharingPoints' | 'goldHeartBadge' | 'rating' | 'reviewCount' | 'verified' | 'joinedDate'>) => {
    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`,
      sharingPoints: 10,
      goldHeartBadge: false,
      rating: 5.0,
      reviewCount: 0,
      verified: true,
      joinedDate: 'Vừa tham gia',
    };
    setUsers(prev => [newUser, ...prev]);
    setCurrentUser(newUser);
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
    if (currentUser.id === id) {
      setCurrentUser(prev => ({ ...prev, ...updates }));
    }
  };

  const deleteUser = (id: string) => {
    if (users.length <= 1) {
      return; // Keep at least one demo user
    }
    const filtered = users.filter(u => u.id !== id);
    setUsers(filtered);
    if (currentUser.id === id) {
      setCurrentUser(filtered[0]);
    }
  };

  const switchUser = (id: string) => {
    const found = users.find(u => u.id === id);
    if (found) {
      setCurrentUser(found);
    }
  };

  // Product CRUD
  const addProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'status' | 'viewsCount' | 'likesCount' | 'sellerId' | 'sellerName' | 'sellerStudentId' | 'sellerAvatar' | 'sellerPhone'>) => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      sellerId: currentUser.id,
      sellerName: currentUser.name,
      sellerStudentId: currentUser.studentId,
      sellerAvatar: currentUser.avatar,
      sellerPhone: currentUser.phone || '0912345678',
      createdAt: 'Vừa xong',
      status: 'available',
      viewsCount: 1,
      likesCount: 0,
    };

    setProducts(prev => [newProduct, ...prev]);

    // If it's a free giveaway (0đ), increase user sharing points & award Golden Heart Badge
    if (newProduct.isFreeGiveaway || newProduct.price === 0) {
      const newPoints = currentUser.sharingPoints + 25;
      updateUser(currentUser.id, {
        sharingPoints: newPoints,
        goldHeartBadge: newPoints >= 50,
      });
      triggerCelebration();
    }
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    if (selectedProductDetail && selectedProductDetail.id === id) {
      setSelectedProductDetail(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    setCart(prev => prev.filter(c => c.product.id !== id));
    setWishlist(prev => prev.filter(pid => pid !== id));
    if (selectedProductDetail && selectedProductDetail.id === id) {
      setSelectedProductDetail(null);
    }
  };

  const toggleLikeProduct = (id: string) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        const isLiked = wishlist.includes(id);
        return {
          ...p,
          likesCount: isLiked ? Math.max(0, p.likesCount - 1) : p.likesCount + 1,
        };
      }
      return p;
    }));
    toggleWishlist(id);
  };

  // Location CRUD for Creator
  const addLocation = (loc: Omit<LocationArea, 'id'>) => {
    const newLoc: LocationArea = {
      ...loc,
      id: `loc-${Date.now()}`,
    };
    setLocations(prev => [...prev, newLoc]);
  };

  const updateLocation = (id: string, updates: Partial<LocationArea>) => {
    setLocations(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
  };

  const deleteLocation = (id: string) => {
    setLocations(prev => prev.filter(l => l.id !== id));
    if (selectedLocation === id) {
      setSelectedLocation(null);
    }
  };

  // Search History
  const addSearchHistory = (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    setSearchHistory(prev => {
      const filtered = prev.filter(item => item.toLowerCase() !== trimmed.toLowerCase());
      return [trimmed, ...filtered].slice(0, 10);
    });
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
  };

  const removeSearchHistoryItem = (itemToRemove: string) => {
    setSearchHistory(prev => prev.filter(item => item !== itemToRemove));
  };

  // Cart operations
  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item =>
      item.product.id === productId ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Orders
  const createOrder = (orderData: {
    items: { productId: string; quantity: number }[];
    paymentMethod: 'qr_bank' | 'cash_on_delivery';
    buyerLocation: string;
    buyerPhone: string;
    note?: string;
  }): Order => {
    const orderItems: Order['items'] = [];
    let total = 0;

    orderData.items.forEach(it => {
      const p = products.find(prod => prod.id === it.productId);
      if (p) {
        orderItems.push({
          productId: p.id,
          title: p.title,
          price: p.price,
          quantity: it.quantity,
          sellerId: p.sellerId,
          sellerName: p.sellerName,
          image: p.images[0] || '',
        });
        total += p.price * it.quantity;
      }
    });

    const newOrder: Order = {
      id: `LHU-${Date.now().toString().slice(-6)}`,
      items: orderItems,
      totalAmount: total,
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      buyerStudentId: currentUser.studentId,
      buyerPhone: orderData.buyerPhone || currentUser.phone || '0912345678',
      buyerLocation: orderData.buyerLocation,
      note: orderData.note,
      paymentMethod: orderData.paymentMethod,
      status: 'pending',
      qrTransactionId: `VNQR-${Date.now().toString().slice(-8)}`,
      bankAccountInfo: {
        bankName: 'BIDV Chi Nhánh Đồng Nai (LHU Student Pay)',
        accountNumber: '6701000123456',
        accountHolder: 'UNIMART LHU ESCROW',
      },
      createdAt: 'Vừa đặt hàng',
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    triggerCelebration();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  // Chat
  const startChatWithSeller = (product: Product) => {
    const existing = conversations.find(
      c => c.productId === product.id && c.buyerId === currentUser.id
    );

    if (existing) {
      setActiveConversation(existing);
      setIsChatOpen(true);
      return;
    }

    const newConv: ChatConversation = {
      id: `conv-${Date.now()}`,
      productId: product.id,
      productTitle: product.title,
      productPrice: product.price,
      productImage: product.images[0] || '',
      sellerId: product.sellerId,
      sellerName: product.sellerName,
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      messages: [
        {
          id: `msg-${Date.now()}`,
          senderId: currentUser.id,
          senderName: currentUser.name,
          text: `Chào bạn, mình là sinh viên LHU đang quan tâm đến món "${product.title}" này, bạn còn giữ không ạ?`,
          timestamp: 'Vừa xong',
        }
      ],
      lastUpdated: 'Vừa xong',
    };

    setConversations(prev => [newConv, ...prev]);
    setActiveConversation(newConv);
    setIsChatOpen(true);
  };

  const sendMessage = (conversationId: string, text: string, isOffer?: boolean, offerAmount?: number) => {
    const newMsg = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      text,
      timestamp: 'Vừa xong',
      isOffer,
      offerAmount,
    };

    setConversations(prev => prev.map(c => {
      if (c.id === conversationId) {
        return {
          ...c,
          messages: [...c.messages, newMsg],
          lastUpdated: 'Vừa xong',
        };
      }
      return c;
    }));

    if (activeConversation && activeConversation.id === conversationId) {
      setActiveConversation(prev => prev ? {
        ...prev,
        messages: [...prev.messages, newMsg],
      } : null);
    }
  };

  // Reviews & Reports
  const addReview = (revData: Omit<Review, 'id' | 'createdAt'>) => {
    const newRev: Review = {
      ...revData,
      id: `rev-${Date.now()}`,
      createdAt: 'Vừa đánh giá',
    };
    setReviews(prev => [newRev, ...prev]);
  };

  const submitReport = (reportData: Omit<ViolationReport, 'id' | 'createdAt' | 'status'>) => {
    const newReport: ViolationReport = {
      ...reportData,
      id: `rep-${Date.now()}`,
      status: 'pending',
      createdAt: 'Vừa gửi',
    };
    setReports(prev => [newReport, ...prev]);
  };

  // SMART SEARCH ENGINE WITH SYNONYM & MULTI-TIER RECOGNITION
  // Maps user keywords to corresponding item classes:
  // e.g., "tủ áo" -> ["tủ áo", "tủ", "quần áo", "áo", "móc treo"]
  // e.g., "giày" -> ["giày", "sandal", "dép", "sneaker"]
  // e.g., "sách" -> ["sách", "giáo trình", "vở", "ôn thi"]
  // e.g., "quạt" -> ["quạt", "quạt mini", "quạt để bàn"]
  // e.g., "nồi" -> ["nồi", "nồi cơm", "ấm siêu tốc"]
  // e.g., "máy tính" -> ["máy tính", "casio", "chuột", "laptop", "giá đỡ"]
  const filteredProducts = products.filter(product => {
    // Location filter
    if (selectedLocation && product.locationId !== selectedLocation) {
      return false;
    }

    // Category filter
    if (selectedCategory) {
      if (selectedCategory === 'free_giveaway') {
        if (!product.isFreeGiveaway && product.price > 0) return false;
      } else if (product.categoryId !== selectedCategory) {
        return false;
      }
    }

    // NavTab filter
    if (activeNavTab === 'giveaway') {
      if (!product.isFreeGiveaway && product.price > 0) return false;
    } else if (activeNavTab === 'wishlist') {
      if (!wishlist.includes(product.id)) return false;
    }

    // Text search query
    if (!searchQuery.trim()) {
      return true;
    }

    const queryClean = searchQuery.toLowerCase().trim();
    const queryNoAccents = removeAccents(queryClean);

    // Expand query with smart student synonyms
    const searchTerms = [queryClean, queryNoAccents];

    // Check smart synonyms mapping
    if (queryNoAccents.includes('tu ao') || queryNoAccents.includes('tủ áo')) {
      searchTerms.push('quần áo', 'quan ao', 'tủ nhựa', 'tu nhua', 'móc treo', 'moc treo', 'tủ', 'tu');
    }
    if (queryNoAccents.includes('giay') || queryNoAccents.includes('giày')) {
      searchTerms.push('giày dép', 'giay dep', 'sneaker', 'sandal', 'dép', 'dep', 'thể thao');
    }
    if (queryNoAccents.includes('sach') || queryNoAccents.includes('sách')) {
      searchTerms.push('giáo trình', 'giao trinh', 'vở', 'vo', 'đại số', 'giải tích', 'toeic', 'tài liệu');
    }
    if (queryNoAccents.includes('quat') || queryNoAccents.includes('quạt')) {
      searchTerms.push('quạt mini', 'quat mini', 'quạt để bàn', 'phòng trọ');
    }
    if (queryNoAccents.includes('noi') || queryNoAccents.includes('nồi')) {
      searchTerms.push('nồi cơm điện', 'noi com', 'ấm siêu tốc', 'am sieu toc', 'bếp');
    }
    if (queryNoAccents.includes('may tinh') || queryNoAccents.includes('máy tính')) {
      searchTerms.push('casio', 'chuột', 'chuot', 'laptop', 'giá đỡ', 'bàn phím');
    }

    const titleClean = product.title.toLowerCase();
    const titleNoAccents = removeAccents(titleClean);
    const descClean = product.description.toLowerCase();
    const descNoAccents = removeAccents(descClean);
    const tagsClean = product.tags.map(t => t.toLowerCase()).join(' ');
    const tagsNoAccents = removeAccents(tagsClean);

    return searchTerms.some(term => {
      return (
        titleClean.includes(term) ||
        titleNoAccents.includes(term) ||
        descClean.includes(term) ||
        descNoAccents.includes(term) ||
        tagsClean.includes(term) ||
        tagsNoAccents.includes(term)
      );
    });
  });

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        setCurrentUser,
        addUser,
        updateUser,
        deleteUser,
        switchUser,
        language,
        setLanguage,
        t,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleLikeProduct,
        categories,
        locations,
        addLocation,
        updateLocation,
        deleteLocation,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedLocation,
        setSelectedLocation,
        searchHistory,
        addSearchHistory,
        clearSearchHistory,
        removeSearchHistoryItem,
        filteredProducts,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        orders,
        createOrder,
        updateOrderStatus,
        wishlist,
        toggleWishlist,
        conversations,
        activeConversation,
        setActiveConversation,
        sendMessage,
        startChatWithSeller,
        reviews,
        addReview,
        reports,
        submitReport,
        isSidebarOpen,
        setIsSidebarOpen,
        isCreateProductOpen,
        setIsCreateProductOpen,
        editingProduct,
        setEditingProduct,
        isCartOpen,
        setIsCartOpen,
        isChatOpen,
        setIsChatOpen,
        isAccountManagerOpen,
        setIsAccountManagerOpen,
        isManageLocationsOpen,
        setIsManageLocationsOpen,
        isAppQrOpen,
        setIsAppQrOpen,
        isCameraSearchOpen,
        setIsCameraSearchOpen,
        isReportOpen,
        setIsReportOpen,
        reportingTarget,
        setReportingTarget,
        selectedProductDetail,
        setSelectedProductDetail,
        activeNavTab,
        setActiveNavTab,
        triggerCelebration,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
