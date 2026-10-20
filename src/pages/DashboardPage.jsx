import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Search,
  LayoutGrid,
  Table as TableIcon,
  List as ListIcon,
  Mail,
  Hash,
  UserCheck,
  RefreshCw,
  AlertCircle,
  PlusCircle,
  Sparkles,
  Trash2,
  CheckCircle2,
  Globe
} from 'lucide-react';
import { useEmployees } from '../context/EmployeeContext';

const DashboardPage = () => {
  const {
    employees,
    customEmployees,
    apiEmployees,
    loading,
    error,
    fetchApiEmployees,
    removeCustomEmployee,
    clearCustomEmployees,
  } = useEmployees();

  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'card' | 'list'
  const [actionNotice, setActionNotice] = useState(null);

  // Filter employees when searchTerm or employees change
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredEmployees(employees);
    } else {
      const query = searchTerm.toLowerCase();
      const filtered = employees.filter(
        (emp) =>
          emp.name?.toLowerCase().includes(query) ||
          emp.email?.toLowerCase().includes(query) ||
          String(emp.id).toLowerCase().includes(query) ||
          emp.designation?.toLowerCase().includes(query) ||
          emp.company?.name?.toLowerCase().includes(query)
      );
      setFilteredEmployees(filtered);
    }
  }, [searchTerm, employees]);

  // Handle remove custom employee
  const handleDeleteCustom = (id, name) => {
    removeCustomEmployee(id);
    setActionNotice(`Employee #${id} (${name}) removed from directory.`);
    setTimeout(() => setActionNotice(null), 3500);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Action Notification */}
      {actionNotice && (
        <div className="p-4 rounded-xl bg-slate-900 text-white text-xs font-medium flex items-center justify-between shadow-lg animate-fadeIn">
          <span>{actionNotice}</span>
          <button
            onClick={() => setActionNotice(null)}
            className="text-slate-400 hover:text-white ml-4"
          >
            &times;
          </button>
        </div>
      )}

      {/* Header & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Employee Dashboard
            </h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800">
              Live Directory
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Real-time staff records loaded from{' '}
            <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded text-indigo-600 font-mono">
              jsonplaceholder.typicode.com/users
            </code>{' '}
            plus your submitted employees.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {customEmployees.length > 0 && (
            <button
              onClick={clearCustomEmployees}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-rose-600 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors"
              title="Clear submitted employees"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset Custom ({customEmployees.length})</span>
            </button>
          )}

          <button
            onClick={fetchApiEmployees}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg shadow-xs hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
            title="Reload API records"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
            <span>Reload</span>
          </button>

          <Link
            to="/employee-form"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Employee</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-lg bg-indigo-50 text-indigo-600">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Total Listed Employees
            </p>
            <p className="text-2xl font-bold text-slate-900">
              {loading ? '...' : employees.length}
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-lg bg-emerald-50 text-emerald-600">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Locally Submitted
            </p>
            <p className="text-2xl font-bold text-emerald-700">
              {customEmployees.length}
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-lg bg-violet-50 text-violet-600">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              JSONPlaceholder API
            </p>
            <p className="text-2xl font-bold text-slate-900">
              {loading ? '...' : apiEmployees.length}
            </p>
          </div>
        </div>
      </div>

      {/* Control Bar: Search & View Toggles */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by ID, Name, Email, or Designation..."
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50/50"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 self-end sm:self-auto">
          <button
            onClick={() => setViewMode('table')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              viewMode === 'table'
                ? 'bg-white text-indigo-600 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Tabular View"
          >
            <TableIcon className="w-4 h-4" />
            <span>Table</span>
          </button>

          <button
            onClick={() => setViewMode('card')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              viewMode === 'card'
                ? 'bg-white text-indigo-600 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Card View"
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Cards</span>
          </button>

          <button
            onClick={() => setViewMode('list')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              viewMode === 'list'
                ? 'bg-white text-indigo-600 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="List View"
          >
            <ListIcon className="w-4 h-4" />
            <span>List</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {loading && employees.length === 0 ? (
        // Loading Skeleton
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-center py-12 flex-col gap-3">
            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-sm text-slate-500 font-medium">
              Fetching employee directory...
            </p>
          </div>
        </div>
      ) : error && employees.length === 0 ? (
        // Error State
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-6 text-center space-y-4">
          <div className="inline-flex p-3 rounded-full bg-rose-100 text-rose-600">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-rose-900">
              Failed to load employee records
            </h3>
            <p className="text-sm text-rose-700 mt-1">{error}</p>
          </div>
          <button
            onClick={fetchApiEmployees}
            className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-medium hover:bg-rose-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
        </div>
      ) : filteredEmployees.length === 0 ? (
        // Empty Search Result
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center space-y-3">
          <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-900">
            No matching employees found
          </h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            No employee matched "{searchTerm}". Try checking the spelling or clear the filter.
          </p>
          <button
            onClick={() => setSearchTerm('')}
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-800"
          >
            Clear Search Filter
          </button>
        </div>
      ) : (
        <>
          {/* TABULAR VIEW */}
          {viewMode === 'table' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs uppercase tracking-wider font-semibold">
                      <th scope="col" className="py-3.5 px-6">
                        <span className="flex items-center gap-1.5">
                          <Hash className="w-3.5 h-3.5 text-slate-400" />
                          ID
                        </span>
                      </th>
                      <th scope="col" className="py-3.5 px-6">
                        <span className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          Name
                        </span>
                      </th>
                      <th scope="col" className="py-3.5 px-6">
                        <span className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          Email
                        </span>
                      </th>
                      <th scope="col" className="py-3.5 px-6">
                        Role / Designation
                      </th>
                      <th scope="col" className="py-3.5 px-6 text-right">
                        Source
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {filteredEmployees.map((emp) => (
                      <tr
                        key={emp.id}
                        className={`transition-colors group ${
                          emp.isCustom
                            ? 'bg-amber-50/30 hover:bg-amber-50/60'
                            : 'hover:bg-indigo-50/40'
                        }`}
                      >
                        {/* ID */}
                        <td className="py-4 px-6 font-mono text-xs font-semibold">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-md border font-bold ${
                              emp.isCustom
                                ? 'bg-amber-100 text-amber-800 border-amber-200'
                                : 'bg-indigo-50 text-indigo-700 border-indigo-100'
                            }`}
                          >
                            #{emp.id}
                          </span>
                        </td>

                        {/* Name */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-9 h-9 rounded-full text-white flex items-center justify-center font-bold text-xs shadow-xs ${
                                emp.isCustom
                                  ? 'bg-gradient-to-tr from-amber-500 to-orange-500'
                                  : 'bg-gradient-to-tr from-indigo-500 to-purple-500'
                              }`}
                            >
                              {emp.name
                                ? emp.name
                                    .split(' ')
                                    .map((n) => n[0])
                                    .slice(0, 2)
                                    .join('')
                                : 'U'}
                            </div>
                            <div>
                              <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors flex items-center gap-2">
                                <span>{emp.name}</span>
                                {emp.isCustom && (
                                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                                    New
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-slate-400">
                                @{emp.username || emp.name.toLowerCase().replace(/\s+/g, '')}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Email */}
                        <td className="py-4 px-6 text-slate-600">
                          <a
                            href={`mailto:${emp.email}`}
                            className="inline-flex items-center gap-1.5 text-slate-700 hover:text-indigo-600 transition-colors"
                          >
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            <span className="font-medium">{emp.email}</span>
                          </a>
                        </td>

                        {/* Role / Designation */}
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
                            {emp.designation || emp.company?.name || 'Staff Member'}
                          </span>
                        </td>

                        {/* Source / Action */}
                        <td className="py-4 px-6 text-right">
                          {emp.isCustom ? (
                            <button
                              onClick={() => handleDeleteCustom(emp.id, emp.name)}
                              className="text-xs text-rose-500 hover:text-rose-700 font-medium inline-flex items-center gap-1 hover:underline"
                              title="Delete this custom entry"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Remove</span>
                            </button>
                          ) : (
                            <span className="text-xs text-slate-400">JSONPlaceholder</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* CARD VIEW */}
          {viewMode === 'card' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEmployees.map((emp) => (
                <div
                  key={emp.id}
                  className={`bg-white rounded-xl border p-6 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group ${
                    emp.isCustom
                      ? 'border-amber-200 ring-1 ring-amber-200/50'
                      : 'border-slate-200 hover:border-indigo-200'
                  }`}
                >
                  <div className="space-y-4">
                    {/* Top Row: Avatar & ID */}
                    <div className="flex items-start justify-between">
                      <div
                        className={`w-12 h-12 rounded-xl text-white flex items-center justify-center font-bold text-base shadow-sm group-hover:scale-105 transition-transform ${
                          emp.isCustom
                            ? 'bg-gradient-to-tr from-amber-500 to-orange-500'
                            : 'bg-gradient-to-tr from-indigo-500 to-violet-500'
                        }`}
                      >
                        {emp.name
                          .split(' ')
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join('')}
                      </div>
                      <div className="flex items-center gap-1.5">
                        {emp.isCustom && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                            Custom
                          </span>
                        )}
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono font-bold border ${
                            emp.isCustom
                              ? 'bg-amber-100 text-amber-800 border-amber-200'
                              : 'bg-indigo-50 text-indigo-700 border-indigo-100'
                          }`}
                        >
                          ID: #{emp.id}
                        </span>
                      </div>
                    </div>

                    {/* Employee Info */}
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {emp.name}
                      </h3>
                      <p className="text-xs text-indigo-600 font-medium">
                        {emp.designation || emp.company?.name || 'Staff Member'}
                      </p>
                    </div>

                    {/* Email Field */}
                    <div className="pt-2 border-t border-slate-100 space-y-2">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <a
                          href={`mailto:${emp.email}`}
                          className="truncate hover:text-indigo-600 font-medium transition-colors"
                          title={emp.email}
                        >
                          {emp.email}
                        </a>
                      </div>

                      {emp.salary && (
                        <div className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded inline-block">
                          Compensation: ${Number(emp.salary).toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Globe className="w-3 h-3 text-slate-400" />
                      {emp.location || emp.address?.city || 'Location HQ'}
                    </span>
                    {emp.isCustom ? (
                      <button
                        onClick={() => handleDeleteCustom(emp.id, emp.name)}
                        className="text-rose-500 hover:text-rose-700 font-medium hover:underline"
                      >
                        Delete
                      </button>
                    ) : (
                      <span className="text-indigo-600 font-medium group-hover:underline">
                        Verified &rarr;
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* LIST VIEW */}
          {viewMode === 'list' && (
            <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 shadow-xs overflow-hidden">
              {filteredEmployees.map((emp) => (
                <div
                  key={emp.id}
                  className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors group ${
                    emp.isCustom
                      ? 'bg-amber-50/20 hover:bg-amber-50/40'
                      : 'hover:bg-indigo-50/30'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`w-12 text-center font-mono font-bold text-xs py-1 rounded border ${
                        emp.isCustom
                          ? 'bg-amber-100 text-amber-800 border-amber-200'
                          : 'bg-indigo-50 text-indigo-700 border-indigo-100'
                      }`}
                    >
                      #{emp.id}
                    </span>
                    <div
                      className={`w-10 h-10 rounded-full text-white flex items-center justify-center font-bold text-xs shadow-xs ${
                        emp.isCustom
                          ? 'bg-gradient-to-tr from-amber-500 to-orange-500'
                          : 'bg-gradient-to-tr from-indigo-500 to-purple-500'
                      }`}
                    >
                      {emp.name
                        .split(' ')
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join('')}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors flex items-center gap-2">
                        <span>{emp.name}</span>
                        {emp.isCustom && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                            Custom
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {emp.designation || emp.company?.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <a
                        href={`mailto:${emp.email}`}
                        className="hover:text-indigo-600 font-medium"
                      >
                        {emp.email}
                      </a>
                    </div>
                    <span className="hidden md:inline text-slate-300">&bull;</span>
                    <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">
                      {emp.location || emp.address?.city || 'HQ'}
                    </span>
                    {emp.isCustom && (
                      <button
                        onClick={() => handleDeleteCustom(emp.id, emp.name)}
                        className="text-xs text-rose-500 hover:text-rose-700"
                        title="Remove custom employee"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Footer Info Banner */}
      <div className="rounded-xl bg-slate-100 border border-slate-200/80 p-4 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700">Displaying:</span>
          <span>
            {filteredEmployees.length} employee records with <strong>id</strong>, <strong>name</strong>, and <strong>email</strong>.
          </span>
        </div>
        <div>
          API Records: {apiEmployees.length} | Custom Submissions: {customEmployees.length}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
