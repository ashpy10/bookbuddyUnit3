import React, { useState, useEffect } from 'react';
import GridBookCard from './GridBookCard.jsx';
import styles from '../styles/BrowseShelf.module.css';

function BrowseShelf() {
	const [books, setBooks] = useState([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [sortOrder, setSortOrder] = useState('asc');

	useEffect(() => {
		async function fetchBooks() {
			try {
				const response = await fetch('https://fsa-book-buddy-b6e748d1380d.herokuapp.com/api/books');
				const data = await response.json();
				setBooks(data);
			} catch (error) {
				console.error('Error fetching books:', error);
			}
		}
		fetchBooks();
	}, []);

	const filteredBooks = books
		.filter((book) =>
			book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			book.author.toLowerCase().includes(searchTerm.toLowerCase())
		)
		.sort((a, b) => {
			if (sortOrder === 'asc') {
				return a.title.localeCompare(b.title);
			} else {
				return b.title.localeCompare(a.title);
			}
		});

	return (
		<section className={styles.container}>
			<div className={styles.header}>
				<h2 className={styles.title}>Browse Our Shelf</h2>
				<p className={styles.subtitle}>Explore our collection of books</p>
				<div className={styles.controls}>
					<input
						type="text"
						placeholder="Search by title or author"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className={styles.search}
					/>
					<div className={styles.sortButtons}>
						<button
							className={styles.sortButton}
							onClick={() => setSortOrder('asc')}
						>
							Sort A-Z
						</button>
						<button
							className={styles.sortButton}
							onClick={() => setSortOrder('desc')}
						>
							Sort Z-A
						</button>
					</div>
				</div>
			</div>
			<div className={styles.grid}>
				{filteredBooks.map((book) => (
					<GridBookCard key={book.id} book={book} />
				))}
			</div>
		</section>
	);
}

export default BrowseShelf;
