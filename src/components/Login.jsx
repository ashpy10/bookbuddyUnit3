
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Login.module.css'

function Login() {
    const navigate = useNavigate();
	const [isSignUp, setIsSignUp] = useState(false);
	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		email: '',
		password: '',
	});
	const [error, setError] = useState('');
	const [message, setMessage] = useState('');

	const toggleForm = () => {
		setIsSignUp(!isSignUp);
		setFormData({ firstName: '', lastName: '', email: '', password: '' });
		setError('');
		setMessage('');
	};

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const validateEmail = (email) => {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		setMessage('');

		if (!validateEmail(formData.email)) {
			return setError('Please enter a valid email address.');
		}

		if (formData.password.length < 6) {
			return setError('Password must be at least 6 characters long.');
		}

		const endpoint = isSignUp
			? 'https://fsa-book-buddy-b6e748d1380d.herokuapp.com/api/users/register'
			: 'https://fsa-book-buddy-b6e748d1380d.herokuapp.com/api/users/login';

		const payload = isSignUp
			? {
					firstName: formData.firstName,
					lastName: formData.lastName,
					email: formData.email,
					password: formData.password,
			  }
			: {
					email: formData.email,
					password: formData.password,
			  };

		try {
			const res = await fetch(endpoint, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(payload),
			});

			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.message || 'Login failed');
			}

		
			localStorage.setItem('token', data.token);
			localStorage.setItem('user', JSON.stringify(data.user || {}));
			setMessage(`${isSignUp ? 'Signup' : 'Login'} successful!`);
            
            setTimeout(() => {
				navigate('/bookshelf');
			}, 1500);
        
        } catch (err) {
			setError(err.message);
		}
	};

	return (
		<div className={styles.form}>
			<h2 className={styles.title}>{isSignUp ? 'Sign Up for a Free Membership' : 'Log In'}</h2>
			<div className={styles.inputs}>
                <form onSubmit={handleSubmit}>
                    {isSignUp && (
                        <>
                            <input
                                type="text"
                                name="firstName"
                                placeholder="First Name"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Last Name"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                            />
                        </>
                    )}

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    

                    <button className={styles.button} type="submit">
                        {isSignUp ? 'Create Account' : 'Log In'}
                    </button>
                </form>
            </div>

			{error && <p style={{ color: 'red' }}>{error}</p>}
			{message && <p style={{ color: 'green' }}>{message}</p>}

			<p style={{ marginTop: '1rem' }}>
                {isSignUp ? 'Already have an account?' : 'New here?'}{' '}
                <button onClick={toggleForm} className={styles.toggleBtn}>
                    {isSignUp ? 'Log in' : 'Sign up for a free membership'}
                </button>
            </p>
		</div>
	);
}

export default Login;
