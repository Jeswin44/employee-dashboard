import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  UserPlus,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Briefcase,
  MapPin,
  DollarSign,
  User,
  Sparkles,
  Info,
  Building2,
  Trash2
} from 'lucide-react';

const INITIAL_FORM = {
  name: '',
  designation: '',
  location: '',
  salary: '',
};

const POPULAR_DESIGNATIONS = [
  'Software Engineer',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Engineer',
  'UI/UX Designer',
  'Product Manager',
  'Data Scientist',
  'DevOps Engineer',
  'HR Specialist'
];

const EmployeeFormPage = () => {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submittedList, setSubmittedList] = useState([]);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [lastSubmitted, setLastSubmitted] = useState(null);

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field as user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // Quick-select helper for designation
  const handleSelectDesignation = (role) => {
    setFormData((prev) => ({ ...prev, designation: role }));
    if (errors.designation) {
      setErrors((prev) => ({ ...prev, designation: '' }));
    }
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Employee Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.designation.trim()) {
      newErrors.designation = 'Designation is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.salary) {
      newErrors.salary = 'Salary is required';
    } else if (isNaN(formData.salary) || Number(formData.salary) <= 0) {
      newErrors.salary = 'Salary must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const newRecord = {
      id: Date.now(),
      name: formData.name.trim(),
      designation: formData.designation.trim(),
      location: formData.location.trim(),
      salary: Number(formData.salary),
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    console.log('Employee Form Submitted (Frontend State Only):', newRecord);

    setSubmittedList((prev) => [newRecord, ...prev]);
    setLastSubmitted(newRecord);
    setShowSuccessAlert(true);
    setFormData(INITIAL_FORM);
    setErrors({});

    // Auto-scroll to top of alert
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset form
  const handleReset = () => {
    setFormData(INITIAL_FORM);
    setErrors({});
    setShowSuccessAlert(false);
  };

  // Format currency
  const formatSalary = (amount) => {
    if (!amount) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600 inline-flex">
              <UserPlus className="w-6 h-6" />
            </span>
            Employee Onboarding Form
          </h1>
          <p className="text-sm text-slate-500">
            Fill in the employee credentials below. (Frontend state capture; no external POST needed)
          </p>
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg shadow-xs hover:bg-slate-50 transition-colors self-start sm:self-auto"
        >
          <span>View All Employees</span>
        </Link>
      </div>

      {/* Success Notification Alert */}
      {showSuccessAlert && lastSubmitted && (
        <div className="p-4 sm:p-5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 shadow-xs animate-fadeIn flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-sm sm:text-base text-emerald-900">
                Employee Registered Successfully!
              </h3>
              <p className="text-xs sm:text-sm text-emerald-700 mt-0.5">
                <strong>{lastSubmitted.name}</strong> as{' '}
                <strong>{lastSubmitted.designation}</strong> ({lastSubmitted.location}) has been
                recorded in session state.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowSuccessAlert(false)}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 px-3 py-1.5 rounded-md hover:bg-emerald-100 transition-colors self-end sm:self-auto"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Grid: Form on Left, Live Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Container (7 cols on lg) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8">
          <div className="border-b border-slate-100 pb-4 mb-6">
            <h2 className="text-lg font-bold text-slate-900">Employee Details</h2>
            <p className="text-xs text-slate-500 mt-1">
              All 4 fields are required: Name, Designation, Location, and Salary.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            {/* Field 1: Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-slate-700 mb-1.5"
              >
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Eleanor Vance"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                    errors.name
                      ? 'border-rose-300 focus:ring-rose-400 bg-rose-50/20'
                      : 'border-slate-300 focus:ring-indigo-500 focus:border-indigo-500 bg-white'
                  }`}
                />
              </div>
              {errors.name && (
                <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1 font-medium">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Field 2: Designation */}
            <div>
              <label
                htmlFor="designation"
                className="block text-sm font-semibold text-slate-700 mb-1.5"
              >
                Designation / Job Role <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Briefcase className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  id="designation"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  placeholder="e.g. Senior Frontend Architect"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                    errors.designation
                      ? 'border-rose-300 focus:ring-rose-400 bg-rose-50/20'
                      : 'border-slate-300 focus:ring-indigo-500 focus:border-indigo-500 bg-white'
                  }`}
                />
              </div>
              {errors.designation && (
                <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1 font-medium">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {errors.designation}
                </p>
              )}

              {/* Quick Select Chips */}
              <div className="mt-2.5">
                <span className="text-xs text-slate-400 block mb-1.5">
                  Suggestions:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_DESIGNATIONS.slice(0, 5).map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => handleSelectDesignation(role)}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                        formData.designation === role
                          ? 'bg-indigo-50 border-indigo-300 text-indigo-700 font-medium'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Field 3: Location */}
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-semibold text-slate-700 mb-1.5"
              >
                Office Location / Base <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <MapPin className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. San Francisco, CA or Remote"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                    errors.location
                      ? 'border-rose-300 focus:ring-rose-400 bg-rose-50/20'
                      : 'border-slate-300 focus:ring-indigo-500 focus:border-indigo-500 bg-white'
                  }`}
                />
              </div>
              {errors.location && (
                <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1 font-medium">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {errors.location}
                </p>
              )}
            </div>

            {/* Field 4: Salary */}
            <div>
              <label
                htmlFor="salary"
                className="block text-sm font-semibold text-slate-700 mb-1.5"
              >
                Annual Salary (USD $) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <DollarSign className="h-4 w-4" />
                </div>
                <input
                  type="number"
                  id="salary"
                  name="salary"
                  min="0"
                  step="1000"
                  value={formData.salary}
                  onChange={handleChange}
                  placeholder="e.g. 95000"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                    errors.salary
                      ? 'border-rose-300 focus:ring-rose-400 bg-rose-50/20'
                      : 'border-slate-300 focus:ring-indigo-500 focus:border-indigo-500 bg-white'
                  }`}
                />
              </div>
              {errors.salary && (
                <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1 font-medium">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {errors.salary}
                </p>
              )}
            </div>

            {/* Form Action Buttons */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300"
              >
                <RotateCcw className="w-4 h-4 text-slate-400" />
                <span>Reset</span>
              </button>

              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 shadow-md shadow-indigo-100 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Submit Employee</span>
              </button>
            </div>
          </form>
        </div>

        {/* Live Preview & Session Records (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Live Preview Card */}
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl text-white p-6 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl"></div>

            <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Live Card Preview</span>
              </div>
              <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-slate-300">
                Auto-updating
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-inner border border-white/10">
                  {formData.name.trim()
                    ? formData.name
                        .trim()
                        .split(' ')
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join('')
                        .toUpperCase()
                    : '?'}
                </div>
                <div>
                  <h3 className="text-xl font-bold truncate">
                    {formData.name.trim() || 'Employee Name'}
                  </h3>
                  <p className="text-sm text-indigo-200">
                    {formData.designation.trim() || 'Designation / Role'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10 text-xs">
                <div>
                  <span className="text-slate-400 block">Location</span>
                  <span className="font-semibold text-slate-100 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                    {formData.location.trim() || 'Not specified'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Compensation</span>
                  <span className="font-semibold text-emerald-400 flex items-center gap-1 mt-0.5">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                    {formData.salary ? formatSalary(formData.salary) : '$0 / yr'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Session Submissions Log */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Submitted This Session
                </h3>
                <p className="text-xs text-slate-500">
                  In-memory records created via this form
                </p>
              </div>
              <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold">
                {submittedList.length}
              </span>
            </div>

            {submittedList.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs space-y-1">
                <Info className="w-5 h-5 mx-auto text-slate-300" />
                <p>No employees submitted yet in this session.</p>
                <p className="text-[11px] text-slate-400">
                  Submit the form above to record an employee.
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {submittedList.map((emp) => (
                  <div
                    key={emp.id}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100/80 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">
                          {emp.name}
                        </h4>
                        <p className="text-xs text-indigo-600 font-medium">
                          {emp.designation}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                        {formatSalary(emp.salary)}
                      </span>
                    </div>
                    <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {emp.location}
                      </span>
                      <span>Added at {emp.createdAt}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeFormPage;
