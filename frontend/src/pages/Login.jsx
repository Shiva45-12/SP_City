import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, Building2, Sparkles, Star, User, Shield, Users, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'admin'
  });
  const [particles, setParticles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Generate floating particles
  useEffect(() => {
    const newParticles = [];
    for (let i = 0; i < 50; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 2,
        duration: Math.random() * 20 + 10
      });
    }
    setParticles(newParticles);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock authentication with role-based credentials
    const users = {
      admin: { username: 'admin', password: 'admin123', role: 'admin', name: 'Admin User', email: 'admin@spcity.com' },
      associate: { username: 'rajesh', password: 'rajesh123', role: 'associate', name: 'Rajesh Kumar', email: 'rajesh@spcity.com' }
    };

    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const user = users[formData.role];
    if (user && user.username === formData.username && user.password === formData.password) {
      const userData = {
        ...user,
        isAuthenticated: true,
        loginTime: new Date().toISOString()
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      login(userData);
      
      // Navigate based on role
      if (formData.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/associate/dashboard');
      }
    } else {
      setIsLoading(false);
      alert('Invalid credentials');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-600 via-red-400 to-gray-500">
        {/* Animated Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-300/15 via-gray-300/25 to-red-300/15 animate-pulse"></div>

        {/* Floating Particles */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-red-500/20 animate-bounce"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animationDuration: `${particle.duration}s`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}

        {/* Geometric Shapes */}
        <div className="absolute top-20 left-20 w-32 h-32 border border-red-500/20 rounded-full animate-spin" style={{ animationDuration: '20s' }}></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 border border-red-300/20 rotate-45 animate-pulse"></div>
        <div className="absolute top-1/2 left-10 w-16 h-16 bg-gradient-to-r from-red-500/20 to-black/30 rounded-lg animate-bounce" style={{ animationDelay: '2s' }}></div>

        {/* Glowing Orbs */}
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-red-700/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '3s' }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">


          {/* Login Form */}
          <div className="backdrop-blur-xl bg-black/20 border border-red-500/30 rounded-3xl p-8 shadow-2xl animate-slide-up relative overflow-hidden" style={{ animationDelay: '0.4s' }}>
            {/* Animated Background Video Effect */}
            <div className="absolute inset-0 opacity-20">
              <video 
                autoPlay 
                loop 
                muted 
                playsInline
                className="w-full h-full object-cover rounded-3xl"
                style={{ filter: 'blur(1px)' }}
              >
                <source src="https://cdn.dribbble.com/userupload/43522911/file/original-716386c3f619ce8f33105de366118684.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-black/40 rounded-3xl"></div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              {/* Role Selection */}
              <div className="space-y-3">
                {/* <label className="block text-sm font-medium text-white/90 text-center">
                  Login
                </label> */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, role: 'admin'})}
                    className={`relative p-4 rounded-2xl border-2 transition-all duration-300 group ${
                      formData.role === 'admin'
                        ? 'bg-gradient-to-r from-red-600 to-black border-red-400 shadow-lg shadow-red-500/25'
                        : 'bg-black/20 border-red-500/30 hover:border-red-400/50 hover:bg-black/30'
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <Shield className={`w-6 h-6 transition-colors ${
                        formData.role === 'admin' ? 'text-white' : 'text-red-300 group-hover:text-red-200'
                      }`} />
                      <span className={`text-sm font-medium transition-colors ${
                        formData.role === 'admin' ? 'text-white' : 'text-white/80 group-hover:text-white'
                      }`}>
                        Admin
                      </span>
                    </div>
                    {formData.role === 'admin' && (
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-500/20 to-black/20 animate-pulse"></div>
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, role: 'associate'})}
                    className={`relative p-4 rounded-2xl border-2 transition-all duration-300 group ${
                      formData.role === 'associate'
                        ? 'bg-gradient-to-r from-red-600 to-black border-red-400 shadow-lg shadow-red-500/25'
                        : 'bg-black/20 border-red-500/30 hover:border-red-400/50 hover:bg-black/30'
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <Users className={`w-6 h-6 transition-colors ${
                        formData.role === 'associate' ? 'text-white' : 'text-red-300 group-hover:text-red-200'
                      }`} />
                      <span className={`text-sm font-medium transition-colors ${
                        formData.role === 'associate' ? 'text-white' : 'text-white/80 group-hover:text-white'
                      }`}>
                        Associate
                      </span>
                    </div>
                    {formData.role === 'associate' && (
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-500/20 to-black/20 animate-pulse"></div>
                    )}
                  </button>
                </div>
              </div>

              {/* Username Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/90">
                  Username
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="w-5 h-5 text-red-300 group-focus-within:text-red-200 transition-colors" />
                  </div>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-black/20 border border-red-500/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all duration-300 text-white placeholder-white/50 backdrop-blur-sm"
                    placeholder="Enter username"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/90">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-red-300 group-focus-within:text-red-200 transition-colors" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-12 pr-14 py-4 bg-black/20 border border-red-500/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all duration-300 text-white placeholder-white/50 backdrop-blur-sm"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center hover:scale-110 transition-transform"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-red-300 hover:text-red-200" />
                    ) : (
                      <Eye className="w-5 h-5 text-red-300 hover:text-red-200" />
                    )}
                  </button>
                </div>
              </div>


              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 rounded-2xl font-semibold transform transition-all duration-300 shadow-lg relative overflow-hidden group ${
                  isLoading 
                    ? 'bg-gray-600 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-red-600 to-black text-white hover:from-red-700 hover:to-gray-900 hover:scale-105 hover:shadow-2xl'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Signing In...</span>
                  </div>
                ) : (
                  <>
                    <span className="relative z-10">Sign In to Dashboard</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-black to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { 
            transform: translateY(30px); 
            opacity: 0; 
          }
          to { 
            transform: translateY(0); 
            opacity: 1; 
          }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(180deg); }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 5px rgba(239, 68, 68, 0.5); }
          50% { box-shadow: 0 0 20px rgba(239, 68, 68, 0.8), 0 0 30px rgba(239, 68, 68, 0.6); }
        }
        
        .animate-fade-in {
          animation: fadeIn 1s ease-out forwards;
        }
        
        .animate-slide-up {
          animation: slideUp 0.8s ease-out forwards;
          opacity: 0;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Login;