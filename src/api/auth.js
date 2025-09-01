const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export async function loginUser(credentials) {
  try {
    const response = await fetch(`${BASE_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password
      }),
    });

    const data = await response.json(); // ✅ read once

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    return {
      token: data.token,
      user: {
        email: data.email,
        role: data.role
      }
    };
  } catch (error) {
    console.error('Login error:', error.message);
    throw error;
  }
}

