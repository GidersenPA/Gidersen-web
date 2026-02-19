import React, { useState, useEffect, useMemo } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { 
  MapPin, 
  Phone, 
  ShoppingBag, 
  Store, 
  Search, 
  ChevronRight, 
  PlusCircle, 
  LayoutDashboard, 
  LogOut,
  Info,
  CheckCircle2,
  TrendingDown,
  Clock,
  Heart,
  User,
  Menu,
  X,
  Navigation,
  Globe,
  Map as MapIcon,
  List as ListIcon,
  ShieldCheck,
  Zap,
  Smile
} from 'lucide-react';

// Varsayılan sloganlar (ağ hatasında fallback)
const DEFAULT_SLOGANS = [
  "Gidersen Daha Ucuz",
  "Gidersen Daha Hızlı",
  "Gidersen Daha Mutlu",
  "Gidersen Doğru Ürün"
];

const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: "Logitech MX Master 3S Mouse",
    firm: "Teknoloji Dünyası",
    marketplacePrice: 4200,
    gidersenPrice: 3500,
    location: "Kadıköy, İstanbul",
    category: "Elektronik",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop",
    lat: 40.99, lng: 29.02
  },
  {
    id: 2,
    name: "Espresso Kahve Makinesi",
    firm: "Mutfak Gereçleri A.Ş.",
    marketplacePrice: 12500,
    gidersenPrice: 10800,
    location: "Çankaya, Ankara",
    category: "Ev Aletleri",
    image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400&h=300&fit=crop",
    lat: 39.92, lng: 32.85
  },
  {
    id: 3,
    name: "Ortopedik Ofis Koltuğu",
    firm: "Mobilya Trend",
    marketplacePrice: 6800,
    gidersenPrice: 5900,
    location: "Nilüfer, Bursa",
    category: "Mobilya",
    image: "https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=400&h=300&fit=crop",
    lat: 40.22, lng: 28.94
  }
];

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Sloganlar: public/content/slogans.json'dan runtime çekilir.
  const [slogans, setSlogans] = useState(DEFAULT_SLOGANS);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showMapView, setShowMapView] = useState(false);
  
  // Firma Auth State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [firmInfo, setFirmInfo] = useState(null);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'

  useEffect(() => {
    // Sloganları build/deploy gerektirmeden güncelleyebilmek için runtime çekiyoruz.
    // Sunucuda sadece public/content/slogans.json dosyasını değiştirmen yeterli.
    fetch('/content/slogans.json', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('Slogans fetch failed'))))
      .then((data) => {
        const list = Array.isArray(data?.slogans) ? data.slogans.filter(Boolean) : null;
        if (list && list.length > 0) setSlogans(list);
      })
      .catch(() => {
        // Sessiz fallback
      });
  }, []);

  // Not: Slogan rotasyonu App seviyesinde state güncellediğinde tüm ekran yeniden render olur.
  // Bunu önlemek için rotasyonu sadece Hero içindeki küçük bir bileşene taşıyoruz.

  const RotatingSlogan = React.memo(function RotatingSlogan({ items, intervalMs = 3000 }) {
    const safeItems = Array.isArray(items) && items.length > 0 ? items : DEFAULT_SLOGANS;
    const [idx, setIdx] = useState(0);

    // items değişirse index'i sıfırla
    useEffect(() => {
      setIdx(0);
    }, [safeItems.join('|')]);

    useEffect(() => {
      const timer = setInterval(() => {
        setIdx((prev) => (prev + 1) % safeItems.length);
      }, intervalMs);
      return () => clearInterval(timer);
    }, [safeItems.length, intervalMs]);

    return (
      <span
        key={safeItems[idx]}
        className="inline-block animate-in fade-in duration-300"
      >
        {safeItems[idx]}
      </span>
    );
  });

  const activePath = location.pathname;
  const activeView = useMemo(() => {
    if (activePath.startsWith('/how-it-works')) return 'how-it-works';
    if (activePath.startsWith('/products')) return 'products';
    if (activePath.startsWith('/product/')) return 'product-detail';
    if (activePath.startsWith('/firm')) return 'firm-portal';
    return 'home';
  }, [activePath]);

  const navigateTo = (newView, data = null) => {
    if (data) setSelectedProduct(data);

    const targetPath = (() => {
      switch (newView) {
        case 'home':
          return '/';
        case 'products':
          return '/products';
        case 'how-it-works':
          return '/how-it-works';
        case 'firm-portal':
          return '/firm';
        case 'product-detail':
          return data?.id ? `/product/${data.id}` : '/products';
        default:
          return '/';
      }
    })();

    navigate(targetPath);
    window.scrollTo(0, 0);
    setIsMenuOpen(false);
  };

  const handleAddProduct = (newProduct) => {
    setProducts([
      ...products, 
      { ...newProduct, id: Date.now(), firm: firmInfo.name, location: firmInfo.location }
    ]);
    navigate('/firm');
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoggedIn(true);
    setFirmInfo({ name: "Örnek Teknoloji", location: "Beşiktaş, İstanbul" });
    navigate('/firm');
  };

  // Logo Bileşeni
  const Logo = () => (
    <div className="flex items-center gap-2 cursor-pointer group" onClick={() => navigateTo('home')}>
      <div className="bg-orange-600 p-2 rounded-lg transition-transform group-hover:scale-110">
        <MapPin className="text-white w-6 h-6" />
      </div>
      <span className="text-2xl font-black tracking-tighter text-slate-800">
        gidersen<span className="text-orange-600">.com</span>
      </span>
    </div>
  );

  // --- SAYFA BİLEŞENLERİ ---

  const HomePage = () => (
    <div className="animate-in fade-in duration-500">
      {/* Hero Section */}
      <section className="bg-white pt-16 pb-20 px-4 border-b">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full bg-orange-100 text-orange-700 text-sm font-bold">
            <Zap className="w-4 h-4" /> Gidersen Kazanırsın
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tight">
            <RotatingSlogan items={slogans} />
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Pazar yeri komisyonlarını ve kargo maliyetlerini sıfırlayın. 
            Doğrudan satıcıya ulaşın, daha az ödeyin.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
            <button 
              onClick={() => navigateTo('products')}
              className="bg-orange-600 text-white px-10 py-4 rounded-2xl font-black shadow-xl hover:bg-orange-700 transition-all flex items-center justify-center gap-2"
            >
              Fırsatları Gör <ChevronRight className="w-5 h-5" />
            </button>
            <button 
              onClick={() => navigateTo('how-it-works')}
              className="bg-slate-100 text-slate-700 px-10 py-4 rounded-2xl font-black hover:bg-slate-200 transition-all"
            >
              Nasıl Çalışır?
            </button>
          </div>
        </div>
      </section>

      {/* Popüler Ürünler Ön İzleme */}
      <section className="max-w-6xl mx-auto py-20 px-4">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-black text-slate-900">Günün Fırsatları</h2>
          <button onClick={() => navigateTo('products')} className="text-orange-600 font-bold hover:underline">Tümünü İncele</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.slice(0, 3).map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );

  const HowItWorksPage = () => (
    <div className="max-w-6xl mx-auto py-16 px-4 animate-in fade-in duration-700">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-black mb-4">Sistem Nasıl İşler?</h1>
        <p className="text-slate-500 text-lg">Hem kullanıcı hem firma için kazan-kazan modeli.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* Kullanıcı İçin */}
        <div className="space-y-8">
          <div className="bg-orange-50 p-8 rounded-3xl border border-orange-100">
            <h2 className="text-2xl font-black text-orange-700 mb-6 flex items-center gap-2">
              <User className="w-6 h-6" /> Tüketiciler İçin
            </h2>
            <div className="space-y-6">
              {[
                { title: "Ürünü Bul", desc: "Aradığın ürünü gidersen.com üzerinden ara ve en iyi 'Gidersen' fiyatını bul." },
                { title: "Mağazayı Seç", desc: "Sana en yakın veya en uygun fiyatlı mağazanın konumuna bak." },
                { title: "Git veya Ara", desc: "İster fiziksel lokasyona git, ister telefonla sipariş vererek komisyonsuz al." },
                { title: "Tasarruf Et", desc: "Kargo ve platform komisyonu ödemeden %20'ye varan indirimle alışverişini tamamla." }
              ].map((step, i) => (
                <div key={i} className="flex gap-4">
                  <div className="bg-orange-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">{i+1}</div>
                  <div>
                    <h4 className="font-bold text-slate-800">{step.title}</h4>
                    <p className="text-slate-600 text-sm">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Firma İçin */}
        <div className="space-y-8">
          <div className="bg-slate-900 p-8 rounded-3xl text-white">
            <h2 className="text-2xl font-black text-orange-500 mb-6 flex items-center gap-2">
              <Store className="w-6 h-6" /> Satıcılar İçin
            </h2>
            <div className="space-y-6">
              {[
                { title: "Ücretsiz Kaydol", desc: "Mağazanızı hemen oluşturun, herhangi bir listeleme ücreti ödemeyin." },
                { title: "Ürünlerini Ekle", desc: "Pazar yeri fiyatını ve müşterine sunacağın özel indirimli fiyatı gir." },
                { title: "Müşteri Gelsin", desc: "Müşteriler doğrudan mağazana gelsin veya seni telefonla arasın." },
                { title: "Nakiti Koru", desc: "Komisyon ödeme, kargo ile uğraşma. Satışın tamamı anında cebinde kalsın." }
              ].map((step, i) => (
                <div key={i} className="flex gap-4">
                  <div className="bg-orange-500 text-slate-900 w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">{i+1}</div>
                  <div>
                    <h4 className="font-bold text-white">{step.title}</h4>
                    <p className="text-slate-400 text-sm">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const ProductListingPage = () => (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-black">Tüm Ürünler</h2>
          <p className="text-slate-500">Bulunduğun bölgedeki en iyi fırsatlar</p>
        </div>
        
        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200">
          <button 
            onClick={() => setShowMapView(false)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${!showMapView ? 'bg-orange-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <ListIcon className="w-4 h-4" /> Liste
          </button>
          <button 
            onClick={() => setShowMapView(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${showMapView ? 'bg-orange-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <MapIcon className="w-4 h-4" /> Harita
          </button>
        </div>
      </div>

      {showMapView ? (
        <div className="bg-slate-200 rounded-3xl h-[600px] relative overflow-hidden flex items-center justify-center border-4 border-white shadow-2xl">
          {/* Mock Map Representation */}
          <div className="absolute inset-0 bg-[#e5e7eb] opacity-50" style={{ backgroundImage: 'radial-gradient(#9ca3af 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          <div className="relative z-10 text-center p-8">
            <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl max-w-sm">
              <MapIcon className="w-12 h-12 text-orange-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Harita Görünümü Aktif</h3>
              <p className="text-slate-600 text-sm mb-4">Gerçek harita entegrasyonu için konum izni verin.</p>
              <div className="space-y-2">
                {products.map(p => (
                  <div key={p.id} className="bg-white p-3 rounded-xl border flex items-center gap-3 text-left">
                    <img src={p.image} className="w-10 h-10 rounded-lg object-cover" />
                    <div className="flex-1">
                      <p className="text-xs font-bold truncate">{p.name}</p>
                      <p className="text-[10px] text-orange-600 font-black">{p.gidersenPrice} ₺</p>
                    </div>
                    <MapPin className="w-4 h-4 text-orange-600" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Mock Pins */}
          <div className="absolute top-1/4 left-1/3 animate-bounce"><MapPin className="text-orange-600 w-8 h-8 fill-orange-600/20" /></div>
          <div className="absolute top-1/2 left-2/3 animate-bounce" style={{animationDelay: '0.2s'}}><MapPin className="text-orange-600 w-8 h-8 fill-orange-600/20" /></div>
          <div className="absolute bottom-1/3 left-1/2 animate-bounce" style={{animationDelay: '0.5s'}}><MapPin className="text-orange-600 w-8 h-8 fill-orange-600/20" /></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );

  const FirmPortal = () => {
    if (isLoggedIn) return (
      <div className="max-w-6xl mx-auto py-12 px-4">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
          <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
            <div>
              <p className="text-orange-500 font-bold text-sm uppercase tracking-widest">Mağaza Paneli</p>
              <h2 className="text-3xl font-black">{firmInfo?.name}</h2>
              <div className="flex items-center gap-2 text-slate-400 text-sm mt-1">
                <MapPin className="w-4 h-4" /> {firmInfo?.location}
              </div>
            </div>
            <button 
              onClick={() => setIsLoggedIn(false)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <LogOut className="w-6 h-6" />
            </button>
          </div>

          <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Ürün Ekle Formu */}
            <div className="lg:col-span-1 space-y-6">
              <div className="p-6 rounded-2xl border-2 border-dashed border-slate-200">
                <h3 className="font-black text-xl mb-6 flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-orange-600" /> Yeni İlan
                </h3>
                <form className="space-y-4" onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  handleAddProduct({
                    name: formData.get('name'),
                    category: formData.get('category'),
                    marketplacePrice: Number(formData.get('marketPrice')),
                    gidersenPrice: Number(formData.get('gidersenPrice')),
                    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop"
                  });
                }}>
                  <input name="name" placeholder="Ürün Adı" required className="w-full px-4 py-3 rounded-xl border border-slate-200" />
                  <select name="category" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white">
                    <option>Elektronik</option>
                    <option>Moda</option>
                    <option>Ev & Yaşam</option>
                  </select>
                  <input name="marketPrice" type="number" placeholder="Pazar Yeri Fiyatı (₺)" required className="w-full px-4 py-3 rounded-xl border border-slate-200" />
                  <input name="gidersenPrice" type="number" placeholder="Gidersen Fiyatı (₺)" required className="w-full px-4 py-3 rounded-xl border-2 border-orange-500" />
                  <button type="submit" className="w-full bg-orange-600 text-white py-4 rounded-xl font-black hover:bg-orange-700 transition-all">
                    İlanı Yayınla
                  </button>
                </form>
              </div>
            </div>

            {/* Mevcut Ürünler */}
            <div className="lg:col-span-2">
              <h3 className="font-black text-xl mb-6">Yayındaki İlanlarınız</h3>
              <div className="space-y-4">
                {products.filter(p => p.firm === firmInfo.name).map(p => (
                  <div key={p.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-orange-200 transition-all">
                    <div className="flex items-center gap-4">
                      <img src={p.image} className="w-16 h-16 rounded-xl object-cover" />
                      <div>
                        <h4 className="font-bold text-slate-800">{p.name}</h4>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-slate-400 line-through">{p.marketplacePrice} ₺</span>
                          <span className="text-sm font-black text-orange-600">{p.gidersenPrice} ₺</span>
                        </div>
                      </div>
                    </div>
                    <button className="text-red-500 font-bold text-sm hover:underline">Sil</button>
                  </div>
                ))}
                {products.filter(p => p.firm === firmInfo.name).length === 0 && (
                  <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                    <p className="text-slate-400">Henüz bir ürününüz yok.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );

    return (
      <div className="max-w-md mx-auto py-20 px-4 animate-in zoom-in duration-300">
        <div className="bg-white p-8 rounded-3xl shadow-2xl border border-slate-100">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Store className="w-8 h-8 text-orange-600" />
            </div>
            <h2 className="text-3xl font-black">{authMode === 'login' ? 'Mağaza Girişi' : 'Hemen Kayıt Ol'}</h2>
            <p className="text-slate-500 mt-2">{authMode === 'login' ? 'Paneline erişmek için giriş yap.' : 'Satışlarını artırmaya bugün başla.'}</p>
          </div>

          <form className="space-y-4" onSubmit={handleLogin}>
            {authMode === 'register' && (
              <input type="text" placeholder="Mağaza Adı" className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none" required />
            )}
            <input type="email" placeholder="E-posta Adresi" className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none" required />
            <input type="password" placeholder="Şifre" className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none" required />
            
            <button type="submit" className="w-full bg-orange-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-orange-200 hover:bg-orange-700 transition-all mt-4">
              {authMode === 'login' ? 'Giriş Yap' : 'Kaydı Tamamla'}
            </button>
          </form>

          <div className="text-center mt-8 pt-6 border-t border-slate-100">
            <button 
              onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
              className="text-orange-600 font-bold hover:underline"
            >
              {authMode === 'login' ? 'Yeni mağaza oluştur' : 'Zaten hesabım var'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ProductCard = ({ product }) => (
    <div 
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-100 cursor-pointer group"
      onClick={() => navigateTo('product-detail', product)}
    >
      <div className="relative h-48 overflow-hidden">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur px-2.5 py-1 rounded-lg text-xs font-black text-orange-600 shadow-sm border border-orange-100">
          %{Math.round((1 - product.gidersenPrice / product.marketplacePrice) * 100)} Kazanç
        </div>
      </div>
      <div className="p-4">
        <p className="text-[10px] font-bold text-orange-500 uppercase tracking-tighter mb-1">{product.firm}</p>
        <h3 className="font-bold text-slate-800 mb-1 line-clamp-1">{product.name}</h3>
        <div className="flex items-center gap-1 text-slate-400 text-[10px] mb-3">
          <MapPin className="w-3 h-3" /> {product.location}
        </div>
        <div className="flex flex-col gap-1 border-t pt-3">
          <div className="flex justify-between items-center text-[10px]">
            <span className="text-slate-400">Pazar Yeri</span>
            <span className="text-slate-400 line-through">{product.marketplacePrice.toLocaleString()} ₺</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs font-black text-slate-800">Gidersen</span>
            <span className="text-xl font-black text-orange-600">{product.gidersenPrice.toLocaleString()} ₺</span>
          </div>
        </div>
      </div>
    </div>
  );

  const ProductDetailPage = () => {
    const { id } = useParams();
    const productFromList = useMemo(() => {
      const numId = Number(id);
      return products.find((p) => p.id === numId) || null;
    }, [products, id]);

    const product = selectedProduct || productFromList;

    useEffect(() => {
      if (!selectedProduct && productFromList) setSelectedProduct(productFromList);
    }, [selectedProduct, productFromList]);

    if (!product) {
      return (
        <div className="max-w-6xl mx-auto py-12 px-4">
          <div className="bg-white p-10 rounded-3xl border border-slate-100 shadow-sm">
            <h1 className="text-2xl font-black mb-2">Ürün bulunamadı</h1>
            <p className="text-slate-500 mb-6">Ürün kaldırılmış olabilir veya bağlantı hatalı olabilir.</p>
            <button onClick={() => navigateTo('products')} className="bg-orange-600 text-white px-6 py-3 rounded-2xl font-black">
              Ürünlere dön
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-6xl mx-auto py-12 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <button onClick={() => navigateTo('products')} className="flex items-center gap-2 text-slate-500 hover:text-orange-600 mb-8 font-bold">
          <ChevronRight className="w-4 h-4 rotate-180" /> Ürünlere Dön
        </button>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white p-8 rounded-[2.5rem] shadow-2xl border border-slate-100">
          <img src={product.image} alt={product.name} className="w-full aspect-square object-cover rounded-3xl shadow-inner border" />
          <div>
            <div className="flex items-center gap-2 text-orange-600 font-black text-sm uppercase mb-2">
              <ShieldCheck className="w-4 h-4" /> Onaylı Satıcı: {product.firm}
            </div>
            <h1 className="text-4xl font-black text-slate-900 mb-6">{product.name}</h1>

            <div className="bg-slate-50 p-6 rounded-3xl mb-8 space-y-4">
              <div className="flex justify-between items-center text-slate-400">
                <span className="font-bold">Pazar Yeri Fiyatı</span>
                <span className="text-xl line-through">{product.marketplacePrice.toLocaleString()} ₺</span>
              </div>
              <div className="flex justify-between items-center bg-white p-6 rounded-2xl border-2 border-orange-500 shadow-sm shadow-orange-100">
                <div>
                  <span className="text-sm font-black text-orange-800 uppercase block mb-1">Gidersen Fiyatı</span>
                  <span className="text-5xl font-black text-orange-600">{product.gidersenPrice.toLocaleString()} ₺</span>
                </div>
                <div className="text-right">
                  <span className="bg-orange-600 text-white px-4 py-2 rounded-full font-black text-sm">-%{Math.round((1 - product.gidersenPrice / product.marketplacePrice) * 100)}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <button className="flex items-center justify-center gap-2 bg-slate-900 text-white py-5 rounded-2xl font-black hover:bg-slate-800 shadow-xl transition-all">
                <MapPin className="w-5 h-5" /> Yol Tarifi
              </button>
              <button className="flex items-center justify-center gap-2 border-2 border-slate-200 py-5 rounded-2xl font-black hover:bg-slate-50 transition-all">
                <Phone className="w-5 h-5" /> Satıcıyı Ara
              </button>
            </div>

            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-2xl text-blue-800 border border-blue-100">
              <Info className="w-5 h-5 flex-shrink-0 mt-1" />
              <p className="text-sm leading-relaxed"><strong>Dikkat:</strong> Bu indirim sadece fiziksel mağazada elden alımlarda veya satıcıyla doğrudan kurulan telefon iletişiminde geçerlidir.</p>
            </div>
          </div>
        </div>
      </div>
    );
  };



  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Logo />
          
          <div className="hidden md:flex items-center gap-8">
            {['how-it-works', 'products'].map(item => (
              <button 
                key={item}
                onClick={() => navigateTo(item)}
                className={`font-bold transition-colors ${activeView === item ? 'text-orange-600' : 'text-slate-500 hover:text-orange-600'}`}
              >
                {item === 'how-it-works' ? 'Nasıl Çalışır?' : 'Ürünler'}
              </button>
            ))}
            <div className="h-6 w-[1px] bg-slate-200" />
            <button 
              onClick={() => navigateTo('firm-portal')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black transition-all ${activeView === 'firm-portal' ? 'bg-slate-900 text-white' : 'bg-orange-600 text-white hover:bg-orange-700 shadow-lg shadow-orange-200'}`}
            >
              <Store className="w-4 h-4" /> {isLoggedIn ? 'Panel' : 'Mağaza Girişi'}
            </button>
          </div>

          <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white border-b shadow-2xl p-6 flex flex-col gap-4 animate-in slide-in-from-top-2">
            <button onClick={() => navigateTo('how-it-works')} className="text-left font-black text-lg py-2">Nasıl Çalışır?</button>
            <button onClick={() => navigateTo('products')} className="text-left font-black text-lg py-2">Ürünleri Keşfet</button>
            <button onClick={() => navigateTo('firm-portal')} className="bg-slate-900 text-white p-4 rounded-2xl font-black flex items-center justify-center gap-2">
              <Store className="w-5 h-5" /> {isLoggedIn ? 'Mağaza Paneli' : 'Mağaza Girişi'}
            </button>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="min-h-[70vh]">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/products" element={<ProductListingPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/firm" element={<FirmPortal />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white pt-20 pb-10 px-4 mt-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <Logo />
            <p className="text-slate-400 text-sm mt-6 leading-relaxed">
              "Gidersen Daha Ucuz" felsefesiyle, aracıları ortadan kaldırarak hem satıcıya hem tüketiciye kazandırıyoruz.
            </p>
          </div>
          <div>
            <h4 className="font-black text-lg mb-6 text-orange-500">Kullanıcı</h4>
            <ul className="text-slate-400 text-sm space-y-3 font-medium">
              <li className="hover:text-white cursor-pointer" onClick={() => navigateTo('how-it-works')}>Nasıl Çalışır?</li>
              <li className="hover:text-white cursor-pointer" onClick={() => navigateTo('products')}>Fırsatları Keşfet</li>
              <li className="hover:text-white cursor-pointer">Sıkça Sorulan Sorular</li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-lg mb-6 text-orange-500">Firma</h4>
            <ul className="text-slate-400 text-sm space-y-3 font-medium">
              <li className="hover:text-white cursor-pointer" onClick={() => navigateTo('firm-portal')}>Mağaza Kaydı</li>
              <li className="hover:text-white cursor-pointer" onClick={() => navigateTo('firm-portal')}>Ürün Yönetimi</li>
              <li className="hover:text-white cursor-pointer">Ücretler & Komisyonlar</li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-lg mb-6 text-orange-500">Destek</h4>
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-orange-600 transition-colors cursor-pointer">
                <Globe className="w-5 h-5" />
              </div>
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-orange-600 transition-colors cursor-pointer">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-orange-600 transition-colors cursor-pointer">
                <Smile className="w-5 h-5" />
              </div>
            </div>
            <p className="text-slate-500 text-xs mt-6">7/24 Firma ve Kullanıcı Destek Hattı</p>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-20 pt-8 border-t border-white/5 text-center text-slate-500 text-xs font-bold">
          © 2024 gidersen.com - Yerel Esnafın ve Akıllı Tüketicinin Buluşma Noktası.
        </div>
      </footer>
    </div>
  );
};

export default App;

