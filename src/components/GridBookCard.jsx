import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/GridBookCard.module.css';
import { isBookInWishlist, toggleBookInWishlist } from '../utils/wishlistUtils';

function GridBookCard({ book }) {
  const navigate = useNavigate();
  const [inWishlist, setInWishlist] = useState(false);
  const [reservations, setReservations] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    setInWishlist(isBookInWishlist(book.id));
  }, [book.id]);

  useEffect(() => {
    if (token) {
      fetch('https://fsa-book-buddy-b6e748d1380d.herokuapp.com/api/users/me', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setReservations(data.reservations || []);
        })
        .catch((err) => console.error('Error fetching user data:', err));
    }
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
      const updatedRes = await fetch('https://fsa-book-buddy-b6e748d1380d.herokuapp.com/api/users/me', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const updatedData = await updatedRes.json();
      setReservations(updatedData.reservations || []);
    } catch (err) {
      console.error('Reservation error:', err);
    }
  };

  const handleReturn = async () => {
    const reservation = reservations.find((r) => r.bookid === book.id);
    if (!reservation) return;

    try {
      const res = await fetch(`https://fsa-book-buddy-b6e748d1380d.herokuapp.com/api/reservations/${reservation.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 204) {
        const updatedRes = await fetch('https://fsa-book-buddy-b6e748d1380d.herokuapp.com/api/users/me', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const updatedData = await updatedRes.json();
        setReservations(updatedData.reservations || []);
      }
    } catch (err) {
      console.error('Return error:', err);
    }
  };

  const renderButton = () => {
    if (!token) return null;

    const isReservedByUser = reservations.some((r) => r.bookid === book.id);

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

      <button
        className={styles.detailsbutton}
        onClick={() => navigate(`/books/${book.id}`)}
      >
        View Details
      </button>

      {renderButton()}
    </div>
  );
}

export default GridBookCard;
