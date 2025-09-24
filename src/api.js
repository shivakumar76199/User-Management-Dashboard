

const API_URL = 'https://jsonplaceholder.typicode.com/users';


function mapApiUser(u) {
  const parts = (u.name || '').split(' ');
  const firstName = parts[0] || '';
  const lastName = parts.slice(1).join(' ') || '';
  return {
    id: u.id,
    firstName,
    lastName,
    email: u.email || '',
    department: (u.company && u.company.name) || 'General',
  };
}

export async function getUsers() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Failed to fetch users');
  const data = await res.json();
  return data.map(mapApiUser);
}

export async function getUserById(id) {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error('Failed to fetch user');
  const data = await res.json();
  return mapApiUser(data);
}

export async function addUser(user) {
  
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      company: { name: user.department },
    }),
  });
  if (!res.ok) throw new Error('Failed to add user');
  const created = await res.json();
  
  return {
    id: created.id || Date.now(),
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    department: user.department,
  };
}

export async function updateUser(user) {
  const res = await fetch(`${API_URL}/${user.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      company: { name: user.department },
    }),
  });
  if (!res.ok) throw new Error('Failed to update user');
  const updated = await res.json();
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    department: user.department,
  };
}

export async function deleteUserApi(id) {
  const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete user');
  return true;
}
