import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// import Navbar from './Navbar/Navbar.js';
import NavbarComponent from './Navbar/Navbar.js';
import Mainpage from './Mainpage/Mainpage.js';
import Loginpage from './Loginpage/Loginpage.js';
import Freeboard from './Freeboard/Freeboard.js';
import Sportsboard from './Sportsboard/Sportsboard.js';
import Stockboard from './Stockboard/Stockboard.js';
import Gameboard from './Gameboard/Gameboard.js';

import Detailpage from './Detailpage/Detailpage.js';
import Uploadpage from './Uploadpage/Uploadpage.js';
import Mypage from './Mypage/Mypage.js';

import Footer from './Footer/Footer.js';

function Router() {
	return (
		<BrowserRouter>
			<NavbarComponent />
			<Routes>
				<Route path="/" element={<Mainpage />} />
				<Route path="/login" element={<Loginpage />} />
				<Route path="/Mypage" element={<Mypage />} />
				<Route path="/Board1" element={<Freeboard />} />
				<Route path="/Board2" element={<Sportsboard />} />
				<Route path="/Board3" element={<Stockboard />} />
				<Route path="/Board4" element={<Gameboard />} />
				<Route path="/Detailpage/:boardId" element={<Detailpage />} />
				<Route path="/upload" element={<Uploadpage />} />
			</Routes>
			<Footer />
		</BrowserRouter>
	);
}

export default Router;
