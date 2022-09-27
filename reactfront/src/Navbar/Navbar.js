/* eslint-disable jsx-a11y/alt-text */
import './Navbar.scss';
import logo from '../images/logo.png';
import search from '../images/search.png';
import loginbtn from '../images/user.png';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
	const navigate = useNavigate();

	const [SearchModal, setSearchModal] = useState(false);
	const toggleSearchModal = () => {
		setSearchModal(!SearchModal);
	};

	const focusSearch = () => {
		window.setTimeout(() => {
			document.getElementById('inputSearch').focus();
		}, 500);
	};
	const refSearch = useRef();
	const handleCloseSearchModal = e => {
		if (SearchModal && !(refSearch.current && refSearch.current.contains(e.target))) {
			setSearchModal(false);
		}
	};
	useEffect(() => {
		document.addEventListener('click', handleCloseSearchModal);
		return () => {
			document.removeEventListener('click', handleCloseSearchModal);
		};
	});

	const ScrollTop = () => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		});
	};

	return (
		<div className="navbar">
			<div className="nav-contents">
				<img
					className="logo"
					src={logo}
					onClick={() => {
						ScrollTop();
						navigate('/');
					}}
				/>
				<div className="menu-wrap">
					<div
						className="menu"
						onClick={() => {
							ScrollTop();
							navigate('/freeboard');
						}}
					>
						자유게시판
					</div>
				</div>
				<div className="menu-wrap">
					<div className="menu">XX게시판</div>
				</div>
				<div className="menu-wrap">
					<div className="menu">XX게시판</div>
				</div>
				<div className="menu-wrap">
					<div className="menu">XX게시판</div>
				</div>
				<img className="search-icon" src={search} />
				<img className="login-icon" src={loginbtn} />
			</div>
		</div>
	);
};

export default Navbar;
