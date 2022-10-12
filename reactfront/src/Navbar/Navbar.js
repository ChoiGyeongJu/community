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
							navigate('/Board1');
						}}
					>
						자유게시판
					</div>
				</div>
				<div className="menu-wrap">
					<div
						className="menu"
						onClick={() => {
							ScrollTop();
							navigate('/Board2');
						}}
					>
						스포츠
					</div>
				</div>
				<div className="menu-wrap">
					<div
						className="menu"
						onClick={() => {
							ScrollTop();
							navigate('/Board3');
						}}
					>
						주식/코인
					</div>
				</div>
				<div className="menu-wrap">
					<div
						className="menu"
						onClick={() => {
							ScrollTop();
							navigate('/Board4');
						}}
					>
						게임
					</div>
				</div>
				<img className="search-icon" src={search} />
				<img
					className="login-icon"
					src={loginbtn}
					onClick={() => {
						navigate('/login');
					}}
				/>
			</div>
		</div>
	);
};

export default Navbar;
