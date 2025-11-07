import React from 'react';
import AdminLayout from '../../components/common/AdminLayout';

const ComingSoon = ({ title, description }) => {
  return (
    <AdminLayout>
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="mb-6">
            <svg className="w-24 h-24 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">{title || 'Coming Soon'}</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            {description || 'This feature is under development and will be available soon.'}
          </p>
          <div className="inline-block px-6 py-3 bg-blue-100 text-blue-700 rounded-lg">
            <span className="font-semibold">Feature in Development</span>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ComingSoon;
