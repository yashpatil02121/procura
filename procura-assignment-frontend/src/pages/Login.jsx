import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Clear any existing tokens when login page loads to force fresh authentication
  useEffect(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log('Login page - Cleared existing tokens');
  }, []);

  const styles = {
    container: {
      minHeight: '100vh',
      minWidth: '100vw',
      background: 'linear-gradient(to bottom right, #bae6fd, #3b82f6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      fontFamily: 'Arial, sans-serif',
    },
    card: {
      width: '100%',
      maxWidth: '24rem',
      backgroundColor: 'white',
      borderRadius: '1rem',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      overflow: 'hidden',
    },
    header: {
      background: 'linear-gradient(to right, #3b82f6, #1d4ed8)',
      color: 'white',
      padding: '1.5rem',
      textAlign: 'center',
    },
    headerTitle: {
      fontSize: '1.875rem',
      fontWeight: 'bold',
    },
    content: {
      padding: '2rem',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
    },
    label: {
      display: 'block',
      marginBottom: '0.5rem',
      fontSize: '0.875rem',
      color: '#4b5563',
    },
    input: {
      width: '100%',
      padding: '0.75rem',
      border: '1px solid #d1d5db',
      borderRadius: '0.5rem',
      transition: 'all 0.3s ease',
    },
    inputFocus: {
      outline: 'none',
      borderColor: '#3b82f6',
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.5)',
    },
    button: {
      width: '100%',
      padding: '0.75rem',
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      borderRadius: '0.5rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    buttonHover: {
      backgroundColor: '#2563eb',
      transform: 'scale(1.02)',
    },
    errorMessage: {
      backgroundColor: '#fee2e2',
      color: '#b91c1c',
      padding: '0.75rem',
      borderRadius: '0.5rem',
      marginBottom: '1.5rem',
    },
    signupLink: {
      marginTop: '1.5rem',
      textAlign: 'center',
      fontSize: '0.875rem',
      color: '#6b7280',
    },
    link: {
      color: '#3b82f6',
      textDecoration: 'none',
    },
    passwordContainer: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
    },
    eyeIcon: {
      position: 'absolute',
      right: '0.75rem',
      cursor: 'pointer',
      color: '#6b7280',
      fontSize: '1.25rem',
      userSelect: 'none',
      zIndex: 1,
    },
    eyeIconHover: {
      color: '#3b82f6',
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("http://localhost:3000/auth/login", {
        email,
        password,
      });
      
      // Store token and user data
      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      
      console.log('Login successful - Token stored:', res.data.access_token.substring(0, 50) + '...');
      console.log('Login successful - User stored:', res.data.user);
      
      // Test the auth profile endpoint
      try {
        const profileRes = await axios.get("http://localhost:3000/auth/profile", {
          headers: { Authorization: `Bearer ${res.data.access_token}` }
        });
        console.log('Profile test successful:', profileRes.data);
      } catch (profileErr) {
        console.error('Profile test failed:', profileErr);
      }
      
      // Navigate to home page after successful login
      navigate("/");
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || "Invalid email or password");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.headerTitle}>Login</h2>
        </div>
        <div style={styles.content}>
          {error && (
            <div style={styles.errorMessage}>
              {error}
            </div>
          )}
          <form onSubmit={handleLogin} style={styles.form}>
            <div>
              <label htmlFor="email" style={styles.label}>
                Email Address
              </label>
              <input 
                id="email"
                type="email" 
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  ...styles.input,
                  ':focus': styles.inputFocus
                }}
                required 
              />
            </div>
            <div>
              <label htmlFor="password" style={styles.label}>
                Password
              </label>
              <div style={styles.passwordContainer}>
                <input 
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    ...styles.input,
                    paddingRight: '3rem',
                    ':focus': styles.inputFocus
                  }}
                  required 
                />
                <span 
                  style={styles.eyeIcon}
                  onClick={togglePasswordVisibility}
                  onMouseEnter={(e) => e.target.style.color = styles.eyeIconHover.color}
                  onMouseLeave={(e) => e.target.style.color = styles.eyeIcon.color}
                >
                  {showPassword ? '🙈' : '👁️'}
                </span>
              </div>
            </div>
            <div>
              <button 
                type="submit" 
                style={{
                  ...styles.button,
                  ':hover': styles.buttonHover
                }}
              >
                Sign In
              </button>
            </div>
          </form>
          <div style={styles.signupLink}>
            <p>
              Don't have an account? 
              <span 
                style={{...styles.link, cursor: 'pointer'}} 
                onClick={() => navigate('/signup')}
              >
                {" "}Sign Up
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
