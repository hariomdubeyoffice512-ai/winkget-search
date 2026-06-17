import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { updatePersonalInfo } from '../services/api';

// ── Generic Text Modal ──
const EditModal = ({ label, value, onSave, onClose, type = 'text' }) => {
  const [val, setVal] = useState(value || '');
  return (
    <div style={m.overlay}>
      <div style={m.modal}>
        <h3 style={m.modalTitle}>Edit {label}</h3>
        {type === 'textarea' ? (
          <textarea
            style={{ ...m.input, height: '100px', resize: 'vertical' }}
            value={val}
            onChange={(e) => setVal(e.target.value)}
            autoFocus
          />
        ) : (
          <input
            style={m.input}
            type={type}
            value={val}
            onChange={(e) => setVal(e.target.value)}
            autoFocus
          />
        )}
        <div style={m.modalBtns}>
          <button style={m.cancelBtn} onClick={onClose}>Cancel</button>
          <button style={m.saveBtn} onClick={() => onSave(val)}>Save</button>
        </div>
      </div>
    </div>
  );
};

// ── Gender Modal — Radio Buttons ──
const GenderModal = ({ value, onSave, onClose }) => {
  const [selected, setSelected] = useState(value || '');
  const options = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];
  return (
    <div style={m.overlay}>
      <div style={m.modal}>
        <h3 style={m.modalTitle}>Edit Gender</h3>
        <div style={{ marginBottom: '24px' }}>
          {options.map((opt) => (
            <label
              key={opt}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                background: selected === opt ? '#f0eeff' : 'transparent',
                marginBottom: '4px',
                transition: 'background 0.15s',
              }}
            >
              <input
                type="radio"
                name="gender"
                value={opt}
                checked={selected === opt}
                onChange={() => setSelected(opt)}
                style={{ accentColor: '#4F46E5', width: '18px', height: '18px' }}
              />
              <span style={{ fontSize: '15px', color: '#1f1f1f' }}>{opt}</span>
            </label>
          ))}
        </div>
        <div style={m.modalBtns}>
          <button style={m.cancelBtn} onClick={onClose}>Cancel</button>
          <button style={m.saveBtn} onClick={() => onSave(selected)}>Save</button>
        </div>
      </div>
    </div>
  );
};

// ── Info Row ──
const InfoRow = ({ icon, label, value, onClick, noArrow }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        padding: '16px 20px',
        borderBottom: '1px solid #e8eaed',
        background: hovered && !noArrow ? '#f0f4ff' : '#fff',
        cursor: noArrow ? 'default' : 'pointer',
        transition: 'background 0.15s',
      }}
    >
      <span style={{ fontSize: '20px', width: '24px', textAlign: 'center', color: '#5f6368' }}>
        {icon}
      </span>
      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, fontSize: '14px', fontWeight: '500', color: '#1f1f1f' }}>{label}</p>
        <p style={{ margin: '2px 0 0', fontSize: '13px', color: value ? '#5f6368' : '#bdc1c6' }}>
          {value || 'Not set'}
        </p>
      </div>
      {!noArrow && <span style={{ color: '#bdc1c6', fontSize: '18px' }}>›</span>}
    </div>
  );
};

