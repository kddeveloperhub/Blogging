import React, { useEffect, useState } from 'react';
import './auth.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Auth = () => {
  const [activePanel, setActivePanel] = useState('sign-in');
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setActivePanel('sign-in'), 200);
    return () => clearTimeout(timer);
  }, []);

  const handleInputChange = (e, type) => {
    const { name, value } = e.target;
    if (type === 'login') {
      setLoginData(prev => ({ ...prev, [name]: value }));
    } else {
      setRegisterData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleRegister = async () => {
    const { name, email, password, confirm } = registerData;
    if (!name || !email || !password || !confirm) return alert('Please fill in all fields');
    if (password !== confirm) return alert('Passwords do not match');

    try {
      setLoading(true);
      const { data } = await axios.post('http://localhost:5000/api/auth/register', {
        name,
        email,
        password,
      });
      localStorage.setItem('user', JSON.stringify(data));
      alert('🎉 Registration successful!');
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || '❌ Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    const { email, password } = loginData;
    if (!email || !password) return alert('Please enter email and password');

    try {
      setLoading(true);
      const { data } = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });
      localStorage.setItem('user', JSON.stringify(data));
      alert('✅ Login successful!');
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || '❌ Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e, type) => {
    if (e.key === 'Enter') {
      type === 'login' ? handleLogin() : handleRegister();
    }
  };

  return (
    <div id="container" className={`container ${activePanel}`}>
      <div className="row">
        {/* SIGN UP */}
        <div className="col align-items-center flex-col sign-up">
          <div className="form-wrapper align-items-center">
            <div className="form sign-up">
              <div className="input-group">
                <i className="fas fa-user"></i>
                <input
                  type="text"
                  name="name"
                  placeholder="Username"
                  value={registerData.name}
                  onChange={(e) => handleInputChange(e, 'register')}
                  onKeyPress={(e) => handleKeyPress(e, 'register')}
                />
              </div>
              <div className="input-group">
                <i className="fas fa-envelope"></i>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={registerData.email}
                  onChange={(e) => handleInputChange(e, 'register')}
                  onKeyPress={(e) => handleKeyPress(e, 'register')}
                />
              </div>
              <div className="input-group">
                <i className="fas fa-lock"></i>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={registerData.password}
                  onChange={(e) => handleInputChange(e, 'register')}
                  onKeyPress={(e) => handleKeyPress(e, 'register')}
                />
              </div>
              <div className="input-group">
                <i className="fas fa-lock"></i>
                <input
                  type="password"
                  name="confirm"
                  placeholder="Confirm password"
                  value={registerData.confirm}
                  onChange={(e) => handleInputChange(e, 'register')}
                  onKeyPress={(e) => handleKeyPress(e, 'register')}
                />
              </div>
              <button onClick={handleRegister} disabled={loading}>
                {loading ? 'Creating account...' : 'Sign up'}
              </button>
              <p>
                <span>Already have an account?</span>
                <b onClick={() => setActivePanel('sign-in')} className="pointer"> Sign in here</b>
              </p>
            </div>
          </div>
        </div>

        {/* SIGN IN */}
        <div className="col align-items-center flex-col sign-in">
          <div className="form-wrapper align-items-center">
            <div className="form sign-in">
              <div className="input-group">
                <i className="fas fa-user"></i>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={loginData.email}
                  onChange={(e) => handleInputChange(e, 'login')}
                  onKeyPress={(e) => handleKeyPress(e, 'login')}
                />
              </div>
              <div className="input-group">
                <i className="fas fa-lock"></i>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={loginData.password}
                  onChange={(e) => handleInputChange(e, 'login')}
                  onKeyPress={(e) => handleKeyPress(e, 'login')}
                />
              </div>
              <button onClick={handleLogin} disabled={loading}>
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
              <p>
                <b>Forgot password?</b>
              </p>
              <p>
                <span>Don't have an account?</span>
                <b onClick={() => setActivePanel('sign-up')} className="pointer"> Sign up here</b>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT PANEL */}
      <div className="row content-row">
        <div className="col align-items-center flex-col">
          <div className="text sign-in">
            <h2>Welcome Back!</h2>
            <p>Sign in to manage your blogs and dashboard.</p>
          </div>
          <div className="img sign-in" />
        </div>
        <div className="col align-items-center flex-col">
          <div className="img sign-up" />
          <div className="text sign-up">
            <h2>Join with us</h2>
            <p>Create your account and start blogging!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
