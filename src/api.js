// frontend/api/auth.js
export const loginUser = async ({ email, password }) => {
  const res = await fetch('http://localhost:5000/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Login failed');

  return {
    token: data.token,
    user: {
      email: data.email,
      role: data.role
    }
  };
};
