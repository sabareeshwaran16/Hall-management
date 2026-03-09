import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    // Clear any stale state on mount
    useEffect(() => {
        localStorage.clear();
        console.log('Login page mounted - LocalStorage cleared');
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Clear previous errors
        setError('');
        setLoading(true);

        console.log('Attempting login with:', { email });

        try {
            // AuthContext login handles the API call and state update
            const data = await login(email, password);
            console.log('Login successful:', data);

            // Redirect based on role
            const role = data.user?.role || data.role; // Handle potential structure diffs
            if (role === 'admin') navigate('/admin');
            else if (role === 'faculty') navigate('/faculty');
            else if (role === 'student') navigate('/student');
            else navigate('/');

        } catch (err) {
            console.error('Login error full object:', err);
            setError(err.response?.data?.message || 'Login failed. Check console for details.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h1>Exam Hall Allocation System</h1>
                    <p>Sign in to your account</p>
                </div>

                {error && (
                    <div className="alert alert-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Enter your password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-block"
                        disabled={loading}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="login-footer">
                    <p>Default credentials:</p>
                    <p><strong>Admin:</strong> admin@college.edu / admin123</p>
                    <p><strong>Faculty:</strong> faculty@college.edu / faculty123</p>
                    <p><strong>Student:</strong> student@college.edu / student123</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
