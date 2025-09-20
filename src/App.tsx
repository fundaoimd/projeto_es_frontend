import { useState, useEffect } from 'react';
import './App.css';

interface User {
  id: number;
  name: string;
  email: string;
}

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/users')
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao buscar os dados');
        }
        return response.json();
      })
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Falha na requisição:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="App">Carregando...</div>;
  }

  return (
    <div className="App">
      <h1>Lista de Usuários</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            <strong>{user.name}</strong> - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;