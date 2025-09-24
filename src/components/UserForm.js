// src/components/UserForm.js
import React, { useState, useEffect } from 'react';

// simple email validation
function validateEmail(email) {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
}

export default function UserForm({ initialData = null, onCancel, onSave }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFirstName(initialData.firstName || '');
      setLastName(initialData.lastName || '');
      setEmail(initialData.email || '');
      setDepartment(initialData.department || '');
    } else {
      setFirstName('');
      setLastName('');
      setEmail('');
      setDepartment('');
    }
    setErrors({});
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!firstName.trim()) newErrors.firstName = 'First name required';
    if (!lastName.trim()) newErrors.lastName = 'Last name required';
    if (!email.trim() || !validateEmail(email)) newErrors.email = 'Valid email required';
    if (!department.trim()) newErrors.department = 'Department required';
    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;

    onSave({
      id: initialData ? initialData.id : undefined,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      department: department.trim(),
    });
  };

  return (
    <div className="form-card">
      <h3>{initialData ? 'Edit User' : 'Add User'}</h3>
      <form onSubmit={handleSubmit} className="user-form">
        <label>
          First Name
          <input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          {errors.firstName && <div className="error">{errors.firstName}</div>}
        </label>

        <label>
          Last Name
          <input value={lastName} onChange={(e) => setLastName(e.target.value)} />
          {errors.lastName && <div className="error">{errors.lastName}</div>}
        </label>

        <label>
          Email
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
          {errors.email && <div className="error">{errors.email}</div>}
        </label>

        <label>
          Department
          <input value={department} onChange={(e) => setDepartment(e.target.value)} />
          {errors.department && <div className="error">{errors.department}</div>}
        </label>

        <div style={{ marginTop: 10 }}>
          <button type="submit">{initialData ? 'Save' : 'Add'}</button>
          <button type="button" className="muted" onClick={onCancel} style={{ marginLeft: 8 }}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
