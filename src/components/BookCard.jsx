import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/BookCard.module.css';
import { isBookInWishlist, toggleBookInWishlist } from '../utils/wishlistUtils';

function BookCard({ book, onReservationChange }) {
  const navigate = useNavigate();
  const [inWishlist, setInWishlist] = useState(false);
  const [userReservations, setUserReservations] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    setInWishlist(isBookInWishlist(book.id));
  }, [book.id]);

  useEffect(() => {
    const fetchUserReservations = async () => {
      if (!token) return;
      try {
        const res = await fetch('https://fsa-book-buddy-b6e748d1380d.herokuapp.com/api/users/me', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await res.json();
        setUserReservations(data.reservations || []);
      } catch (err) {
      }
    };

    fetchUserReservations();
  }, [token]);

  const handleToggleWishlist = (e) => {
    e.stopPropagation();
    toggleBookInWishlist(book);
    setInWishlist(isBookInWishlist(book.id));
  };

  const handleReserve = async () => {
    try {
      const res = await fetch('https://fsa-book-buddy-b6e748d1380d.herokuapp.com/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bookId: book.id }), 
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Reservation failed');
      }

      const data = await res.json();
      console.log('Reservation successful:', data);

      if (typeof onReservationChange === 'function') {
        onReservationChange();
      }

    } catch (err) {
      console.error('Reservation error:', err);
    }
  };

  const handleReturn = async () => {
    try {
      const res = await fetch('https://fsa-book-buddy-b6e748d1380d.herokuapp.com/api/reservations', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error('Failed to fetch reservations');
      }

      const reservations = await res.json();

      const reservation = reservations.find(r => r.bookid === book.id);

      if (!reservation) {
        console.error('No reservation found for this book.');
        return;
      }

      const deleteRes = await fetch(`https://fsa-book-buddy-b6e748d1380d.herokuapp.com/api/reservations/${reservation.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (deleteRes.status === 204) {
        ;
        if (typeof onReservationChange === 'function') {
          onReservationChange();
        }
      } else {
        console.error('Failed to return the book.');
      }
    } catch (err) {
      console.error('Error returning the book:', err);
    }
  };

  const isReservedByUser = userReservations.some((r) => r.bookid === book.id);

  const renderButton = () => {
    if (!token) return null;

    if (book.available) {
      return (
        <button className={styles.button} onClick={handleReserve}>
          Reserve
        </button>
      );
    } else if (isReservedByUser) {
      return (
        <button className={styles.button} onClick={handleReturn}>
          Return
        </button>
      );
    } else {
      return (
        <button className={styles.unavailable} disabled>
          Not Available
        </button>
      );
    }
  };

  return (
    <div className={styles.card}>
      {token && (
        <div className={styles.wishlistIconWrapper} onClick={handleToggleWishlist}>
          <img
            src={inWishlist ? '/filled-star.png' : '/outline-star.png'}
            alt="wishlist star"
            className={styles.wishlistIcon}
          />
        </div>
      )}
      <img
        src={book.coverimage}
        alt={book.title}
        className={styles.image}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = '/fallback-cover.png';
        }}
      />
      <h3 className={styles.title}>{book.title}</h3>
      <p className={styles.author}>{book.author}</p>
      <button className={styles.detailsbutton} onClick={() => navigate(`/books/${book.id}`)}>
        View Details
      </button>
      {renderButton()}
    </div>
  );
}

export default BookCard;
