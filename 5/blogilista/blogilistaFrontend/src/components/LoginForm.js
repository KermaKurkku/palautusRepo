import React from 'react'

const LoginForm = ({ username, password, handleLogin, setUsername, setPassword }) => (
  <form onSubmit={handleLogin}>
    <div>
      username
      <input
        id="username"
        type="text"
        value={username}
        name="Username"
        onChange={setUsername}
      />
    </div>
    <div>
      password
      <input
        id="password"
        type="password"
        value={password}
        name="Password"
        onChange={setPassword}
      />
    </div>
    <button 
      id="login-button"
      type="submit"
    >login</button>
  </form>
)

export default LoginForm