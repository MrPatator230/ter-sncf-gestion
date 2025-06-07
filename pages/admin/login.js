import { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from '../../src/contexts/AuthContext';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const {login, isAuthenticated, role } = useContext(AuthContext);
  const router = useRouter();

  if (isAuthenticated) {
    if (role === 'admin') {
      router.push('/admin');
    } else if (role === 'client') {
      router.push('/client');
    }
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = login(username, password);
    if (!success) {
      setError('Nom d\'utilisateur ou mot de passe incorrect');
    }
  };

  return (
    <div className="container mt-5">
      <h1>Connexion</h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: '400px' }}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Nom d'utilisateur</label>
          <input
            type="text"
            className="form-control"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Mot de passe</label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <button type="submit" className="btn btn-primary">Se connecter</button>
      </form>
    </div>
  );
}
