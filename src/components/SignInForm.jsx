import { useState } from 'react';

// Main reusable component
const AccountForm = ({ 
  onSignIn, 
  onCreateAccount, 
  onForgotPassword,
  onContactSupport,
  defaultView = 'signin' // 'signin' or 'createaccount'
}) => {
  const [isSignIn, setIsSignIn] = useState(defaultView === 'signin');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: '',
    confirmPassword: '',
    rememberMe: false,
    subscribeUpdates: false,
    agreeTerms: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = () => {
    if (isSignIn && onSignIn) {
      onSignIn({
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe
      });
    } else if (!isSignIn && onCreateAccount) {
      onCreateAccount({
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        subscribeUpdates: formData.subscribeUpdates,
        agreeTerms: formData.agreeTerms
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 w-full max-w-4xl">
      <div className="flex gap-2 mb-8">
        <button
          onClick={() => setIsSignIn(true)}
          className={`px-6 py-2.5 rounded-md font-medium transition-colors ${
            isSignIn
              ? 'bg-gray-900 text-white'
              : 'bg-transparent text-gray-600 hover:bg-gray-100'
          }`}
        >
          Sign In
        </button>
        <button
          onClick={() => setIsSignIn(false)}
          className={`px-6 py-2.5 rounded-md font-medium transition-colors ${
            !isSignIn
              ? 'bg-gray-900 text-white'
              : 'bg-transparent text-gray-600 hover:bg-gray-100'
          }`}
        >
          Create Account
        </button>
      </div>

      <div>
        {isSignIn ? (
          <div>
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@email.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>

            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                />
                <span className="ml-2 text-gray-700">Remember me</span>
              </label>
              <button 
                onClick={onForgotPassword}
                className="text-gray-600 hover:text-gray-900 text-sm"
              >
                Forgot?
              </button>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-gray-900 text-white py-3.5 rounded-md font-medium hover:bg-gray-800 transition-colors"
            >
              Sign In
            </button>

            <div className="mt-6 text-sm text-gray-600">
              Problems?{' '}
              <button 
                onClick={onForgotPassword}
                className="underline hover:text-gray-900"
              >
                Reset password
              </button>
              {' · '}
              <button 
                onClick={onContactSupport}
                className="underline hover:text-gray-900"
              >
                Contact support
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Full name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Riya Sharma"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+91 98XX-XXXXXX"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@email.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Min 8 characters"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Confirm password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Re-enter password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <label className="flex items-start cursor-pointer">
                <input
                  type="checkbox"
                  name="subscribeUpdates"
                  checked={formData.subscribeUpdates}
                  onChange={handleInputChange}
                  className="w-4 h-4 mt-0.5 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                />
                <span className="ml-2 text-gray-700">
                  Subscribe to product updates (optional)
                </span>
              </label>
              <label className="flex items-start cursor-pointer">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleInputChange}
                  className="w-4 h-4 mt-0.5 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                />
                <span className="ml-2 text-gray-700">
                  I agree to the{' '}
                  <button className="underline hover:text-gray-900">
                    Terms
                  </button>
                  {' & '}
                  <button className="underline hover:text-gray-900">
                    Privacy
                  </button>
                </span>
              </label>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-gray-900 text-white py-3.5 rounded-md font-medium hover:bg-gray-800 transition-colors"
            >
              Create Account
            </button>

            <div className="mt-6 text-sm text-gray-600">
              Problems?{' '}
              <button 
                onClick={onForgotPassword}
                className="underline hover:text-gray-900"
              >
                Reset password
              </button>
              {' · '}
              <button 
                onClick={onContactSupport}
                className="underline hover:text-gray-900"
              >
                Contact support
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

