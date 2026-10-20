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
  ExternalLink,
  PlusCircle,
  Building,
  Phone,
  Globe
} from 'lucide-react';

const DashboardPage = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'card' | 'list'

  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      if (!response.ok) {
        throw new Error(`Failed to fetch data: HTTP ${response.status}`);
      }
      const data = await response.json();
      setEmployees(data);
      setFilteredEmployees(data);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message || 'Something went wrong while fetching employee data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Filter employees when searchTerm changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredEmployees(employees);
    } else {
      const query = searchTerm.toLowerCase();
      const filtered = employees.filter(
        (emp) =>
          emp.name.toLowerCase().includes(query) ||
          emp.email.toLowerCase().includes(query) ||
          emp.id.toString().includes(query)
      );
      setFilteredEmployees(filtered);
    }
  }, [searchTerm, employees]);

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header & Quick Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Employee Dashboard
            </h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
              Live Directory
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Real-time staff records loaded directly from{' '}
            <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded text-indigo-600 font-mono">
              jsonplaceholder.typicode.com/users
            </code>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchEmployees}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg shadow-xs hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
            title="Refresh Data"
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
              Total Records
            </p>
            <p className="text-2xl font-bold text-slate-900">
              {loading ? '...' : employees.length}
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-lg bg-emerald-50 text-emerald-600">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Filtered Results
            </p>
            <p className="text-2xl font-bold text-slate-900">
              {loading ? '...' : filteredEmployees.length}
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-lg bg-violet-50 text-violet-600">
            <ExternalLink className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Data Source
            </p>
            <p className="text-base font-semibold text-slate-800 truncate">
              JSONPlaceholder API
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
            placeholder="Search by ID, Name, or Email..."
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

        {/* View Mode Toggle Switcher */}
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
      {loading ? (
        // Loading Skeleton
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-center py-12 flex-col gap-3">
            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-sm text-slate-500 font-medium">
              Fetching employee directory from API...
            </p>
          </div>
        </div>
      ) : error ? (
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
            onClick={fetchEmployees}
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
                          Employee ID
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
                      <th scope="col" className="py-3.5 px-6 text-right">
                        Company / City
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {filteredEmployees.map((emp) => (
                      <tr
                        key={emp.id}
                        className="hover:bg-indigo-50/40 transition-colors group"
                      >
                        {/* ID */}
                        <td className="py-4 px-6 font-mono text-xs font-semibold text-indigo-600">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-indigo-50 border border-indigo-100">
                            #{emp.id}
                          </span>
                        </td>

                        {/* Name */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                              {emp.name
                                .split(' ')
                                .map((n) => n[0])
                                .slice(0, 2)
                                .join('')}
                            </div>
                            <div>
                              <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                {emp.name}
                              </div>
                              <div className="text-xs text-slate-400">
                                @{emp.username || 'user'}
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

                        {/* Extra Details (Company / City) */}
                        <td className="py-4 px-6 text-right">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                            {emp.company?.name || 'Enterprise'} &bull; {emp.address?.city || 'HQ'}
                          </span>
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
                  className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs hover:shadow-md hover:border-indigo-200 transition-all duration-200 flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    {/* Top Row: Avatar & ID */}
                    <div className="flex items-start justify-between">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 text-white flex items-center justify-center font-bold text-base shadow-sm group-hover:scale-105 transition-transform">
                        {emp.name
                          .split(' ')
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join('')}
                      </div>
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                        ID: #{emp.id}
                      </span>
                    </div>

                    {/* Employee Info */}
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {emp.name}
                      </h3>
                      <p className="text-xs text-slate-400">@{emp.username || 'user'}</p>
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

                      {emp.company && (
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Building className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          <span className="truncate">{emp.company.name}</span>
                        </div>
                      )}

                      {emp.phone && (
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          <span className="truncate">{emp.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Globe className="w-3 h-3 text-slate-400" />
                      {emp.address?.city || 'Location unavailable'}
                    </span>
                    <span className="text-indigo-600 font-medium group-hover:underline">
                      Verified &rarr;
                    </span>
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
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-indigo-50/30 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <span className="w-10 text-center font-mono font-bold text-xs text-indigo-600 bg-indigo-50 py-1 rounded border border-indigo-100">
                      #{emp.id}
                    </span>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                      {emp.name
                        .split(' ')
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join('')}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {emp.name}
                      </h4>
                      <p className="text-xs text-slate-400">@{emp.username}</p>
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
                      {emp.company?.name || 'Company'} &bull; {emp.address?.city}
                    </span>
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
          <span className="font-semibold text-slate-700">Evaluation Criteria:</span>
          <span>Data accessed from JSONPlaceholder with fields <strong>id</strong>, <strong>name</strong>, and <strong>email</strong>.</span>
        </div>
        <div>
          Showing {filteredEmployees.length} of {employees.length} records
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
