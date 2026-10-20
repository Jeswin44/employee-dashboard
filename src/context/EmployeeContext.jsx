import React, { createContext, useContext, useState, useEffect } from 'react';

const EmployeeContext = createContext(null);

const STORAGE_KEY = 'custom_employee_records_v1';

export const EmployeeProvider = ({ children }) => {
  const [apiEmployees, setApiEmployees] = useState([]);
  const [customEmployees, setCustomEmployees] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to load custom employees from localStorage', e);
      return [];
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch API employees on mount
  const fetchApiEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      if (!response.ok) {
        throw new Error(`Failed to fetch API data: HTTP ${response.status}`);
      }
      const data = await response.json();
      setApiEmployees(data);
    } catch (err) {
      console.error('API Fetch error:', err);
      setError(err.message || 'Unable to connect to employee data source.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApiEmployees();
  }, []);

  // Save custom employees to localStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customEmployees));
    } catch (e) {
      console.error('Failed to persist custom employees to localStorage', e);
    }
  }, [customEmployees]);

  // Determine next recommended numeric ID
  const getNextId = () => {
    const allIds = [...apiEmployees, ...customEmployees]
      .map((e) => parseInt(e.id, 10))
      .filter((n) => !isNaN(n));
    return allIds.length > 0 ? Math.max(...allIds) + 1 : 1;
  };

  // Add new employee
  const addEmployee = (newEmployee) => {
    const finalId = newEmployee.id ? newEmployee.id : getNextId();
    const formattedRecord = {
      ...newEmployee,
      id: finalId,
      isCustom: true,
      addedAt: new Date().toISOString(),
      company: {
        name: newEmployee.designation || 'Engineering',
      },
      address: {
        city: newEmployee.location || 'Remote',
      },
      email:
        newEmployee.email ||
        `${newEmployee.name.toLowerCase().replace(/[^a-z0-9]/g, '')}@company.com`,
    };

    setCustomEmployees((prev) => [formattedRecord, ...prev]);
    return formattedRecord;
  };

  // Delete a custom employee
  const removeCustomEmployee = (id) => {
    setCustomEmployees((prev) => prev.filter((emp) => emp.id !== id));
  };

  // Clear all custom additions
  const clearCustomEmployees = () => {
    setCustomEmployees([]);
  };

  // Combined list: custom-added employees first, then API employees
  const allEmployees = [...customEmployees, ...apiEmployees];

  return (
    <EmployeeContext.Provider
      value={{
        employees: allEmployees,
        apiEmployees,
        customEmployees,
        loading,
        error,
        fetchApiEmployees,
        addEmployee,
        removeCustomEmployee,
        clearCustomEmployees,
        getNextId,
      }}
    >
      {children}
    </EmployeeContext.Provider>
  );
};

export const useEmployees = () => {
  const context = useContext(EmployeeContext);
  if (!context) {
    throw new Error('useEmployees must be used within an EmployeeProvider');
  }
  return context;
};
