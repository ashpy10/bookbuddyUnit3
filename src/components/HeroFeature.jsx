import React, { useEffect, useState } from 'react';
import styles from '../styles/HeroFeature.module.css';

function HeroFeature() {
	const [book, setBook] = useState(null);

	useEffect(() => {
		async function fetchBook() {
			try {
				const res = await fetch('https://fsa-book-buddy-b6e748d1380d.herokuapp.com/api/books/46');
				const data = await res.json();
				setBook(data);
			} catch (err) {
				console.error('Error loading featured book:', err);
			}
		}
		fetchBook();
	}, []);

	if (!book) return <div className={styles.hero}>Loading featured book...</div>;

	return (
		<section className={styles.hero}>
			<img
				src={book.coverimage}
				alt={book.title}
				className={styles.cover}
			/>

			<div className={styles.featureBox}>
				<h2 className={styles.heading}>Book of the Month</h2>

				<div className={styles.bookDetails}>
					<h3 className={styles.title}>{book.title}</h3>
					<p className={styles.subtitle}>{book.author}</p>
                    <p className={styles.description}>{book.description}</p>
				</div>

			</div>
    
		</section>
        
	);
}

export default HeroFeature;