function PersonalInfoPage() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [modal, setModal] = useState(null);
  const [genderModal, setGenderModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const formatDob = (dob) => {
    if (!dob) return null;
    return new Date(dob).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const showToast = (msg, success = true) => {
    setToast({ msg, success });
    setTimeout(() => setToast(null), 3000);
  };

  const openModal = (label, field, value, isNested = false, type = 'text') => {
    setModal({ label, field, value, isNested, type });
  };

  const handleSave = async (newValue) => {
    if (!newValue) return;
    setSaving(true);
    try {
      let payload = {};
      if (modal.isNested) {
        payload = { personalInfo: { [modal.field]: newValue } };
      } else {
        payload = { [modal.field]: newValue };
      }
      const res = await updatePersonalInfo(payload);
      const updatedUser = res.data.user;
      localStorage.setItem('winkget_user', JSON.stringify(updatedUser));
      if (setUser) setUser(updatedUser);
      showToast('Saved successfully!');
    } catch (err) {
      showToast('Failed to save. Please try again.', false);
    } finally {
      setSaving(false);
      setModal(null);
    }
  };

  const handleGenderSave = async (newValue) => {
    if (!newValue) return;
    setSaving(true);
    try {
      const payload = { personalInfo: { gender: newValue } };
      const res = await updatePersonalInfo(payload);
      const updatedUser = res.data.user;
      localStorage.setItem('winkget_user', JSON.stringify(updatedUser));
      if (setUser) setUser(updatedUser);
      showToast('Saved successfully!');
    } catch (err) {
      showToast('Failed to save. Please try again.', false);
    } finally {
      setSaving(false);
      setGenderModal(false);
    }
  };

  return (
    <div style={s.page}>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
          background: toast.success ? '#1a7f45' : '#d93025',
          color: '#fff', padding: '12px 24px', borderRadius: '8px',
          fontSize: '14px', fontWeight: '500', zIndex: 1000,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}>
          {toast.msg}
        </div>
      )}

      {/* Modals */}
      {modal && (
        <EditModal
          label={modal.label}
          value={modal.value}
          type={modal.type}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
      {genderModal && (
        <GenderModal
          value={user?.personalInfo?.gender}
          onSave={handleGenderSave}
          onClose={() => setGenderModal(false)}
        />
      )}

      {/* Sidebar */}
      <div style={s.sidebar}>
        <div style={s.sidebarAvatar}>{user?.firstName?.[0]?.toUpperCase() || '?'}</div>
        <p style={s.sidebarName}>{user?.firstName} {user?.lastName}</p>
        <p style={s.sidebarEmail}>{user?.email}</p>
        <div style={s.divider} />
        <nav style={{ width: '100%' }}>
          <button
            onClick={() => navigate('/personal-info')}
            style={{ ...s.navItem, background: '#e8eaf6', color: '#4F46E5', fontWeight: '600' }}
          >
            <span>👤</span> Personal info
          </button>
          <button
            onClick={() => navigate('/security')}
            style={{ ...s.navItem, background: 'transparent', color: '#3c4043' }}
          >
            <span>🔒</span> Security & Sign in
          </button>
        </nav>
        <div style={{ flex: 1 }} />
        <button onClick={() => navigate('/')} style={s.backBtn}>
          ← Back to Search
        </button>
      </div>

      {/* Content */}
      <div style={s.content}>
        <h1 style={s.pageTitle}>Personal info</h1>
        <p style={s.pageSubtitle}>Info about you and your preferences across Winkget</p>

        {/* Profile Picture */}
        <div style={s.card}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px' }}>
            <div>
              <p style={{ margin: 0, fontSize: '15px', fontWeight: '500', color: '#1f1f1f' }}>Profile picture</p>
              <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#5f6368' }}>A photo helps personalise your account</p>
            </div>
            <div style={s.avatarCircle}>{user?.firstName?.[0]?.toUpperCase() || '?'}</div>
          </div>
        </div>

        {/* Basic Info */}
        <div style={s.card}>
          <p style={s.cardTitle}>Basic info</p>
          <InfoRow
            icon="🪪"
            label="First Name"
            value={user?.firstName}
            onClick={() => openModal('First Name', 'firstName', user?.firstName)}
          />
          <InfoRow
            icon="🪪"
            label="Last Name"
            value={user?.lastName}
            onClick={() => openModal('Last Name', 'lastName', user?.lastName)}
          />
          <InfoRow
            icon="⚥"
            label="Gender"
            value={user?.personalInfo?.gender}
            onClick={() => setGenderModal(true)}
          />
          <InfoRow
            icon="🎂"
            label="Birthday"
            value={formatDob(user?.dob)}
            onClick={() => openModal('Birthday', 'dob', user?.dob?.split('T')[0], false, 'date')}
          />
        </div>

        {/* Contact */}
        <div style={s.card}>
          <p style={s.cardTitle}>Contact info</p>
          <InfoRow
            icon="✉️"
            label="Email"
            value={user?.email}
            noArrow
          />
          <InfoRow
            icon="📞"
            label="Phone"
            value={user?.phone}
            onClick={() => openModal('Phone', 'phone', user?.phone)}
          />
        </div>

        {/* Address */}
        <div style={s.card}>
          <p style={s.cardTitle}>Address</p>
          <InfoRow
            icon="🏠"
            label="Home address"
            value={user?.personalInfo?.homeAddress}
            onClick={() => openModal('Home Address', 'homeAddress', user?.personalInfo?.homeAddress, true)}
          />
          <InfoRow
            icon="💼"
            label="Work address"
            value={user?.personalInfo?.workAddress}
            onClick={() => openModal('Work Address', 'workAddress', user?.personalInfo?.workAddress, true)}
          />
          <InfoRow
            icon="📍"
            label="City"
            value={user?.personalInfo?.city}
            onClick={() => openModal('City', 'city', user?.personalInfo?.city, true)}
          />
          <InfoRow
            icon="🗺️"
            label="State"
            value={user?.personalInfo?.state}
            onClick={() => openModal('State', 'state', user?.personalInfo?.state, true)}
          />
          <InfoRow
            icon="📮"
            label="Pincode"
            value={user?.personalInfo?.pincode}
            onClick={() => openModal('Pincode', 'pincode', user?.personalInfo?.pincode, true)}
          />
        </div>

        {/* Bio */}
        <div style={s.card}>
          <p style={s.cardTitle}>About</p>
          <InfoRow
            icon="📝"
            label="Bio"
            value={user?.personalInfo?.bio}
            onClick={() => openModal('Bio', 'bio', user?.personalInfo?.bio, true, 'textarea')}
          />
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: '100vh', display: 'flex', backgroundColor: '#f0f4f9', fontFamily: '"Google Sans", Roboto, Arial, sans-serif' },
  sidebar: { width: '280px', minWidth: '280px', backgroundColor: '#fff', padding: '32px 16px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', borderRight: '1px solid #e8eaed', position: 'sticky', top: 0, height: '100vh' },
  sidebarAvatar: { width: '72px', height: '72px', borderRadius: '50%', background: '#4F46E5', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: '600', marginBottom: '12px' },
  sidebarName: { margin: '0 0 4px', fontSize: '16px', fontWeight: '600', color: '#1f1f1f', textAlign: 'center' },
  sidebarEmail: { margin: 0, fontSize: '12px', color: '#5f6368', textAlign: 'center' },
  divider: { width: '100%', height: '1px', background: '#e8eaed', margin: '20px 0' },
  navItem: { width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', border: 'none', borderRadius: '100px', cursor: 'pointer', fontSize: '14px', textAlign: 'left', marginBottom: '4px', transition: 'background 0.15s' },
  backBtn: { width: '100%', padding: '10px 16px', border: '1px solid #e8eaed', borderRadius: '100px', background: 'transparent', cursor: 'pointer', fontSize: '13px', color: '#5f6368' },
  content: { flex: 1, padding: '40px 60px', maxWidth: '720px' },
  pageTitle: { fontSize: '28px', fontWeight: '600', color: '#1f1f1f', margin: '0 0 8px' },
  pageSubtitle: { fontSize: '14px', color: '#5f6368', margin: '0 0 32px' },
  card: { backgroundColor: '#fff', borderRadius: '12px', padding: '8px 0', marginBottom: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', overflow: 'hidden' },
  cardTitle: { fontSize: '12px', fontWeight: '600', color: '#5f6368', padding: '12px 20px 4px', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' },
  avatarCircle: { width: '56px', height: '56px', borderRadius: '50%', background: '#4F46E5', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: '600' },
};

const m = {
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  modal: { background: '#fff', borderRadius: '16px', padding: '28px', width: '400px', boxShadow: '0 8px 32px rgba(0,0,0,0.15)' },
  modalTitle: { margin: '0 0 20px', fontSize: '18px', fontWeight: '600', color: '#1f1f1f' },
  input: { width: '100%', padding: '12px 16px', border: '1px solid #e8eaed', borderRadius: '8px', fontSize: '15px', outline: 'none', boxSizing: 'border-box', marginBottom: '20px' },
  modalBtns: { display: 'flex', justifyContent: 'flex-end', gap: '12px' },
  cancelBtn: { padding: '10px 24px', border: '1px solid #e8eaed', borderRadius: '100px', background: 'transparent', cursor: 'pointer', fontSize: '14px', color: '#5f6368' },
  saveBtn: { padding: '10px 24px', border: 'none', borderRadius: '100px', background: '#4F46E5', color: '#fff', cursor: 'pointer', fontSize: '14px', fontWeight: '600' },
};

export default PersonalInfoPage;