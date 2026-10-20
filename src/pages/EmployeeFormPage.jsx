import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  Hash,
  Mail,
  ArrowRight
} from 'lucide-react';
import { useEmployees } from '../context/EmployeeContext';

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
  const navigate = useNavigate();
  const { addEmployee, getNextId, customEmployees } = useEmployees();

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    designation: '',
    location: '',
    salary: '',
    email: '',
  });

  const [errors, setErrors] = useState({});
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [lastSubmitted, setLastSubmitted] = useState(null);

  // Set default recommended ID on mount or when customEmployees change
  useEffect(() => {
    if (!formData.id) {
      setFormData((prev) => ({
        ...prev,
        id: String(getNextId()),
      }));
    }
  }, [getNextId]);

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      // Auto-suggest email based on name if user hasn't explicitly typed email
      if (name === 'name' && (!prev.email || prev.email.endsWith('@company.com'))) {
        const cleanName = value.toLowerCase().replace(/[^a-z0-9]/g, '.');
        updated.email = cleanName ? `${cleanName}@company.com` : '';
      }

      return updated;
    });

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

    if (!String(formData.id).trim()) {
      newErrors.id = 'Employee ID is required';
    }

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
      id: isNaN(formData.id) ? formData.id.trim() : Number(formData.id),
      name: formData.name.trim(),
      designation: formData.designation.trim(),
      location: formData.location.trim(),
      salary: Number(formData.salary),
      email: formData.email.trim() || `${formData.name.trim().toLowerCase().replace(/[^a-z0-9]/g, '')}@company.com`,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // Add to shared EmployeeContext & localStorage
    const savedRecord = addEmployee(newRecord);

    console.log('Employee successfully added to global list:', savedRecord);

    setLastSubmitted(savedRecord);
    setShowSuccessAlert(true);

    // Reset form with next available ID
    setFormData({
      id: String(getNextId() + 1),
      name: '',
      designation: '',
      location: '',
      salary: '',
      email: '',
    });
    setErrors({});

    // Auto-scroll to top of alert
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset form
  const handleReset = () => {
    setFormData({
      id: String(getNextId()),
      name: '',
      designation: '',
      location: '',
      salary: '',
      email: '',
    });
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
            Submit an employee ID and details to list them immediately in the main dashboard directory.
          </p>
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg shadow-xs hover:bg-slate-50 transition-colors self-start sm:self-auto"
        >
          <span>View Employee Dashboard</span>
        </Link>
      </div>

      {/* Success Notification Alert */}
      {showSuccessAlert && lastSubmitted && (
        <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 shadow-sm animate-fadeIn flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-base text-emerald-950 flex items-center gap-2">
                <span>Employee #{lastSubmitted.id} Added to Directory!</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-800">
                  Live in Dashboard
                </span>
              </h3>
              <p className="text-sm text-emerald-800 mt-1">
                <strong>{lastSubmitted.name}</strong> ({lastSubmitted.designation} &bull; {lastSubmitted.location}) has been added to the master employee list.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <button
              onClick={() => setShowSuccessAlert(false)}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition-colors"
            >
              Dismiss
            </button>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 shadow-xs transition-colors"
            >
              <span>View in Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Main Grid: Form on Left, Live Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Container (7 cols on lg) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8">
          <div className="border-b border-slate-100 pb-4 mb-6">
            <h2 className="text-lg font-bold text-slate-900">Employee Details</h2>
            <p className="text-xs text-slate-500 mt-1">
              Provide the Employee ID, Name, Designation, Location, and Salary.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            {/* Field 0: Employee ID */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="id"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Employee ID <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] text-slate-400">
                  Auto-suggested or custom ID
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Hash className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  id="id"
                  name="id"
                  value={formData.id}
                  onChange={handleChange}
                  placeholder="e.g. 11 or EMP-101"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm font-mono transition-all focus:outline-none focus:ring-2 ${
                    errors.id
                      ? 'border-rose-300 focus:ring-rose-400 bg-rose-50/20'
                      : 'border-slate-300 focus:ring-indigo-500 focus:border-indigo-500 bg-white'
                  }`}
                />
              </div>
              {errors.id && (
                <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1 font-medium">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {errors.id}
                </p>
              )}
            </div>

            {/* Field 1: Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-slate-700 mb-1.5"
              >
                Employee Name <span className="text-rose-500">*</span>
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
                  placeholder="e.g. Jeswin Jaison"
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

            {/* Optional Field: Email */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Email Address
                </label>
                <span className="text-[11px] text-slate-400">
                  Displayed on Dashboard
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. jeswin.jaison@company.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-sm transition-all focus:outline-none focus:ring-2"
                />
              </div>
            </div>

            {/* Field 2: Designation */}
            <div>
              <label
                htmlFor="designation"
                className="block text-sm font-semibold text-slate-700 mb-1.5"
              >
                Designation <span className="text-rose-500">*</span>
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
                  placeholder="e.g. Lead Software Engineer"
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
                  Suggested Roles:
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
                Location <span className="text-rose-500">*</span>
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
                  placeholder="e.g. Bengaluru, India or Remote"
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
                Salary (USD $) <span className="text-rose-500">*</span>
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
                  placeholder="e.g. 85000"
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
                <span>Submit &amp; Add to List</span>
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
              <span className="text-[10px] bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 px-2 py-0.5 rounded font-mono font-bold">
                ID #{formData.id || '?'}
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

              <div className="text-xs text-slate-300 flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-indigo-400" />
                <span className="truncate">
                  {formData.email || (formData.name ? `${formData.name.toLowerCase().replace(/[^a-z0-9]/g, '')}@company.com` : 'email@company.com')}
                </span>
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

          {/* Added Employees Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Custom Employees ({customEmployees.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Active in directory alongside API users
                </p>
              </div>
              <Link
                to="/"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
              >
                View on Dashboard &rarr;
              </Link>
            </div>

            {customEmployees.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs space-y-1">
                <Info className="w-5 h-5 mx-auto text-slate-300" />
                <p>No custom employees added yet.</p>
                <p className="text-[11px] text-slate-400">
                  Use the form to add an employee and view them in the dashboard!
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {customEmployees.map((emp) => (
                  <div
                    key={emp.id}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100/80 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700">
                          #{emp.id}
                        </span>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">
                            {emp.name}
                          </h4>
                          <p className="text-xs text-indigo-600 font-medium">
                            {emp.designation}
                          </p>
                        </div>
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
                      <span className="truncate max-w-[150px]">{emp.email}</span>
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
