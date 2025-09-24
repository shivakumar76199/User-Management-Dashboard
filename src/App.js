// src/App.js (beginner-friendly version, no arrows or fancy stuff)
import React, { useEffect, useState } from 'react';
import { getUsers, addUser, updateUser, deleteUserApi } from './api';
import UserForm from './components/UserForm';
import './index.css';

// Simple styles
const thStyle = { border: '1px solid #ddd', padding: '8px', background: '#f3f3f3' };
const tdStyle = { border: '1px solid #ddd', padding: '8px' };

function UsersTable({ users, onEdit, onDelete, onSort }) {
  return (
    <table className="users-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th style={thStyle}>ID</th>
          <th style={thStyle} onClick={() => onSort('firstName')}>First Name</th>
          <th style={thStyle} onClick={() => onSort('lastName')}>Last Name</th>
          <th style={thStyle} onClick={() => onSort('email')}>Email</th>
          <th style={thStyle} onClick={() => onSort('department')}>Department</th>
          <th style={thStyle}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.length === 0 && (
          <tr>
            <td colSpan="6" style={{ textAlign: 'center', padding: 12 }}>No users found</td>
          </tr>
        )}
        {users.map(u => (
          <tr key={u.id}>
            <td style={tdStyle}>{u.id}</td>
            <td style={tdStyle}>{u.firstName}</td>
            <td style={tdStyle}>{u.lastName}</td>
            <td style={tdStyle}>{u.email}</td>
            <td style={tdStyle}>{u.department}</td>
            <td style={tdStyle}>
              <button onClick={() => onEdit(u)}>Edit</button>
              <button
                className="danger"
                style={{ marginLeft: 8 }}
                onClick={() => {
                  if (window.confirm(`Delete ${u.firstName} ${u.lastName}?`)) {
                    onDelete(u.id);
                  }
                }}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function App() {
  // state
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // form
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // search, sort, pagination
  const [searchText, setSearchText] = useState('');
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Load users on first render
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await getUsers();
        setUsers(data);
        setError('');
      } catch (err) {
        setError('Failed to load users');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // sort handler
  function handleSort(key) {
    if (sortBy === key) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(key);
      setSortOrder('asc');
    }
  }

  // filter + sort + search
  function getProcessedUsers() {
    let list = [...users];

    // search
    if (searchText.trim()) {
      const s = searchText.toLowerCase();
      list = list.filter(u =>
        u.firstName.toLowerCase().includes(s) ||
        u.lastName.toLowerCase().includes(s) ||
        u.email.toLowerCase().includes(s) ||
        u.department.toLowerCase().includes(s)
      );
    }

    // sort
    if (sortBy) {
      list.sort((a, b) => {
        const A = (a[sortBy] || '').toLowerCase();
        const B = (b[sortBy] || '').toLowerCase();
        if (A < B) return sortOrder === 'asc' ? -1 : 1;
        if (A > B) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return list;
  }

  // pagination
  const processed = getProcessedUsers();
  const totalItems = processed.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const visibleUsers = processed.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  function goToPage(p) {
    if (p < 1) p = 1;
    if (p > totalPages) p = totalPages;
    setCurrentPage(p);
  }

  // Add
  async function handleAdd(user) {
    try {
      setLoading(true);
      const created = await addUser(user);
      setUsers(prev => [created, ...prev]);
      setShowForm(false);
    } catch (err) {
      setError('Failed to add user');
    } finally {
      setLoading(false);
    }
  }

  // Update
  async function handleUpdate(user) {
    try {
      setLoading(true);
      const updated = await updateUser(user);
      setUsers(prev => prev.map(u => (u.id === updated.id ? updated : u)));
      setShowForm(false);
      setEditingUser(null);
    } catch (err) {
      setError('Failed to update user');
    } finally {
      setLoading(false);
    }
  }

  // Delete
  async function handleDelete(id) {
    try {
      setLoading(true);
      await deleteUserApi(id);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      setError('Failed to delete user');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <h1>User Management Dashboard</h1>

      {/* Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <button onClick={() => { setEditingUser(null); setShowForm(true); }}>Add User</button>
        <input
          placeholder="Search..."
          value={searchText}
          onChange={(e) => { setSearchText(e.target.value); setCurrentPage(1); }}
          style={{ padding: 6, width: 250 }}
        />
      </div>

      {error && <div style={{ color: 'red' }}>{error}</div>}
      {loading && <div>Loading...</div>}

      {/* Form */}
      {showForm && (
        <UserForm
          initialData={editingUser}
          onCancel={() => { setShowForm(false); setEditingUser(null); }}
          onSave={(data) => {
            if (editingUser) handleUpdate(data);
            else handleAdd(data);
          }}
        />
      )}

      {/* Table */}
      <UsersTable
        users={visibleUsers}
        onEdit={(u) => { setEditingUser(u); setShowForm(true); }}
        onDelete={handleDelete}
        onSort={handleSort}
      />

      {/* Pagination */}
      <div style={{ marginTop: 12 }}>
        <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>Prev</button>
        <span style={{ margin: '0 8px' }}>Page {currentPage} of {totalPages}</span>
        <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>

        <label style={{ marginLeft: 20 }}>
          Page size:
          <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </label>
      </div>
    </div>
  );
}
