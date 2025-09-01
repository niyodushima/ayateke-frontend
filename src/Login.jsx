// frontend/src/pages/Login.jsx
import React from 'react';

const Login = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h2>Login</h2>
      <form>
        <div>
          <label>Email:</label><br />
          <input type="email" name="email" />
        </div>
        <div style={{ marginTop: '1rem' }}>
          <label>Password:</label><br />
          <input type="password" name="password" />
        </div>
        <button type="submit" style={{ marginTop: '1rem' }}>Login</button>
      </form>
    </div>
  );
};

export default Login;
