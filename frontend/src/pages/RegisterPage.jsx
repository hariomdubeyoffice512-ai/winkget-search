import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser, verifyOTP } from '../services/api';
import { useAuth } from '../context/AuthContext';

function RegisterPage() {
  const [step, setStep] = useState(1); // Step 1: Form, Step 2: OTP
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    username: '',
    dob: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [otp, setOtp] = useState('');
  const [userId, setUserId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Step 1 — Register
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    setLoading(true);

    try {
      const res = await registerUser({
        firstName: form.firstName,
        lastName: form.lastName,
        username: form.username,
        dob: form.dob,
        phone: form.phone,
        password: form.password,
      });

      setUserId(res.data.userId);

      // Auto fill OTP
      setOtp(res.data.devOTP);

      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }

    setLoading(false);
  };

  // Step 2 — Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await verifyOTP({ userId, otp });

      // Save token and user
      localStorage.setItem('winkget_token', res.data.token);
      localStorage.setItem('winkget_user', JSON.stringify(res.data.user));

      navigate('/');
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || 'OTP verification failed');
    }

    setLoading(false);
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

        {/* STEP 1 — Registration Form */}
        {step === 1 && (
          <>
            <h2 style={styles.title}>Create your Winkget Account</h2>
            <p style={styles.subtitle}>One account for all Winkget platforms</p>

            {error && <div style={styles.error}>{error}</div>}

            <form onSubmit={handleRegister}>
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

              {/* Username */}
              <div style={styles.usernameWrap}>
                <input
                  type="text"
                  name="username"
                  placeholder="Choose username"
                  value={form.username}
                  onChange={handleChange}
                  style={styles.usernameInput}
                  required
                />
                <span style={styles.domain}>@winkget.com</span>
              </div>

              {form.username && (
                <div style={styles.emailPreview}>
                  📧 Your email: <strong>{form.username}@winkget.com</strong>
                </div>
              )}

              <input
                type="date"
                name="dob"
                value={form.dob}
                onChange={handleChange}
                style={styles.input}
                required
              />

              <input
                type="tel"
                name="phone"
                placeholder="Phone number"
                value={form.phone}
                onChange={handleChange}
                style={styles.input}
                required
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                style={styles.input}
                required
              />

              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                value={form.confirmPassword}
                onChange={handleChange}
                style={styles.input}
                required
              />

              <div style={styles.btnRow}>
                <a href="/login" style={styles.loginLink}>Already have an account?</a>
                <button type="submit" style={styles.btn} disabled={loading}>
                  {loading ? 'Please wait...' : 'Next'}
                </button>
              </div>
            </form>
          </>
        )}

        {/* STEP 2 — OTP Verification */}
        {step === 2 && (
          <>
            <h2 style={styles.title}>Verify your phone</h2>
            <p style={styles.subtitle}>
              OTP sent to <strong>{form.phone}</strong>
            </p>

            {/* Dev notice */}
            <div style={styles.devNotice}>
              🛠️ Development mode — OTP auto filled
            </div>

            {error && <div style={styles.error}>{error}</div>}

            <form onSubmit={handleVerifyOTP}>
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                style={styles.input}
                maxLength={6}
                required
              />

              <div style={styles.btnRow}>
                <span
                  style={styles.loginLink}
                  onClick={() => setStep(1)}
                >
                  ← Go back
                </span>
                <button type="submit" style={styles.btn} disabled={loading}>
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </button>
              </div>
            </form>
          </>
        )}

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
  error: {
    backgroundColor: '#FEE2E2',
    border: '1px solid #FECACA',
    borderRadius: '6px',
    padding: '10px 14px',
    fontSize: '13px',
    color: '#DC2626',
    marginBottom: '16px',
  },
  devNotice: {
    backgroundColor: '#FEF3C7',
    border: '1px solid #FDE68A',
    borderRadius: '6px',
    padding: '10px 14px',
    fontSize: '13px',
    color: '#92400E',
    marginBottom: '16px',
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
    cursor: 'pointer',
  },
  btn: {
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