import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import BookCard from './BookCard';
import styles from '../styles/StaffPicks.module.css';

function StaffPicks() {
	const [books, setBooks] = useState([]);
	const [centerIndex, setCenterIndex] = useState(0);
	const scrollRef = useRef(null);
	const navigate = useNavigate();

    useEffect(function fetchBooks() {
        async function getStaffPicks() {
            try {
                const ids = [10, 32, 34, 42, 18, 22];
    
                const requests = ids.map(async (id) => {
                    const res = await fetch(`https://fsa-book-buddy-b6e748d1380d.herokuapp.com/api/books/${id}`);
                    const data = await res.json();
                    console.log(`📦 Book ID ${id} response:`, data); 
                    return data;
                });
    
                const results = await Promise.all(requests);
    
                const validBooks = results.filter(book => book && book.id);
                console.log('Final books set to state:', validBooks);
    
                setBooks(validBooks);
            } catch (err) {
                console.error('Error fetching staff picks:', err);
            }
        }
    
        getStaffPicks();
    }, []);
    

	function handleScroll() {
		if (!scrollRef.current) return;
		const container = scrollRef.current;
		const children = Array.from(container.children);
		const center = container.scrollLeft + container.offsetWidth / 2;

		const distances = children.map(child => {
			const rect = child.getBoundingClientRect();
			const childCenter = rect.left + rect.width / 2;
			return Math.abs(childCenter - window.innerWidth / 2);
		});

		const closestIndex = distances.indexOf(Math.min(...distances));
		setCenterIndex(closestIndex);
	}

	if (books.length === 0) {
		return <p style={{ padding: '2rem' }}>Loading staff picks...</p>;
	}

	return (
		<section className={styles.staffSection}>
			<h2 className={styles.title}>Staff Picks</h2>
			<p className={styles.subtitle}>Trust us... you can't miss these!</p>
			<div
				className={styles.scrollContainer}
				ref={scrollRef}
				onScroll={handleScroll}
			>
                {books.map((book) => (
                    <BookCard
                        key={book.id}
                        book={book}
                        onClick={() => navigate(`/books/${book.id}`)}
                    />
                ))}

			</div>
		</section>
	);
}

export default StaffPicks;
