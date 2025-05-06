import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HeroFeature from './components/HeroFeature';
import StaffPicks from './components/StaffPicks';
import BookDetails from './components/BookDetails';
import BrowseShelf from './components/BrowseShelf';
import Login from './components/Login'; 
import MyBookshelf from './components/MyBookshelf'; 





function App() {
	return (
		<>
			<Header />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <HeroFeature />
                <StaffPicks />
                <BrowseShelf />
              </>
            }
          />
          <Route path="/books/:id" element={<BookDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/bookshelf" element={<MyBookshelf />} />
			</Routes>
		</>
	);
}

export default App;
