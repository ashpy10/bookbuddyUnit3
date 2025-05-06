import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from '../styles/BookDetails.module.css';
import { isBookInWishlist, toggleBookInWishlist } from '../utils/wishlistUtils';
import { useNavigate } from 'react-router-dom';

function BookDetails() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inWishlist, setInWishlist] = useState(false);
  const [reservations, setReservations] = useState([]);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();


  useEffect(() => {
    async function fetchBook() {
      try {
        const res = await fetch(`https://fsa-book-buddy-b6e748d1380d.herokuapp.com/api/books/${id}`);
        const data = await res.json();
        setBook(data);
      } catch (err) {
        console.error('Error loading book:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchBook();
  }, [id]);

  useEffect(() => {
    async function fetchReservations() {
      try {
        const res = await fetch(`https://fsa-book-buddy-b6e748d1380d.herokuapp.com/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setReservations(data.reservations || []);
      } catch (err) {
        console.error('Error loading reservations:', err);
      }
    }

    if (token) {
      fetchReservations();
      setInWishlist(isBookInWishlist(Number(id)));
    }
  }, [id, token]);

  const handleWishlistToggle = () => {
    toggleBookInWishlist(book);
    setInWishlist(isBookInWishlist(book.id));
  };

  const handleReserve = async () => {
    try {
      const res = await fetch(`https://fsa-book-buddy-b6e748d1380d.herokuapp.com/api/reservations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bookId: book.id }),
      });
      if (!res.ok) throw new Error('Reservation failed');
      const data = await res.json();
      setReservations((prev) => [...prev, data.reservation]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReturn = async () => {
    const reservation = reservations.find(r => r.bookid === book.id);
    if (!reservation) return;

    try {
      const res = await fetch(`https://fsa-book-buddy-b6e748d1380d.herokuapp.com/api/reservations/${reservation.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status === 204) {
        setReservations((prev) => prev.filter((r) => r.id !== reservation.id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const isReservedByUser = reservations.some((r) => r.bookId === book?.id);
  const isAvailable = book?.available;

  const renderButton = () => {
    if (!token) return null;

    if (isAvailable) {
      return (
        <button className={styles.reserveButton} onClick={handleReserve}>
          Reserve
        </button>
      );
    } else if (isReservedByUser) {
      return (
        <button className={styles.reserveButton} onClick={handleReturn}>
          Return
        </button>
      );
    } else {
      return (
        <button className={styles.unavailableButton} disabled>
          Not Available
        </button>
      );
    }
  };

  if (loading || !book) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.page}>
      <div
        className={styles.background}
        style={{
          backgroundImage: book.coverimage ? `url(${book.coverimage})` : 'none',
        }}
      ></div>

      <div className={styles.detailsCard}>
        {token && (
          <div className={styles.wishlistIconWrapper} onClick={handleWishlistToggle}>
            <img
              src={inWishlist ? '/filled-star.png' : '/outline-star.png'}
              alt="wishlist star"
              className={styles.wishlistIcon}
            />
          </div>
        )}
        <img src={book.coverimage} alt={book.title} className={styles.cover} />
        <h2 className={styles.title}>{book.title}</h2>
        <p className={styles.author}>{book.author}</p>
        <p className={styles.description}>{book.description}</p>

        {renderButton()}
      </div>

    <section className={styles.membership}>
		<h3 className={styles.sectionTitle}>Become a Member</h3>
		<p className={styles.sectionSubtitle}>Exclusive access to our hottest titles!</p>

		<div className={styles.perksCard}>
			<img src="/fallback-cover.png" alt="perks" className={styles.perksImage} />
			<div>
			<p className={styles.perksTitle}>Membership Perks</p>
			<p className={styles.perksText}>
				First dibs on the most wanted books on our shelves! No monthly cost, no obligations!
			</p>
			<button className={styles.signupButton} onClick={() => navigate('/login')}>
				Sign Up
			</button>
			</div>
		</div>
	</section>

    </div>
  );
}

export default BookDetails;
