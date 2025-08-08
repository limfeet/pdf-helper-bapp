"use client"

import React from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Camera, 
  Save, 
  Edit3, 
  Shield, 
  Bell, 
  Globe, 
  Moon, 
  Sun, 
  Key, 
  CreditCard, 
  Settings, 
  FileText,
  Upload,
  Check,
  X,
  AlertTriangle
} from 'lucide-react';

const ProfilePage = () => {
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('profile');
  const [showSaveNotification, setShowSaveNotification] = React.useState(false);

  const [profileData, setProfileData] = React.useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    organization: 'Tech Corp',
    address: '123 Main St, San Francisco, CA 94105',
    bio: 'Senior Product Manager with 8+ years of experience in AI and document processing solutions.',
    timezone: 'America/Los_Angeles',
    language: 'English'
  });

  const [preferences, setPreferences] = React.useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyReport: true,
    productUpdates: true,
    darkMode: false,
    autoSave: true
  });

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleSave = () => {
    setIsEditing(false);
    setShowSaveNotification(true);
    setTimeout(() => setShowSaveNotification(false), 3000);
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handlePreferenceChange = (preference: string, value: boolean) => {
    setPreferences(prev => ({ ...prev, [preference]: value }));
  };

import React from 'react';
import { CreditCard, Download } from 'lucide-react';

const BillingTab = () => {
  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 transition-colors duration-300">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 transition-colors duration-300">
          Current Plan
        </h3>
        
        <div className="p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg transition-colors duration-300">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-200 transition-colors duration-300">
                Professional Plan
              </h4>
              <p className="text-blue-700 dark:text-blue-300 transition-colors duration-300">
                $29/month • Billed monthly
              </p>
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-2 transition-colors duration-300">
                Next billing: January 15, 2025
              </p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 text-sm">
              Upgrade Plan
            </button>
          </div>
        </div>

        {/* Usage Stats */}
        <div className="mt-6">
          <h4 className="font-medium text-gray-900 dark:text-white mb-4 transition-colors duration-300">
            Usage this month
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg transition-colors duration-300">
              <div className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
                127
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
                Documents processed
              </div>
            </div>
            <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg transition-colors duration-300">
              <div className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
                3.2GB
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
                Storage used
              </div>
            </div>
            <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg transition-colors duration-300">
              <div className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
                1,847
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
                API calls
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 transition-colors duration-300">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 transition-colors duration-300">
          Payment Method
        </h3>
        
        <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg transition-colors duration-300">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-400 rounded flex items-center justify-center text-white text-xs font-bold">
              VISA
            </div>
            <div>
              <div className="font-medium text-gray-900 dark:text-white transition-colors duration-300">
                •••• •••• •••• 4242
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
                Expires 12/27
              </div>
            </div>
          </div>
          <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-200">
            Update
          </button>
        </div>

        <button className="mt-4 w-full md:w-auto border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 flex items-center space-x-2">
          <CreditCard className="w-5 h-5" />
          <span>Add Payment Method</span>
        </button>
      </div>

      {/* Billing History */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 transition-colors duration-300">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
            Billing History
          </h3>
          <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-200">
            Download All
          </button>
        </div>
        
        <div className="space-y-4">
          {[
            { date: 'Dec 15, 2024', amount: '$29.00', status: 'Paid', invoice: 'INV-001' },
            { date: 'Nov 15, 2024', amount: '$29.00', status: 'Paid', invoice: 'INV-002' },
            { date: 'Oct 15, 2024', amount: '$29.00', status: 'Paid', invoice: 'INV-003' },
          ].map((bill, index) => (
            <div key={index} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg transition-colors duration-300">
              <div className="flex items-center space-x-4">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white transition-colors duration-300">
                    {bill.invoice}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
                    {bill.date}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="font-medium text-gray-900 dark:text-white transition-colors duration-300">
                    {bill.amount}
                  </div>
                  <div className="text-sm text-green-600 dark:text-green-400 transition-colors duration-300">
                    {bill.status}
                  </div>
                </div>
                <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium transition-colors duration-200 flex items-center space-x-1">
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};



  const tabs = [
    { id: 'profile', label: 'Profile Details', icon: User },
    { id: 'preferences', label: 'Preferences', icon: Settings },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'billing', label: 'Billing', icon: CreditCard }
  ];

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    PDF Helper
                  </span>
                </div>
                <div className="hidden md:block h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
                <h1 className="hidden md:block text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-300">
                  Profile Settings
                </h1>
              </div>

              <div className="flex items-center space-x-4">
                <button 
                  onClick={toggleDarkMode}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
                  aria-label="Toggle dark mode"
                >
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
                
                <button className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                  Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Save Notification */}
        {showSaveNotification && (
          <div className="fixed top-20 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-pulse">
            <Check className="w-5 h-5" />
            <span>Profile updated successfully!</span>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      <tab.icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  {/* Profile Header */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 transition-colors duration-300">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                      <div className="flex items-center space-x-6">
                        <div className="relative">
                          <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                            {profileData.firstName[0]}{profileData.lastName[0]}
                          </div>
                          <button className="absolute bottom-0 right-0 w-8 h-8 bg-white dark:bg-gray-700 rounded-full shadow-lg border-2 border-gray-100 dark:border-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-200">
                            <Camera className="w-4 h-4" />
                          </button>
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
                            {profileData.firstName} {profileData.lastName}
                          </h2>
                          <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">{profileData.organization}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">{profileData.email}</p>
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0 flex space-x-3">
                        {isEditing ? (
                          <>
                            <button
                              onClick={handleSave}
                              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center space-x-2"
                            >
                              <Save className="w-4 h-4" />
                              <span>Save Changes</span>
                            </button>
                            <button
                              onClick={() => setIsEditing(false)}
                              className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 flex items-center space-x-2"
                            >
                              <X className="w-4 h-4" />
                              <span>Cancel</span>
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => setIsEditing(true)}
                            className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 flex items-center space-x-2"
                          >
                            <Edit3 className="w-4 h-4" />
                            <span>Edit Profile</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Profile Form */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                          First Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 w-5 h-5 text-gray-400 dark:text-gray-500" />
                          <input
                            type="text"
                            value={profileData.firstName}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                            disabled={!isEditing}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 disabled:bg-gray-50 dark:disabled:bg-gray-800 transition-all duration-200"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                          Last Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 w-5 h-5 text-gray-400 dark:text-gray-500" />
                          <input
                            type="text"
                            value={profileData.lastName}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                            disabled={!isEditing}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 disabled:bg-gray-50 dark:disabled:bg-gray-800 transition-all duration-200"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400 dark:text-gray-500" />
                          <input
                            type="email"
                            value={profileData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            disabled={!isEditing}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 disabled:bg-gray-50 dark:disabled:bg-gray-800 transition-all duration-200"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                          Phone Number
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400 dark:text-gray-500" />
                          <input
                            type="tel"
                            value={profileData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            disabled={!isEditing}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 disabled:bg-gray-50 dark:disabled:bg-gray-800 transition-all duration-200"
                          />
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                          Organization
                        </label>
                        <input
                          type="text"
                          value={profileData.organization}
                          onChange={(e) => handleInputChange('organization', e.target.value)}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 disabled:bg-gray-50 dark:disabled:bg-gray-800 transition-all duration-200"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                          Address
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400 dark:text-gray-500" />
                          <input
                            type="text"
                            value={profileData.address}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                            disabled={!isEditing}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 disabled:bg-gray-50 dark:disabled:bg-gray-800 transition-all duration-200"
                          />
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                          Bio
                        </label>
                        <textarea
                          rows={4}
                          value={profileData.bio}
                          onChange={(e) => handleInputChange('bio', e.target.value)}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 disabled:bg-gray-50 dark:disabled:bg-gray-800 transition-all duration-200 resize-none"
                          placeholder="Tell us about yourself..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 transition-colors duration-300">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 transition-colors duration-300">
                    Notification Preferences
                  </h3>
                  
                  <div className="space-y-6">
                    {[
                      { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive email updates about your documents' },
                      { key: 'pushNotifications', label: 'Push Notifications', description: 'Get instant notifications in your browser' },
                      { key: 'weeklyReport', label: 'Weekly Report', description: 'Weekly summary of your document activity' },
                      { key: 'productUpdates', label: 'Product Updates', description: 'Updates about new features and improvements' },
                      { key: 'autoSave', label: 'Auto-save Documents', description: 'Automatically save your work' }
                    ].map((pref) => (
                      <div key={pref.key} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg transition-colors duration-300">
                        <div>
                          <h4 className="text-lg font-medium text-gray-900 dark:text-white transition-colors duration-300">{pref.label}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">{pref.description}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={preferences[pref.key as keyof typeof preferences]}
                            onChange={(e) => handlePreferenceChange(pref.key, e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4 transition-colors duration-300">Language & Region</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                          Language
                        </label>
                        <select className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200">
                          <option>English</option>
                          <option>Spanish</option>
                          <option>French</option>
                          <option>German</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                          Timezone
                        </label>
                        <select className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200">
                          <option>America/Los_Angeles</option>
                          <option>America/New_York</option>
                          <option>Europe/London</option>
                          <option>Asia/Tokyo</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 transition-colors duration-300">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 transition-colors duration-300">
                      Payment Method
                    </h3>
                    
                    <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg transition-colors duration-300">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-400 rounded flex items-center justify-center text-white text-xs font-bold">
                          VISA
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white transition-colors duration-300">•••• •••• •••• 4242</div>
                          <div className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">Expires 12/27</div>
                        </div>
                      </div>
                      <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-200">
                        Update
                      </button>
                    </div>

                    <button className="mt-4 w-full md:w-auto border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 flex items-center space-x-2">
                      <CreditCard className="w-5 h-5" />
                      <span>Add Payment Method</span>
                    </button>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 transition-colors duration-300">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
                        Billing History
                      </h3>
                      <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-200">
                        Download All
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      {[
                        { date: 'Dec 15, 2024', amount: '$29.00', status: 'Paid', invoice: 'INV-001' },
                        { date: 'Nov 15, 2024', amount: '$29.00', status: 'Paid', invoice: 'INV-002' },
                        { date: 'Oct 15, 2024', amount: '$29.00', status: 'Paid', invoice: 'INV-003' },
                      ].map((bill, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg transition-colors duration-300">
                          <div className="flex items-center space-x-4">
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white transition-colors duration-300">{bill.invoice}</div>
                              <div className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">{bill.date}</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <div className="font-medium text-gray-900 dark:text-white transition-colors duration-300">{bill.amount}</div>
                              <div className="text-sm text-green-600 dark:text-green-400 transition-colors duration-300">{bill.status}</div>
                            </div>
                            <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium transition-colors duration-200">
                              Download
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
