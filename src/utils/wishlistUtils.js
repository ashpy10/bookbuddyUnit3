export const getWishlist = () => {
    const stored = localStorage.getItem('wishlist');
    return stored ? JSON.parse(stored) : []; 
}; 

export const saveWishlist = (wishlist) => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}; 

export const toggleBookInWishlist = (book) => {
    const wishlist = getWishlist();
    const exists = wishlist.find((b) => b.id === book.id);

    const updated = exists
        ? wishlist.filter((b) => b.id !== book.id)
        : [...wishlist, book];

        saveWishlist(updated);
        return updated;
};
    
export const isBookInWishlist = (bookId) => {
    const wishlist = getWishlist();
    return wishlist.some((b) => b.id === bookId);
};