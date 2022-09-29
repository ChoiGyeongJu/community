/* eslint-disable jsx-a11y/alt-text */
import './Navbar.scss';
import logo from '../images/logo.png';
import search from '../images/search.png';
import loginbtn from '../images/user.png';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScrollTop } from '../Hooks/Hooks';
import url from '../FetchURL/URL';

const Navbar = () => {
	const navigate = useNavigate();

	// const [category, setCategory] = useState([]);
	// useEffect(() => {
	// 	fetch(`${url}/board/categories`)
	// 		.then(res => res.json())
	// 		.then(data => {
	// 			console.log(data);
	// 			setCategory(data.categories_info);
	// 		});
	// }, []);

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
					<div className="menu">스포츠</div>
				</div>
				<div className="menu-wrap">
					<div className="menu">주식/코인</div>
				</div>
				<div className="menu-wrap">
					<div className="menu">게임</div>
				</div>
				<img className="search-icon" src={search} />
				<img className="login-icon" src={loginbtn} />
			</div>
		</div>
	);
};

export default Navbar;
