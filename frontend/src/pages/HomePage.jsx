import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Helper for the Grouped Menu Blocks (the white rounded cards)
const MenuBlock = ({ children }) => {
  return (
    <div style={styles.menuBlock}>
      {React.Children.map(children, (child, index) => {
        // Add a top border to all items except the first one to create the divider line
        return React.cloneElement(child, {
          style: {
            ...child.props.style,
            borderTop: index > 0 ? '1px solid #e1e3e1' : 'none',
          }
        });
      })}
    </div>
  );
};

// Helper for the individual hoverable items inside the blocks
const MenuItem = ({ icon, text, rightText, badge, onClick, style, isDanger }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        ...styles.menuItem,
        backgroundColor: isHovered ? '#f4f7fc' : '#ffffff',
        color: isDanger ? '#d93025' : '#1f1f1f',
        ...style
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <span style={{...styles.menuIcon, color: isDanger ? '#d93025' : '#444746'}}>{icon}</span>
      <span style={{ flex: 1 }}>{text}</span>
      
      {rightText && <span style={styles.menuRightText}>{rightText}</span>}
      {badge && <span style={styles.menuBadge}>{badge}</span>}
    </div>
  );
};

function HomePage() {
  const [query, setQuery] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  
  const { user, logout } = useAuth() || { 
    user: { firstName: 'Admin', email: 'admin@winkget.com' }, 
    logout: () => {} 
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${query}`);
    }
  };

  const handleLogout = () => {
    logout();
    setShowMenu(false);
  };

  const getInitial = () => {
    if (user?.firstName) return user.firstName[0].toUpperCase();
    return '?';
  };

  return (
    <div style={styles.page} onClick={() => setShowMenu(false)}>

      {/* Top Right */}
      <div style={styles.topRight} onClick={(e) => e.stopPropagation()}>
        {user ? (
          <div style={styles.avatarWrap}>
            {/* Main Small Avatar */}
            <div 
              style={{
                ...styles.avatar,
                boxShadow: showMenu ? '0 0 0 4px #e8eaed' : 'none'
              }} 
              onClick={() => setShowMenu(!showMenu)}
            >
              {getInitial()}
            </div>

            {/* Google-Style Dropdown Card */}
            {showMenu && (
              <div style={styles.dropdown}>

                {/* Email & Close Header */}
                <div style={styles.dropdownHeader}>
                  <span style={styles.emailText}>{user.email}</span>
                  <button style={styles.closeBtn} onClick={() => setShowMenu(false)}>✕</button>
                </div>

                {/* Profile Avatar Center */}
                <div style={styles.profileSection}>
                  <div style={styles.avatarContainer}>
                    <div style={styles.bigAvatar}>{getInitial()}</div>
                    {/* Camera Icon Overlay */}
                    <div style={styles.cameraIconWrap}>
                      <span style={{fontSize: '12px'}}>📷</span>
                    </div>
                  </div>
                  <div style={styles.hiText}>Hi, {user.firstName}!</div>
                  <button 
                    style={styles.manageBtn}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f4f7fc'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#fff'}
                  >
                    Manage your Winkget Account
                  </button>
                </div>

                {/* Show More Accounts Pill - Kept for structural layout */}
                <div 
                  style={styles.moreAccountsBtn}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f4f7fc'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}
                >
                  <span style={{ fontWeight: 500 }}>Show more accounts</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={styles.tinyAvatar}>{getInitial()}</div>
                    <span style={{ color: '#444746', fontSize: '18px' }}>⌄</span>
                  </div>
                </div>

                {/* Section Header */}
                <div style={styles.sectionLabel}>More from Winkget Search</div>

                {/* Grouped Menu Blocks with your original Winkget items */}
                
                {/* Block 1: History */}
                <MenuBlock>
                  <MenuItem icon="🕐" text="Search History" rightText="Saving" />
                  <MenuItem icon="🗑️" text="Delete last 30 minutes" />
                </MenuBlock>

                {/* Block 2: Personalization & Profile */}
                <MenuBlock>
                  <MenuItem icon="✨" text="Search Personalisation" />
                  <MenuItem icon="🔖" text="Saves & Bookmarks" />
                  <MenuItem icon="👤" text="Your Search Profile" />
                </MenuBlock>

                {/* Block 3: Settings & Business */}
                <MenuBlock>
                  <MenuItem icon="🛡️" text="SafeSearch" rightText="Off" />
                  <MenuItem icon="🌐" text="Language" rightText="English" />
                  <MenuItem icon="💼" text="Switch to Business" />
                </MenuBlock>

                {/* Block 4: App Settings */}
                <MenuBlock>
                  <MenuItem icon="⚙️" text="More Settings" />
                  <MenuItem icon="❓" text="Help" />
                </MenuBlock>

                {/* Block 5: Sign Out */}
                <MenuBlock>
                  <MenuItem icon="🚪" text="Sign Out" isDanger={true} onClick={handleLogout} />
                </MenuBlock>

                {/* Footer Links */}
                <div style={styles.dropdownFooter}>
                  <a href="#" style={styles.footerLink}>Privacy Policy</a>
                  <span style={styles.footerDot}>•</span>
                  <a href="#" style={styles.footerLink}>Terms of Service</a>
                </div>

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

      {/* Center Main Content */}
      <div style={styles.center}>
        <h1 style={styles.logo}>
          <span style={{ color: '#4F46E5' }}>Wink</span>
          <span style={{ color: '#7C3AED' }}>get</span>
        </h1>

        <form onSubmit={handleSearch}>
          <div style={styles.searchBox}>
            <span style={styles.icon}>🔍</span>
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Winkget..."
              style={styles.input}
            />
            {query && (
              <span onClick={() => setQuery('')} style={styles.clear}>✕</span>
            )}
          </div>
        </form>

        <div style={styles.platforms}>
          <a href="#" style={styles.platformLink}>🛒 Shop</a>
          <a href="#" style={styles.platformLink}>🍔 Food</a>
          <a href="#" style={styles.platformLink}>💼 Jobs</a>
          <a href="#" style={styles.platformLink}>⚖️ Legal</a>
          <a href="#" style={styles.platformLink}>💰 Finance</a>
          <a href="#" style={styles.platformLink}>🏠 Real Estate</a>
        </div>
      </div>

      <div style={styles.footer}>© 2026 Winkget Technologies</div>

    </div>
  );
}

// Styling Object
const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#fff',
    fontFamily: '"Google Sans", Roboto, Arial, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },
  topRight: {
    position: 'absolute',
    top: '16px',
    right: '24px',
    display: 'flex',
    gap: '14px',
    alignItems: 'center',
    zIndex: 100,
  },
  loginLink: { textDecoration: 'none', color: '#1f1f1f', fontSize: '14px', fontWeight: '500' },
  registerBtn: { textDecoration: 'none', backgroundColor: '#0b57d0', color: '#fff', padding: '9px 24px', borderRadius: '24px', fontSize: '14px', fontWeight: '500' },
  avatarWrap: { position: 'relative' },
  avatar: {
    width: '36px',
    height: '36px',
    backgroundColor: '#8b5cf6',
    borderRadius: '50%',
    color: '#fff',
    fontWeight: '500',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    userSelect: 'none',
    transition: 'box-shadow 0.2s',
  },

  // Dropdown Container
  dropdown: {
    position: 'absolute',
    top: '48px',
    right: '0',
    backgroundColor: '#e9eef6', 
    border: 'none',
    borderRadius: '28px', 
    boxShadow: '0 4px 12px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08)',
    width: '380px',
    padding: '16px', 
    zIndex: 200,
    maxHeight: '85vh',
    overflowY: 'auto',
  },
  
  dropdownHeader: { display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', marginBottom: '20px' },
  emailText: { fontSize: '14px', color: '#1f1f1f', fontWeight: '500' },
  closeBtn: { position: 'absolute', right: '0', background: 'none', border: 'none', cursor: 'pointer', color: '#444746', fontSize: '18px', padding: '4px', borderRadius: '50%' },

  profileSection: { display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '16px' },
  avatarContainer: { position: 'relative', marginBottom: '12px' },
  bigAvatar: { width: '84px', height: '84px', backgroundColor: '#8b5cf6', borderRadius: '50%', color: '#fff', fontWeight: '400', fontSize: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  cameraIconWrap: { position: 'absolute', bottom: '0', right: '0', backgroundColor: '#fff', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', cursor: 'pointer' },
  hiText: { fontSize: '22px', fontWeight: '400', color: '#1f1f1f', marginBottom: '16px' },
  manageBtn: { backgroundColor: '#fff', border: '1px solid #747775', borderRadius: '100px', padding: '10px 24px', fontSize: '14px', color: '#0b57d0', cursor: 'pointer', fontWeight: '500', transition: 'background-color 0.2s' },

  moreAccountsBtn: { backgroundColor: '#fff', borderRadius: '24px', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', cursor: 'pointer', fontSize: '14px', color: '#1f1f1f' },
  tinyAvatar: { width: '20px', height: '20px', backgroundColor: '#8b5cf6', borderRadius: '50%', color: '#fff', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' },

  sectionLabel: { fontSize: '13px', color: '#444746', padding: '0 12px 8px' },
  menuBlock: { backgroundColor: '#fff', borderRadius: '24px', overflow: 'hidden', marginBottom: '8px', display: 'flex', flexDirection: 'column' },
  menuItem: { display: 'flex', alignItems: 'center', padding: '16px 20px', fontSize: '14px', cursor: 'pointer', gap: '16px', transition: 'background-color 0.15s' },
  menuIcon: { fontSize: '20px', width: '24px', textAlign: 'center' },
  menuRightText: { fontSize: '13px', color: '#444746' },
  menuBadge: { backgroundColor: '#0b57d0', color: '#fff', fontSize: '11px', fontWeight: '500', padding: '2px 8px', borderRadius: '4px' },

  dropdownFooter: { display: 'flex', justifyContent: 'center', gap: '12px', padding: '12px 0 4px', fontSize: '12px' },
  footerLink: { textDecoration: 'none', color: '#444746' },
  footerDot: { color: '#444746' },

  center: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: '-60px' },
  logo: { fontSize: '72px', fontWeight: '700', margin: '0 0 30px 0' },
  searchBox: { display: 'flex', alignItems: 'center', border: '1px solid #dfe1e5', borderRadius: '24px', padding: '14px 20px', width: '580px', boxShadow: '0 1px 5px rgba(32,33,36,.1)' },
  icon: { marginRight: '12px', fontSize: '18px', color: '#9aa0a6' },
  input: { flex: 1, border: 'none', outline: 'none', fontSize: '16px', color: '#202124' },
  clear: { cursor: 'pointer', color: '#9aa0a6', fontSize: '16px' },
  platforms: { display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '28px' },
  platformLink: { textDecoration: 'none', color: '#3c4043', backgroundColor: '#f8f9fa', fontSize: '13px', padding: '8px 16px', borderRadius: '100px', border: '1px solid #dadce0' },
  footer: { textAlign: 'center', padding: '16px', borderTop: '1px solid #dadce0', fontSize: '13px', color: '#70757a', backgroundColor: '#f8f9fa' },
};

export default HomePage;