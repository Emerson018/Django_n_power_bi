import React, { useState } from 'react';
// import api from '../services/api'; 

const LoginView = ({ onLoginSuccess }) => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // Chamada ao Django REST Framework SimpleJWT
            // const response = await api.post('/token/', credentials);
            // localStorage.setItem('accessToken', response.data.access);
            // localStorage.setItem('refreshToken', response.data.refresh);
            
            if (onLoginSuccess) onLoginSuccess();
            
        } catch (err) {
            setError("Usuário ou senha inválidos.");
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px', border: '1px solid #ccc' }}>
            <h2>Login no Portal BI</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                    <label>Username</label><br/>
                    <input 
                        type="text" 
                        value={credentials.username}
                        onChange={e => setCredentials({...credentials, username: e.target.value})}
                        style={{ width: '100%' }}
                    />
                </div>
                <div>
                    <label>Password</label><br/>
                    <input 
                        type="password" 
                        value={credentials.password}
                        onChange={e => setCredentials({...credentials, password: e.target.value})}
                        style={{ width: '100%' }}
                    />
                </div>
                <button type="submit" style={{ padding: '10px' }}>Entrar</button>
            </form>
        </div>
    );
};

export default LoginView;
