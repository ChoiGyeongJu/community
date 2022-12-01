/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable jsx-a11y/alt-text */
import './Navbar.scss';
import logo from '../images/logo.png';
import search from '../images/search.png';
import loginbtn from '../images/user.png';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScrollTop } from '../Hooks/Hooks';
import url from '../FetchURL/URL';

import 'bootstrap/dist/css/bootstrap.css';
// import Container from 'react-bootstrap/Container';
// import Nav from 'react-bootstrap/Nav';
// import Navbar from 'react-bootstrap/Navbar';
// import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';

const NavbarComponent = () => {
	const navigate = useNavigate();
	const [UserLog, setUserLog] = useState(false);

	useEffect(() => {
		if (localStorage.getItem('token')) {
			setUserLog(true);
		} else {
			setUserLog(false);
		}
	}, [localStorage.getItem('token')]);

	const requestLogOut = () => {
		localStorage.clear();
		alert('로그아웃 되었습니다.');
		window.location.replace('/');
	};

	const [expand, setExpand] = useState('sm');

	return (
		<>
			<Navbar
				key={expand}
				bg="light"
				expand={expand}
				className="mb-3"
				style={{ position: 'fixed', zIndex: '99' }}
			>
				<Container fluid style={{ width: 'min(98%, 1200px)' }}>
					<Navbar.Brand href="/">Community</Navbar.Brand>
					<Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
					<Navbar.Offcanvas
						id={`offcanvasNavbar-expand-${expand}`}
						aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
						placement="end"
					>
						<Offcanvas.Header closeButton>
							<Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>Menu</Offcanvas.Title>
						</Offcanvas.Header>
						<Offcanvas.Body>
							<Nav className="justify-content-center flex-grow-1 pe-3">
								<Nav.Link href="/Board1">자유게시판</Nav.Link>
								<Nav.Link href="/Board2">스포츠</Nav.Link>
								<Nav.Link href="/Board3">주식/코인</Nav.Link>
								<Nav.Link href="/Board4" style={{ marginRight: 'auto' }}>
									게임
								</Nav.Link>
								{UserLog ? (
									<NavDropdown title="XXX님" id={`offcanvasNavbarDropdown-expand-${expand}`}>
										<NavDropdown.Item href="/mypage">마이페이지</NavDropdown.Item>
										<NavDropdown.Divider />
										<NavDropdown.Item
											onClick={() => {
												requestLogOut();
											}}
										>
											로그아웃
										</NavDropdown.Item>
									</NavDropdown>
								) : (
									<Nav.Link href="/login">로그인/회원가입</Nav.Link>
								)}
							</Nav>
						</Offcanvas.Body>
					</Navbar.Offcanvas>
				</Container>
			</Navbar>
		</>
	);
};

export default NavbarComponent;
