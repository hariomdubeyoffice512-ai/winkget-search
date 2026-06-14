import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = (e) => {
    e.preventDefault();
    const success = login(email, password);
    if (success) {
      navigate('/');
    } else {
      setError('Invalid email or password');
    }
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
        <h2 style={styles.title}>Sign in</h2>
        <p style={styles.subtitle}>Use your Winkget Account</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Email (@winkget.com)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />

          <a href="#" style={styles.forgotLink}>Forgot password?</a>

          <div style={styles.btnRow}>
            <a href="/register" style={styles.createBtn}>Create account</a>
            <button type="submit" style={styles.loginBtn}>Next</button>
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
    maxWidth: '400px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
  },
  title: {
    fontSize: '24px',
    fontWeight: '400',
    color: '#202124',
    margin: '0 0 8px 0',
  },
  subtitle: {
    fontSize: '14px',
    color: '#70757a',
    margin: '0 0 24px 0',
  },
  error: {
    backgroundColor: '#FEE2E2',
    border: '1px solid #FECACA',
    borderRadius: '6px',
    padding: '10px 14px',
    fontSize: '13px',
    color: '#DC2626',
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
  forgotLink: {
    textDecoration: 'none',
    color: '#4F46E5',
    fontSize: '14px',
    display: 'block',
    marginBottom: '28px',
  },
  btnRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  createBtn: {
    textDecoration: 'none',
    color: '#4F46E5',
    fontSize: '14px',
    fontWeight: '500',
  },
  loginBtn: {
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

export default LoginPage;