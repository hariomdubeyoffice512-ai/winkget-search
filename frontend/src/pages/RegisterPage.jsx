import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    username: '',
    dob: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    const finalEmail = `${form.username}@winkget.com`;
    alert(`Account created! Your Winkget email is: ${finalEmail}`);
    navigate('/login');
  };

  return (
    <div style={styles.page}>

      {/* Logo */}
      <h1 style={styles.logo} onClick={() => navigate('/')}>
        <span style={{ color: '#4F46E5' }}>Wink</span>
        <span style={{ color: '#7C3AED' }}>get</span>
      </h1>

      {/* Card */}
      <div style={styles.card}>
        <h2 style={styles.title}>Create your Winkget Account</h2>
        <p style={styles.subtitle}>One account for all Winkget platforms</p>

        <form onSubmit={handleSubmit}>

          {/* Name Row */}
          <div style={styles.row}>
            <input
              type="text"
              name="firstName"
              placeholder="First name"
              value={form.firstName}
              onChange={handleChange}
              style={styles.halfInput}
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last name"
              value={form.lastName}
              onChange={handleChange}
              style={styles.halfInput}
              required
            />
          </div>

          {/* Custom Username / Email */}
          <div style={styles.usernameWrap}>
            <input
              type="text"
              name="username"
              placeholder="Choose your username"
              value={form.username}
              onChange={handleChange}
              style={styles.usernameInput}
              required
            />
            <span style={styles.domain}>@winkget.com</span>
          </div>

          {/* Live Preview */}
          {form.username && (
            <div style={styles.emailPreview}>
              📧 Your Winkget email: <strong>{form.username}@winkget.com</strong>
            </div>
          )}

          {/* DOB */}
          <input
            type="date"
            name="dob"
            value={form.dob}
            onChange={handleChange}
            style={styles.input}
            required
          />

          {/* Phone */}
          <input
            type="tel"
            name="phone"
            placeholder="Phone number"
            value={form.phone}
            onChange={handleChange}
            style={styles.input}
            required
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            style={styles.input}
            required
          />

          {/* Confirm Password */}
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm password"
            value={form.confirmPassword}
            onChange={handleChange}
            style={styles.input}
            required
          />

          {/* Buttons */}
          <div style={styles.btnRow}>
            <a href="/login" style={styles.loginLink}>
              Already have an account?
            </a>
            <button type="submit" style={styles.registerBtn}>
              Next
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#fff',
    fontFamily: 'Arial, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  logo: {
    fontSize: '36px',
    fontWeight: '700',
    marginBottom: '20px',
    cursor: 'pointer',
    letterSpacing: '-1px',
  },
  card: {
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '40px 48px',
    width: '100%',
    maxWidth: '450px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
  },
  title: {
    fontSize: '22px',
    fontWeight: '400',
    color: '#202124',
    margin: '0 0 8px 0',
  },
  subtitle: {
    fontSize: '14px',
    color: '#70757a',
    margin: '0 0 24px 0',
  },
  row: {
    display: 'flex',
    gap: '12px',
    marginBottom: '16px',
  },
  halfInput: {
    flex: 1,
    padding: '13px 15px',
    border: '1px solid #dfe1e5',
    borderRadius: '6px',
    fontSize: '15px',
    outline: 'none',
    color: '#202124',
  },
  usernameWrap: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid #dfe1e5',
    borderRadius: '6px',
    marginBottom: '10px',
    overflow: 'hidden',
  },
  usernameInput: {
    flex: 1,
    padding: '13px 15px',
    border: 'none',
    outline: 'none',
    fontSize: '15px',
    color: '#202124',
  },
  domain: {
    padding: '13px 15px',
    backgroundColor: '#f3f4f6',
    color: '#6b7280',
    fontSize: '15px',
    borderLeft: '1px solid #dfe1e5',
    whiteSpace: 'nowrap',
  },
  emailPreview: {
    backgroundColor: '#EEF2FF',
    border: '1px solid #C7D2FE',
    borderRadius: '6px',
    padding: '10px 14px',
    fontSize: '13px',
    color: '#3730A3',
    marginBottom: '16px',
  },
  input: {
    width: '100%',
    padding: '13px 15px',
    border: '1px solid #dfe1e5',
    borderRadius: '6px',
    fontSize: '15px',
    marginBottom: '16px',
    outline: 'none',
    boxSizing: 'border-box',
    color: '#202124',
  },
  btnRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '8px',
  },
  loginLink: {
    textDecoration: 'none',
    color: '#4F46E5',
    fontSize: '14px',
    fontWeight: '500',
  },
  registerBtn: {
    backgroundColor: '#4F46E5',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    padding: '10px 28px',
    fontSize: '14px',
    cursor: 'pointer',
    fontWeight: '500',
  },
};

export default RegisterPage;