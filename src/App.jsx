import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import DashboardPage from './pages/DashboardPage';
import EmployeeFormPage from './pages/EmployeeFormPage';
import { EmployeeProvider } from './context/EmployeeContext';

function App() {
  return (
    <EmployeeProvider>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
        {/* Navigation bar with Home and Employee form links */}
        <Navbar />

        {/* Main Page Routing */}
        <main className="flex-1">
          <Routes>
            {/* Home / Employee Dashboard (both are same) */}
            <Route path="/" element={<DashboardPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />

            {/* Employee Form route */}
            <Route path="/employee-form" element={<EmployeeFormPage />} />

            {/* Catch-all redirect to Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p>
              &copy; {new Date().getFullYear()} <strong className="text-slate-700">StaffSync</strong> &bull; Employee Dashboard & Management
            </p>
            <div className="flex items-center gap-4 text-xs">
              <span className="text-slate-400">Powered by React &amp; Tailwind CSS</span>
              <span>&bull;</span>
              <span className="text-slate-400">Data: JSONPlaceholder API + Custom Submissions</span>
            </div>
          </div>
        </footer>
      </div>
    </EmployeeProvider>
  );
}

export default App;
