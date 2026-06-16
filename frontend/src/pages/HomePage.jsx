
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function HomePage() {
  const [query, setQuery] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [personalInfoOpen, setPersonalInfoOpen] = useState(false);
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

  const formatDob = (dob) => {
    if (!dob) return '—';
    return new Date(dob).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  return (
    <div style={s.page} onClick={() => { setDrawerOpen(false); setPersonalInfoOpen(false); }}>

      {/* ── Top Left Avatar ── */}
      {user && (
        <div
          style={s.topLeftAvatar}
          onClick={(e) => { e.stopPropagation(); setDrawerOpen(!drawerOpen); }}
          title="Menu"
        >
          {getInitial()}
        </div>
      )}

      {/* ── Top Right — only when logged out ── */}
      {!user && (
        <div style={s.topRight}>
          <a href="/login" style={s.loginLink}>Sign in</a>
          <a href="/register" style={s.registerBtn}>Create account</a>
        </div>
      )}

      {/* ── Overlay ── */}
      {drawerOpen && (
        <div onClick={() => { setDrawerOpen(false); setPersonalInfoOpen(false); }} style={s.overlay} />
      )}

      {/* ── Drawer ── */}
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

        {/* ── Nav Items ── */}
        <nav style={s.nav}>

          {/* Personal Info — Accordion */}
          <div>
            <button
              style={{
                ...s.navItem,
                background: personalInfoOpen ? '#f0eeff' : 'transparent',
                color: personalInfoOpen ? '#4F46E5' : '#1f1f1f',
              }}
              onClick={() => setPersonalInfoOpen(!personalInfoOpen)}
            >
              <span style={s.navIcon}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </span>
              <span style={s.navLabel}>Personal Info</span>
              <span style={{
                ...s.chevron,
                transform: personalInfoOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </span>
            </button>

            {/* Accordion Content */}
            {personalInfoOpen && (
              <div style={s.accordionBody}>

                {/* Avatar + name mini header */}
                <div style={s.miniHeader}>
                  <div style={s.miniAvatar}>{getInitial()}</div>
                  <div>
                    <p style={s.miniName}>{user?.firstName} {user?.lastName}</p>
                    <p style={s.miniEmail}>{user?.email}</p>
                  </div>
                </div>

                <div style={s.divider} />

                {/* Basic Details */}
                <p style={s.sectionTitle}>Basic Details</p>
                {[
                  { label: 'First Name', value: user?.firstName },
                  { label: 'Last Name', value: user?.lastName },
                  { label: 'Username', value: user?.username ? `@${user.username}` : '—' },
                  { label: 'Email', value: user?.email },
                  { label: 'Phone', value: user?.phone },
                  { label: 'Date of Birth', value: formatDob(user?.dob) },
                  { label: 'Gender', value: user?.personalInfo?.gender },
                ].map((row) => (
                  <div key={row.label} style={s.infoRow}>
                    <span style={s.infoLabel}>{row.label}</span>
                    <span style={s.infoValue}>{row.value || '—'}</span>
                  </div>
                ))}

                <div style={s.divider} />

                {/* Address */}
                <p style={s.sectionTitle}>Address</p>
                {[
                  { label: 'Home', value: user?.personalInfo?.homeAddress },
                  { label: 'Work', value: user?.personalInfo?.workAddress },
                  { label: 'City', value: user?.personalInfo?.city },
                  { label: 'State', value: user?.personalInfo?.state },
                  { label: 'Pincode', value: user?.personalInfo?.pincode },
                ].map((row) => (
                  <div key={row.label} style={s.infoRow}>
                    <span style={s.infoLabel}>{row.label}</span>
                    <span style={s.infoValue}>{row.value || '—'}</span>
                  </div>
                ))}

                {user?.personalInfo?.bio && (
                  <>
                    <div style={s.divider} />
                    <p style={s.sectionTitle}>Bio</p>
                    <p style={s.bioText}>{user.personalInfo.bio}</p>
                  </>
                )}

                <div style={s.divider} />

                {/* Account */}
                <p style={s.sectionTitle}>Account</p>
                <div style={s.infoRow}>
                  <span style={s.infoLabel}>Account Type</span>
                  <span style={s.badge}>
                    {user?.accountType === 'business' ? 'Business' : 'Personal'}
                  </span>
                </div>
                <div style={s.infoRow}>
                  <span style={s.infoLabel}>Verified</span>
                  <span style={{ fontSize: '13px', fontWeight: '500', color: user?.isVerified ? '#1a7f45' : '#b45309' }}>
                    {user?.isVerified ? '✓ Verified' : '✗ Not verified'}
                  </span>
                </div>

              </div>
            )}
          </div>

        </nav>

        {/* Bottom — Sign out */}
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

      {/* ── Center ── */}
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
  page: {
    minHeight: '100vh',
    backgroundColor: '#fff',
    fontFamily: '"Google Sans", Roboto, Arial, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },
  topLeftAvatar: {
    position: 'fixed',
    top: '16px',
    left: '18px',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: '#4F46E5',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600',
    fontSize: '15px',
    cursor: 'pointer',
    zIndex: 300,
    userSelect: 'none',
    boxShadow: '0 1px 4px rgba(79,70,229,0.3)',
  },
  topRight: {
    position: 'fixed',
    top: '16px',
    right: '24px',
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    zIndex: 100,
  },
  loginLink: {
    textDecoration: 'none',
    color: '#1f1f1f',
    fontSize: '14px',
    fontWeight: '500',
  },
  registerBtn: {
    textDecoration: 'none',
    backgroundColor: '#4F46E5',
    color: '#fff',
    padding: '9px 22px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
  },
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.2)',
    zIndex: 198,
  },
  drawer: {
    position: 'fixed',
    top: 0,
    left: 0,
    height: '100vh',
    width: '280px',
    background: '#fff',
    zIndex: 199,
    boxShadow: '2px 0 16px rgba(0,0,0,0.08)',
    transition: 'transform 0.27s ease',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '22px 18px 18px',
    borderBottom: '1px solid #f0f0f0',
  },
  drawerAvatar: {
    width: '42px',
    height: '42px',
    minWidth: '42px',
    borderRadius: '50%',
    background: '#4F46E5',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600',
    fontSize: '17px',
  },
  drawerName: {
    margin: 0,
    fontSize: '14px',
    fontWeight: '600',
    color: '#1f1f1f',
  },
  drawerEmail: {
    margin: '2px 0 0',
    fontSize: '12px',
    color: '#70757a',
  },
  nav: {
    flex: 1,
    padding: '10px 8px',
  },
  navItem: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '11px',
    padding: '10px 12px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    textAlign: 'left',
    transition: 'background 0.15s',
  },
  navIcon: {
    display: 'flex',
    alignItems: 'center',
  },
  navLabel: {
    flex: 1,
  },
  chevron: {
    display: 'flex',
    alignItems: 'center',
    transition: 'transform 0.2s',
    color: '#9aa0a6',
  },
  accordionBody: {
    padding: '14px 14px 6px',
    margin: '4px 0 8px',
    background: '#fafafa',
    borderRadius: '10px',
    border: '1px solid #f0f0f0',
  },
  miniHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '14px',
  },
  miniAvatar: {
    width: '36px',
    height: '36px',
    minWidth: '36px',
    borderRadius: '50%',
    background: '#4F46E5',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600',
    fontSize: '14px',
  },
  miniName: {
    margin: 0,
    fontSize: '13px',
    fontWeight: '600',
    color: '#1f1f1f',
  },
  miniEmail: {
    margin: '1px 0 0',
    fontSize: '11px',
    color: '#70757a',
  },
  divider: {
    height: '1px',
    background: '#efefef',
    margin: '12px 0',
  },
  sectionTitle: {
    margin: '0 0 8px',
    fontSize: '10px',
    fontWeight: '600',
    color: '#9aa0a6',
    letterSpacing: '0.07em',
    textTransform: 'uppercase',
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '7px 0',
    borderBottom: '1px solid #f5f5f5',
  },
  infoLabel: {
    fontSize: '12px',
    color: '#70757a',
  },
  infoValue: {
    fontSize: '12px',
    color: '#1f1f1f',
    fontWeight: '500',
    textAlign: 'right',
    maxWidth: '140px',
    wordBreak: 'break-word',
  },
  bioText: {
    fontSize: '12px',
    color: '#3c4043',
    lineHeight: '1.6',
    margin: 0,
  },
  badge: {
    fontSize: '11px',
    fontWeight: '500',
    background: '#f0eeff',
    color: '#4F46E5',
    padding: '2px 10px',
    borderRadius: '100px',
  },
  drawerBottom: {
    padding: '14px 12px',
    borderTop: '1px solid #f0f0f0',
  },
  signOutBtn: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '9px',
    border: '1px solid #e8eaed',
    borderRadius: '8px',
    background: 'transparent',
    cursor: 'pointer',
    fontSize: '13px',
    color: '#5f6368',
    fontWeight: '500',
  },
  center: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '-40px',
  },
  logo: {
    fontSize: '64px',
    fontWeight: '700',
    margin: '0 0 8px 0',
    letterSpacing: '-1px',
  },
  tagline: {
    fontSize: '14px',
    color: '#70757a',
    margin: '0 0 28px',
    fontWeight: '400',
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid #dfe1e5',
    borderRadius: '24px',
    padding: '12px 20px',
    width: '560px',
    boxShadow: '0 1px 4px rgba(32,33,36,0.08)',
  },
  input: {
    flex: 1,
    border: 'none',
    outline: 'none',
    fontSize: '16px',
    color: '#202124',
    background: 'transparent',
  },
  clearBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    padding: '2px',
  },
  platforms: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: '24px',
  },
  platformLink: {
    textDecoration: 'none',
    color: '#3c4043',
    backgroundColor: '#f8f9fa',
    fontSize: '13px',
    padding: '7px 16px',
    borderRadius: '6px',
    border: '1px solid #dadce0',
    fontWeight: '500',
  },
  footer: {
    textAlign: 'center',
    padding: '14px',
    borderTop: '1px solid #f0f0f0',
    fontSize: '12px',
    color: '#9aa0a6',
  },
};

export default HomePage;