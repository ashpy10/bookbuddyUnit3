import React, { useEffect, useState } from 'react';
import styles from '../styles/MyBookshelf.module.css';
import GridBookCard from './GridBookCard';

function MyBookshelf() {
	const [activeTab, setActiveTab] = useState('books');
	const [userData, setUserData] = useState(null);
	const [loading, setLoading] = useState(true);
	const token = localStorage.getItem('token');
	const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');

	useEffect(() => {
		if (!token) return;
	
		async function fetchUserData() {
			try {
				const [userRes, reservationsRes] = await Promise.all([
					fetch('https://fsa-book-buddy-b6e748d1380d.herokuapp.com/api/users/me', {
						headers: { Authorization: `Bearer ${token}` },
					}),
					fetch('https://fsa-book-buddy-b6e748d1380d.herokuapp.com/api/reservations', {
						headers: { Authorization: `Bearer ${token}` },
					}),
				]);
	
				const userData = await userRes.json();
				const reservations = await reservationsRes.json();
	
				const bookRequests = reservations
					.filter((res) => res.bookid) 
					.map((res) =>
						fetch(`https://fsa-book-buddy-b6e748d1380d.herokuapp.com/api/books/${res.bookid}`)
						.then((r) => r.json())
						.then((data) => data)
					);
				const bookResults = await Promise.all(bookRequests);
				const reservedBooks = bookResults;
	
				setUserData({ ...userData, reservedBooks });
			} catch (err) {
				console.error('Error fetching data:', err);
			} finally {
				setLoading(false);
			}
		}
	
		fetchUserData();
	}, [token]);
	
	  

	if (loading) return <p className={styles.loading}>Loading your bookshelf...</p>;

	return (
		<div className={styles.container}>
			<h2 className={styles.greeting}>Welcome back, {userData?.firstName || 'Reader'}!</h2>

			<div className={styles.tabs}>
				<button
					className={activeTab === 'books' ? styles.activeTab : styles.tab}
					onClick={() => setActiveTab('books')}
				>
					My Books
				</button>
				<button
					className={activeTab === 'wishlist' ? styles.activeTab : styles.tab}
					onClick={() => setActiveTab('wishlist')}
				>
					My Wishlist
				</button>
				<button
					className={activeTab === 'account' ? styles.activeTab : styles.tab}
					onClick={() => setActiveTab('account')}
				>
					My Account
				</button>
			</div>

			<div className={styles.tabContent}>
				{activeTab === 'books' && (
					<div className={styles.grid}>
						{userData?.reservedBooks?.length === 0 ? (
							<p>You haven't reserved any books yet.</p>
						) : (
							userData.reservedBooks.map((book) => (
								<GridBookCard key={book.id} book={book} />
							))
						)}
					</div>
				)}

				{activeTab === 'wishlist' && (
					<div className={styles.gridWish}>
						{wishlist.length === 0 ? (
							<p>Your wishlist is empty.</p>
						) : (
							wishlist
								.filter((book) => book && book.id) 
								.map((book) => <GridBookCard key={book.id} book={book} />)
						)}

					</div>
				)}

				{activeTab === 'account' && (
					<div className={styles.accountSection}>
						<p><strong>First Name:</strong> {userData.firstName}</p>
						<p><strong>Last Name:</strong> {userData.lastName}</p>
						<p><strong>Email:</strong> {userData.email}</p>
					</div>
				)}
			</div>
		</div>
	);
}

export default MyBookshelf;
