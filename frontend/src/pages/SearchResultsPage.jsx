import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// ===== DUMMY DATA =====
const mealData = {
  maps: [
    { id: 1, name: 'Punjabi Dhaba', address: 'Sector 18, Noida', rating: '4.3', reviews: '1.2k', open: true, image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=100&h=100&fit=crop' },
    { id: 2, name: 'Spice Garden', address: 'CP, New Delhi', rating: '4.1', reviews: '890', open: true, image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=100&h=100&fit=crop' },
    { id: 3, name: 'Biryani House', address: 'Lajpat Nagar', rating: '4.5', reviews: '2.1k', open: false, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=100&h=100&fit=crop' },
  ],
  images: [
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=150&fit=crop',
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=200&h=150&fit=crop',
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=150&fit=crop',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&h=150&fit=crop',
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=150&fit=crop',
  ],
  links: [
    { id: 1, title: 'Order Meal Online — Winkget Food', url: 'winkget.com/food', desc: 'Order from 500+ restaurants near you. Fast delivery, live tracking, and exclusive deals on every meal.' },
    { id: 2, title: 'Best Meal Deals Today — Winkget Food', url: 'winkget.com/food/deals', desc: 'Get up to 50% off on your first meal order. Use code WINK50 at checkout.' },
    { id: 3, title: 'Meal Subscription Plans — Winkget Food', url: 'winkget.com/food/plans', desc: 'Subscribe to weekly meal plans starting at ₹999. Healthy, fresh, and delivered daily.' },
  ],
  cards: [
    { id: 1, name: 'Butter Chicken Thali', restaurant: 'Punjabi Dhaba', price: '₹249', rating: '4.4 ⭐', time: '30 min', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=300&h=200&fit=crop' },
    { id: 2, name: 'Veg Biryani', restaurant: 'Biryani House', price: '₹199', rating: '4.2 ⭐', time: '25 min', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&h=200&fit=crop' },
    { id: 3, name: 'Paneer Pizza', restaurant: 'Pizza Palace', price: '₹349', rating: '4.6 ⭐', time: '40 min', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&h=200&fit=crop' },
    { id: 4, name: 'Masala Dosa', restaurant: 'South Spice', price: '₹149', rating: '4.3 ⭐', time: '20 min', image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300&h=200&fit=crop' },
  ],
};

const jobData = {
  links: [
    { id: 1, title: 'Latest Jobs 2025 — Winkget Jobs', url: 'winkget.com/jobs', desc: 'Find 10,000+ jobs across India. IT, Marketing, Finance, and more. Apply in one click.' },
    { id: 2, title: 'Work From Home Jobs — Winkget Jobs', url: 'winkget.com/jobs/wfh', desc: 'Remote jobs hiring now. Flexible hours, competitive salary, top companies.' },
  ],
  cards: [
    { id: 1, title: 'React Developer', company: 'TechCorp India', salary: '₹8-12 LPA', location: 'Delhi NCR', type: 'Full Time', image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=300&h=200&fit=crop' },
    { id: 2, title: 'UI/UX Designer', company: 'DesignHub', salary: '₹6-9 LPA', location: 'Bangalore', type: 'Remote', image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=300&h=200&fit=crop' },
    { id: 3, title: 'Backend Engineer', company: 'StartupXYZ', salary: '₹10-15 LPA', location: 'Pune', type: 'Hybrid', image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&h=200&fit=crop' },
  ],
};

const defaultData = {
  links: [
    { id: 1, title: 'Search Results — Winkget', url: 'winkget.com/search', desc: 'Find anything on Winkget — products, food, jobs, legal services, real estate and more.' },
    { id: 2, title: 'Winkget Platform — All Services', url: 'winkget.com', desc: 'Indias super app for everything. Shop, eat, work, and grow with Winkget.' },
  ],
};

// ===== DETECT TEMPLATE =====
const getTemplate = (q) => {
  const query = q.toLowerCase();
  if (['meal', 'food', 'restaurant', 'eat', 'pizza', 'biryani', 'lunch', 'dinner'].some(k => query.includes(k))) return 'meal';
  if (['job', 'jobs', 'career', 'hiring', 'work', 'salary', 'developer'].some(k => query.includes(k))) return 'job';
  return 'default';
};

function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [newQuery, setNewQuery] = useState('');
  const [template, setTemplate] = useState('default');
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const q = searchParams.get('q') || '';
    setQuery(q);
    setNewQuery(q);
    setTemplate(getTemplate(q));
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (newQuery.trim()) navigate(`/search?q=${newQuery}`);
  };

  const getInitial = () => user?.firstName?.[0]?.toUpperCase() || '?';

  return (
    <div style={styles.page} onClick={() => setShowMenu(false)}>

      {/* ===== TOP BAR ===== */}
      <div style={styles.topBar}>
        <h1 style={styles.logo} onClick={() => navigate('/')}>
          <span style={{ color: '#4F46E5' }}>Wink</span>
          <span style={{ color: '#7C3AED' }}>get</span>
        </h1>

        <form onSubmit={handleSearch} style={styles.searchForm}>
          <div style={styles.searchBox}>
            <span style={styles.icon}>🔍</span>
            <input
              type="text"
              value={newQuery}
              onChange={(e) => setNewQuery(e.target.value)}
              style={styles.input}
              placeholder="Search Winkget..."
            />
            {newQuery && <span onClick={() => setNewQuery('')} style={styles.clear}>✕</span>}
          </div>
        </form>

        <div style={styles.navRight} onClick={(e) => e.stopPropagation()}>
          {user ? (
            <div style={styles.avatarWrap}>
              <div style={styles.avatar} onClick={() => setShowMenu(!showMenu)}>{getInitial()}</div>
              {showMenu && (
                <div style={styles.dropdown}>
                  <div style={styles.emailTop}>
                    <span>{user.email}</span>
                    <span style={styles.closeBtn} onClick={() => setShowMenu(false)}>✕</span>
                  </div>
                  <div style={styles.profileSection}>
                    <div style={styles.bigAvatar}>{getInitial()}</div>
                    <div style={styles.hiText}>Hi, {user.firstName}!</div>
                    <button style={styles.manageBtn}>Manage your Winkget Account</button>
                  </div>
                  <div style={styles.divider} />
                  <div style={styles.menuItem}>🕐 Search History</div>
                  <div style={styles.menuItem}>🔖 Saves & Bookmarks</div>
                  <div style={styles.menuItem}>⚙️ Settings</div>
                  <div style={styles.menuItem}>💼 Switch to Business</div>
                  <div style={styles.divider} />
                  <div style={{ ...styles.menuItem, color: '#DC2626' }} onClick={() => { logout(); navigate('/'); }}>🚪 Sign Out</div>
                </div>
              )}
            </div>
          ) : (
            <>
              <a href="/login" style={styles.loginLink}>Login</a>
              <a href="/register" style={styles.registerBtn}>Create Account</a>
            </>
          )}
        </div>
      </div>

      <div style={styles.dividerLine} />

      {/* ===== RESULTS AREA ===== */}
      <div style={styles.resultsArea}>
        <p style={styles.resultCount}>Results for "<strong>{query}</strong>"</p>

        {/* ===== MEAL TEMPLATE ===== */}
        {template === 'meal' && (
          <>
            {/* Map Box */}
            <div style={styles.mapBox}>
              <div style={styles.mapHeader}>📍 Restaurants near you — Winkget Food</div>
              <div style={styles.mapPlaceholder}>
                🗺️ <span style={{color: '#6B7280', fontSize: '14px'}}>Map view — GPS se nearby restaurants dikhenge</span>
              </div>
              <div style={styles.mapCards}>
                {mealData.maps.map(r => (
                  <div key={r.id} style={styles.mapCard}>
                    <img src={r.image} alt={r.name} style={styles.mapCardImg} />
                    <div style={styles.mapCardInfo}>
                      <div style={styles.mapCardName}>{r.name}</div>
                      <div style={styles.mapCardAddr}>{r.address}</div>
                      <div style={styles.mapCardMeta}>
                        ⭐ {r.rating} · {r.reviews} reviews ·{' '}
                        <span style={{ color: r.open ? '#16A34A' : '#DC2626' }}>
                          {r.open ? 'Open' : 'Closed'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Image Strip */}
            <div style={styles.section}>
              <div style={styles.sectionTitle}>🖼️ Food Images</div>
              <div style={styles.imageStrip}>
                {mealData.images.map((img, i) => (
                  <img key={i} src={img} alt="food" style={styles.stripImage} />
                ))}
              </div>
            </div>

            {/* Links */}
            <div style={styles.section}>
              {mealData.links.map(link => (
                <div key={link.id} style={styles.linkResult}>
                  <div style={styles.linkUrl}>🌐 {link.url}</div>
                  <a href="#" style={styles.linkTitle}>{link.title}</a>
                  <p style={styles.linkDesc}>{link.desc}</p>
                </div>
              ))}
            </div>

            {/* Food Cards */}
            <div style={styles.section}>
              <div style={styles.sectionTitle}>🍔 Order Now — Winkget Food</div>
              <div style={styles.cardGrid}>
                {mealData.cards.map(item => (
                  <div key={item.id} style={styles.card}>
                    <img src={item.image} alt={item.name} style={styles.cardImg} />
                    <div style={styles.cardBody}>
                      <div style={styles.cardName}>{item.name}</div>
                      <div style={styles.cardSub}>{item.restaurant}</div>
                      <div style={styles.cardFooter}>
                        <span style={styles.cardPrice}>{item.price}</span>
                        <span style={styles.cardMeta}>{item.rating} · {item.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ===== JOB TEMPLATE ===== */}
        {template === 'job' && (
          <>
            <div style={styles.section}>
              {jobData.links.map(link => (
                <div key={link.id} style={styles.linkResult}>
                  <div style={styles.linkUrl}>🌐 {link.url}</div>
                  <a href="#" style={styles.linkTitle}>{link.title}</a>
                  <p style={styles.linkDesc}>{link.desc}</p>
                </div>
              ))}
            </div>

            <div style={styles.section}>
              <div style={styles.sectionTitle}>💼 Jobs on Winkget</div>
              <div style={styles.cardGrid}>
                {jobData.cards.map(job => (
                  <div key={job.id} style={styles.card}>
                    <img src={job.image} alt={job.title} style={styles.cardImg} />
                    <div style={styles.cardBody}>
                      <div style={styles.cardName}>{job.title}</div>
                      <div style={styles.cardSub}>{job.company} · {job.location}</div>
                      <div style={styles.cardFooter}>
                        <span style={styles.cardPrice}>{job.salary}</span>
                        <span style={styles.cardMeta}>{job.type}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ===== DEFAULT TEMPLATE ===== */}
        {template === 'default' && (
          <div style={styles.section}>
            {defaultData.links.map(link => (
              <div key={link.id} style={styles.linkResult}>
                <div style={styles.linkUrl}>🌐 {link.url}</div>
                <a href="#" style={styles.linkTitle}>{link.title}</a>
                <p style={styles.linkDesc}>{link.desc}</p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', backgroundColor: '#fff', fontFamily: 'Arial, sans-serif' },

  // TOP BAR
  topBar: { display: 'flex', alignItems: 'center', padding: '12px 24px', gap: '16px' },
  logo: { fontSize: '24px', fontWeight: '700', margin: 0, cursor: 'pointer', letterSpacing: '-1px', whiteSpace: 'nowrap' },
  searchForm: { flex: 1, maxWidth: '600px' },
  searchBox: { display: 'flex', alignItems: 'center', border: '1px solid #dfe1e5', borderRadius: '24px', padding: '10px 18px', boxShadow: '0 1px 6px rgba(32,33,36,.1)' },
  icon: { marginRight: '10px', fontSize: '16px', color: '#9aa0a6' },
  input: { flex: 1, border: 'none', outline: 'none', fontSize: '15px', color: '#202124' },
  clear: { cursor: 'pointer', color: '#9aa0a6', fontSize: '14px' },
  navRight: { marginLeft: 'auto', display: 'flex', gap: '14px', alignItems: 'center', position: 'relative' },
  loginLink: { textDecoration: 'none', color: '#202124', fontSize: '14px' },
  registerBtn: { textDecoration: 'none', backgroundColor: '#4F46E5', color: '#fff', padding: '8px 18px', borderRadius: '6px', fontSize: '14px' },
  avatarWrap: { position: 'relative' },
  avatar: { width: '36px', height: '36px', backgroundColor: '#4F46E5', borderRadius: '50%', color: '#fff', fontWeight: 'bold', fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },

  // DROPDOWN
  dropdown: { position: 'absolute', top: '44px', right: '0', backgroundColor: '#f8f9fa', border: '1px solid #e5e7eb', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.15)', width: '280px', zIndex: 200, overflow: 'hidden' },
  emailTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', fontSize: '13px', color: '#374151' },
  closeBtn: { cursor: 'pointer', color: '#6B7280' },
  profileSection: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 16px 20px' },
  bigAvatar: { width: '60px', height: '60px', backgroundColor: '#4F46E5', borderRadius: '50%', color: '#fff', fontWeight: 'bold', fontSize: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' },
  hiText: { fontSize: '17px', fontWeight: '500', color: '#111827', marginBottom: '12px' },
  manageBtn: { backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '20px', padding: '8px 16px', fontSize: '13px', color: '#4F46E5', cursor: 'pointer' },
  divider: { borderBottom: '1px solid #e5e7eb' },
  menuItem: { padding: '11px 16px', fontSize: '14px', color: '#374151', cursor: 'pointer', backgroundColor: '#fff', margin: '2px 8px', borderRadius: '8px' },

  dividerLine: { borderBottom: '1px solid #e5e7eb' },

  // RESULTS
  resultsArea: { maxWidth: '750px', padding: '20px 24px' },
  resultCount: { fontSize: '13px', color: '#70757a', marginBottom: '20px' },

  // SECTION
  section: { marginBottom: '32px' },
  sectionTitle: { fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '14px' },

  // MAP BOX
  mapBox: { border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden', marginBottom: '28px' },
  mapHeader: { padding: '12px 16px', fontSize: '14px', fontWeight: '600', color: '#111827', borderBottom: '1px solid #e5e7eb' },
  mapPlaceholder: { backgroundColor: '#f3f4f6', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', borderBottom: '1px solid #e5e7eb' },
  mapCards: { display: 'flex', flexDirection: 'column' },
  mapCard: { display: 'flex', gap: '12px', padding: '12px 16px', borderBottom: '1px solid #f3f4f6', alignItems: 'center' },
  mapCardImg: { width: '56px', height: '56px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 },
  mapCardInfo: { flex: 1 },
  mapCardName: { fontSize: '14px', fontWeight: '600', color: '#111827' },
  mapCardAddr: { fontSize: '12px', color: '#6B7280', marginTop: '2px' },
  mapCardMeta: { fontSize: '12px', color: '#6B7280', marginTop: '4px' },

  // IMAGE STRIP
  imageStrip: { display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' },
  stripImage: { width: '160px', height: '120px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0, cursor: 'pointer' },

  // LINKS
  linkResult: { marginBottom: '24px' },
  linkUrl: { fontSize: '12px', color: '#70757a', marginBottom: '4px' },
  linkTitle: { fontSize: '18px', color: '#4F46E5', textDecoration: 'none', display: 'block', marginBottom: '4px' },
  linkDesc: { fontSize: '14px', color: '#4d5156', lineHeight: '1.5', margin: 0 },

  // CARDS
  cardGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' },
  card: { border: '1px solid #e5e7eb', borderRadius: '10px', overflow: 'hidden', cursor: 'pointer' },
  cardImg: { width: '100%', height: '130px', objectFit: 'cover', display: 'block' },
  cardBody: { padding: '12px' },
  cardName: { fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '4px' },
  cardSub: { fontSize: '12px', color: '#6B7280', marginBottom: '8px' },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  cardPrice: { fontSize: '14px', fontWeight: '600', color: '#4F46E5' },
  cardMeta: { fontSize: '11px', color: '#6B7280' },
};

export default SearchResultsPage;