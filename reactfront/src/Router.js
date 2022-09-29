import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navbar from './Navbar/Navbar.js';
import Mainpage from './Mainpage/Mainpage.js';
import Freeboard from './Freeboard/Freeboard.js';
import Detailpage from './Detailpage/Detailpage.js';
import Uploadpage from './Uploadpage/Uploadpage.js';

import Footer from './Footer/Footer.js';

function Router() {
	return (
		<BrowserRouter>
			<Navbar />
			<Routes>
				<Route path="/" element={<Mainpage />} />
				<Route path="/freeboard" element={<Freeboard />} />
				<Route path="/Detailpage/:boardId" element={<Detailpage />} />
				<Route path="/upload" element={<Uploadpage />} />
			</Routes>
			<Footer />
		</BrowserRouter>
	);
}

export default Router;
