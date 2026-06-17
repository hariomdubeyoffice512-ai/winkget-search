import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function HomePage() {
  const [query, setQuery] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const { user, logout } = useAuth() || {
    user: { firstName: 'Admin', lastName: 'User', email: 'admin@winkget.com', phone: '9999999999', dob: '2000-01-01' },
    logout: () => {}
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/search?q=${query}`);
  };

  const getInitial = () => user?.firstName?.[0]?.toUpperCase() || '?';

  return (
    <div style={s.page} onClick={() => setDrawerOpen(false)}>

      {/* Top Left Avatar */}
      {user && (
        <div
          style={s.topLeftAvatar}
          onClick={(e) => { e.stopPropagation(); setDrawerOpen(!drawerOpen); }}
          title="Menu"
        >
          {getInitial()}
        </div>
      )}

      {/* Top Right — logged out only */}
      {!user && (
        <div style={s.topRight}>
          <a href="/login" style={s.loginLink}>Sign in</a>
          <a href="/register" style={s.registerBtn}>Create account</a>
        </div>
      )}

      {/* Overlay */}
      {drawerOpen && (
        <div onClick={() => setDrawerOpen(false)} style={s.overlay} />
      )}

      {/* Drawer */}
      <div
        style={{
          ...s.drawer,
          transform: drawerOpen ? 'translateX(0)' : 'translateX(-100%)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* User Header */}
        <div style={s.drawerHeader}>
          <div style={s.drawerAvatar}>{getInitial()}</div>
          <div>
            <p style={s.drawerName}>{user?.firstName} {user?.lastName}</p>
            <p style={s.drawerEmail}>{user?.email || `${user?.username}@winkget.com`}</p>
          </div>
        </div>

        {/* Nav */}
        <nav style={s.nav}>
          <button
            style={{ ...s.navItem, background: 'transparent', color: '#1f1f1f' }}
            onClick={() => { navigate('/personal-info'); setDrawerOpen(false); }}
          >
            <span style={s.navIcon}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </span>
            <span style={s.navLabel}>Personal Info</span>
            <span style={{ color: '#9aa0a6', fontSize: '16px' }}>›</span>
          </button>

          <button
            style={{ ...s.navItem, background: 'transparent', color: '#1f1f1f' }}
            onClick={() => { navigate('/security'); setDrawerOpen(false); }}
          >
            <span style={s.navIcon}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </span>
            <span style={s.navLabel}>Security & Sign in</span>
            <span style={{ color: '#9aa0a6', fontSize: '16px' }}>›</span>
          </button>
        </nav>

        {/* Sign out */}
        <div style={s.drawerBottom}>
          <button onClick={() => { logout(); setDrawerOpen(false); }} style={s.signOutBtn}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Sign out
          </button>
        </div>
      </div>

      {/* Center */}
      <div style={s.center}>
        <h1 style={s.logo}>
          <span style={{ color: '#4F46E5' }}>Wink</span><span style={{ color: '#7C3AED' }}>get</span>
        </h1>
        <p style={s.tagline}>Search across the Winkget ecosystem</p>

        <form onSubmit={handleSearch} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <div style={s.searchBox}>
            <svg style={{ marginRight: '12px', flexShrink: 0 }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9aa0a6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Winkget..."
              style={s.input}
            />
            {query && (
              <button type="button" onClick={() => setQuery('')} style={s.clearBtn}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9aa0a6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            )}
          </div>
        </form>

        <div style={s.platforms}>
          {['Shop', 'Food', 'Jobs', 'Legal', 'Finance', 'Real Estate'].map((p) => (
            <a key={p} href="#" style={s.platformLink}>{p}</a>
          ))}
        </div>
      </div>

      <div style={s.footer}>© 2026 Winkget Technologies</div>
    </div>
  );
}

const s = {
  page: { minHeight: '100vh', backgroundColor: '#fff', fontFamily: '"Google Sans", Roboto, Arial, sans-serif', display: 'flex', flexDirection: 'column', position: 'relative' },
  topLeftAvatar: { position: 'fixed', top: '16px', left: '18px', width: '36px', height: '36px', borderRadius: '50%', background: '#4F46E5', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', fontSize: '15px', cursor: 'pointer', zIndex: 300, userSelect: 'none', boxShadow: '0 1px 4px rgba(79,70,229,0.3)' },
  topRight: { position: 'fixed', top: '16px', right: '24px', display: 'flex', gap: '12px', alignItems: 'center', zIndex: 100 },
  loginLink: { textDecoration: 'none', color: '#1f1f1f', fontSize: '14px', fontWeight: '500' },
  registerBtn: { textDecoration: 'none', backgroundColor: '#4F46E5', color: '#fff', padding: '9px 22px', borderRadius: '6px', fontSize: '14px', fontWeight: '500' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.2)', zIndex: 198 },
  drawer: { position: 'fixed', top: 0, left: 0, height: '100vh', width: '280px', background: '#fff', zIndex: 199, boxShadow: '2px 0 16px rgba(0,0,0,0.08)', transition: 'transform 0.27s ease', display: 'flex', flexDirection: 'column', overflowY: 'auto' },
  drawerHeader: { display: 'flex', alignItems: 'center', gap: '12px', padding: '22px 18px 18px', borderBottom: '1px solid #f0f0f0' },
  drawerAvatar: { width: '42px', height: '42px', minWidth: '42px', borderRadius: '50%', background: '#4F46E5', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', fontSize: '17px' },
  drawerName: { margin: 0, fontSize: '14px', fontWeight: '600', color: '#1f1f1f' },
  drawerEmail: { margin: '2px 0 0', fontSize: '12px', color: '#70757a' },
  nav: { flex: 1, padding: '10px 8px' },
  navItem: { width: '100%', display: 'flex', alignItems: 'center', gap: '11px', padding: '10px 12px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '500', textAlign: 'left', transition: 'background 0.15s', marginBottom: '4px' },
  navIcon: { display: 'flex', alignItems: 'center' },
  navLabel: { flex: 1 },
  drawerBottom: { padding: '14px 12px', borderTop: '1px solid #f0f0f0' },
  signOutBtn: { width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '9px', border: '1px solid #e8eaed', borderRadius: '8px', background: 'transparent', cursor: 'pointer', fontSize: '13px', color: '#d93025', fontWeight: '500' },
  center: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: '-40px' },
  logo: { fontSize: '64px', fontWeight: '700', margin: '0 0 8px 0', letterSpacing: '-1px' },
  tagline: { fontSize: '14px', color: '#70757a', margin: '0 0 28px', fontWeight: '400' },
  searchBox: { display: 'flex', alignItems: 'center', border: '1px solid #dfe1e5', borderRadius: '24px', padding: '12px 20px', width: '560px', boxShadow: '0 1px 4px rgba(32,33,36,0.08)' },
  input: { flex: 1, border: 'none', outline: 'none', fontSize: '16px', color: '#202124', background: 'transparent' },
  clearBtn: { background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '2px' },
  platforms: { display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '24px' },
  platformLink: { textDecoration: 'none', color: '#3c4043', backgroundColor: '#f8f9fa', fontSize: '13px', padding: '7px 16px', borderRadius: '6px', border: '1px solid #dadce0', fontWeight: '500' },
  footer: { textAlign: 'center', padding: '14px', borderTop: '1px solid #f0f0f0', fontSize: '12px', color: '#9aa0a6' },
};

export default HomePage;