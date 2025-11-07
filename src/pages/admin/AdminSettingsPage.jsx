import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/common/AdminLayout';
import useApi from '../../hooks/useApi';

const AdminSettingsPage = () => {
  const { loading, fetchData } = useApi();
  const [settings, setSettings] = useState({});
  const [activeTab, setActiveTab] = useState('general');
  const [hasChanges, setHasChanges] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    fetchSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await fetchData('/controllers/admin-settings.php');
      if (data) {
        setSettings(data);
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
    }
  };

  const handleSettingChange = (categoryKey, settingId, newValue) => {
    setSettings(prev => ({
      ...prev,
      [categoryKey]: prev[categoryKey].map(setting =>
        setting.id === settingId
          ? { ...setting, value: newValue }
          : setting
      )
    }));
    setHasChanges(true);
    setSaveMessage('');
  };

  const handleSave = async () => {
    try {
      // Flatten all settings for the update
      const allSettings = [];
      Object.values(settings).forEach(categorySettings => {
        categorySettings.forEach(setting => {
          allSettings.push({
            id: setting.id,
            value: setting.value
          });
        });
      });

      const response = await fetch('http://localhost/hotel-booking/api/controllers/admin-settings.php', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ settings: allSettings })
      });

      const data = await response.json();

      if (data.success) {
        setSaveMessage('Settings saved successfully!');
        setHasChanges(false);
        setTimeout(() => setSaveMessage(''), 3000);
      } else {
        setSaveMessage('Error saving settings: ' + data.message);
      }
    } catch (err) {
      console.error('Error saving settings:', err);
      setSaveMessage('Error saving settings');
    }
  };

  const categories = [
    { key: 'general', label: 'General', icon: '🏨' },
    { key: 'booking', label: 'Booking', icon: '📅' },
    { key: 'checkin', label: 'Check-in/Out', icon: '🕐' },
    { key: 'pricing', label: 'Pricing', icon: '💰' },
    { key: 'notifications', label: 'Notifications', icon: '🔔' },
    { key: 'system', label: 'System', icon: '⚙️' }
  ];

  const renderSettingInput = (setting, categoryKey) => {
    const { id, key, value, type, label, description } = setting;

    switch (type) {
      case 'boolean':
        return (
          <div key={id} className="flex items-center justify-between py-4 border-b border-gray-200">
            <div className="flex-1">
              <label className="font-medium text-gray-900">{label}</label>
              {description && (
                <p className="text-sm text-gray-500 mt-1">{description}</p>
              )}
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={value === 'true'}
                onChange={(e) => handleSettingChange(categoryKey, id, e.target.checked ? 'true' : 'false')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        );

      case 'number':
        return (
          <div key={id} className="py-4 border-b border-gray-200">
            <label className="block font-medium text-gray-900 mb-2">{label}</label>
            {description && (
              <p className="text-sm text-gray-500 mb-2">{description}</p>
            )}
            <input
              type="number"
              value={value}
              onChange={(e) => handleSettingChange(categoryKey, id, e.target.value)}
              className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        );

      case 'time':
        return (
          <div key={id} className="py-4 border-b border-gray-200">
            <label className="block font-medium text-gray-900 mb-2">{label}</label>
            {description && (
              <p className="text-sm text-gray-500 mb-2">{description}</p>
            )}
            <input
              type="time"
              value={value}
              onChange={(e) => handleSettingChange(categoryKey, id, e.target.value)}
              className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        );

      case 'email':
        return (
          <div key={id} className="py-4 border-b border-gray-200">
            <label className="block font-medium text-gray-900 mb-2">{label}</label>
            {description && (
              <p className="text-sm text-gray-500 mb-2">{description}</p>
            )}
            <input
              type="email"
              value={value}
              onChange={(e) => handleSettingChange(categoryKey, id, e.target.value)}
              className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        );

      default: // text
        return (
          <div key={id} className="py-4 border-b border-gray-200">
            <label className="block font-medium text-gray-900 mb-2">{label}</label>
            {description && (
              <p className="text-sm text-gray-500 mb-2">{description}</p>
            )}
            <input
              type="text"
              value={value}
              onChange={(e) => handleSettingChange(categoryKey, id, e.target.value)}
              className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        );
    }
  };

  if (loading || !Object.keys(settings).length) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Configure hotel settings, preferences, and system configurations</p>
      </div>

      {/* Save Bar */}
      {hasChanges && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-yellow-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="text-yellow-700">You have unsaved changes</span>
          </div>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
      )}

      {/* Success Message */}
      {saveMessage && (
        <div className={`p-4 mb-6 rounded-md ${saveMessage.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {saveMessage}
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px overflow-x-auto">
            {categories.map(category => (
              <button
                key={category.key}
                onClick={() => setActiveTab(category.key)}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${
                  activeTab === category.key
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="p-6">
          {settings[activeTab] && settings[activeTab].length > 0 ? (
            <div className="space-y-2">
              {settings[activeTab].map(setting => renderSettingInput(setting, activeTab))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>No settings available for this category</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-6 flex justify-end space-x-4">
        <button
          onClick={() => {
            fetchSettings();
            setHasChanges(false);
            setSaveMessage('');
          }}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
        >
          Reset Changes
        </button>
        <button
          onClick={handleSave}
          disabled={!hasChanges}
          className={`px-6 py-2 rounded-md transition-colors ${
            hasChanges
              ? 'bg-primary text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Save All Settings
        </button>
      </div>
    </AdminLayout>
  );
};

export default AdminSettingsPage;
