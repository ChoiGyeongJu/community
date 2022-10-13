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
	const [UserLog, setUserLog] = useState(false);
	const [Toggle, setToggle] = useState(false);

	useEffect(() => {
		if (localStorage.getItem('token')) {
			setUserLog(true);
		} else {
			setUserLog(false);
		}
	}, [localStorage.getItem('token')]);

	const ClickLog = () => {
		setToggle(!Toggle);
		if (UserLog) {
		} else {
			ScrollTop();
			navigate('/login');
		}
	};

	const requestLogOut = () => {
		localStorage.removeItem('token');
		localStorage.removeItem('refreshToken');
		alert('로그아웃 되었습니다.');
		window.location.replace('/');
	};

	const el = useRef();
	const handleToggle = e => {
		if (Toggle && (!el.current || !el.current.contains(e.target))) {
			setToggle(false);
		}
	};
	useEffect(() => {
		document.addEventListener('click', handleToggle);
		return () => {
			document.removeEventListener('click', handleToggle);
		};
	});

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
				<img className="login-icon" src={loginbtn} onClick={ClickLog} ref={el} />
				{UserLog && Toggle ? (
					<div className="toggle-menu">
						<p
							style={{ cursor: 'pointer' }}
							onClick={() => {
								setToggle(false);
								ScrollTop();
								navigate('/mypage');
							}}
						>
							마이페이지
						</p>
						<p
							style={{ cursor: 'pointer' }}
							onClick={() => {
								setToggle(false);
								requestLogOut();
							}}
						>
							로그아웃
						</p>
					</div>
				) : null}
			</div>
		</div>
	);
};

export default Navbar;
