import { useEffect, Component, useState, useRef } from 'react';
import url from '../../../FetchURL/URL.js';
import './Naver_Login.scss';
import naverToken from '../../../Secret/naverToken.js';

const Naver_Login = () => {
	const naverRef = useRef();
	const handleClick = () => {
		naverRef.current.children[0].click();
	};
	const userAccessToken = () => {
		window.location.href.includes('access_token') && getToken();
	};
	const getToken = () => {
		const token = window.location.href.split('=')[1].split('&')[0];
		localStorage.setItem('naver_token', token);
	};

	const initializeNaverLogin = () => {
		const naverScript = document.createElement('script');
		naverScript.src = 'https://static.nid.naver.com/js/naveridlogin_js_sdk_2.0.2-nopolyfill.js';
		naverScript.type = 'text/javascript';
		document.head.appendChild(naverScript);
		naverScript.onload = () => {
			const naverLogin = new window.naver.LoginWithNaverId({
				clientId: naverToken,
				callbackUrl: 'http://localhost:3000/login#',
				callbackHandle: false,
				isPopup: false, // 로그인 팝업여부
				loginButton: {
					color: 'green',
					type: 3, // 버튼타입(1,2,3)
					height: 32, // 배너 및 버튼 높이
				},
			});
			naverLogin.init();
			naverLogin.logout();
			naverLogin.getLoginStatus(status => {
				if (status) {
					const formData = new FormData();
					formData.append('token', localStorage.getItem('naver_token'));
					formData.append('name', naverLogin.user.name);
					formData.append('email', naverLogin.user.email);
					formData.append('id', naverLogin.user.id);
					fetch(`${url}/user/login/naver`, {
						method: 'POST',
						body: formData,
					})
						.then(res => res.json())
						.then(data => {
							if (data.message === 'success') {
								localStorage.clear();
								localStorage.setItem('token', data.JWT.AccessToken);
								localStorage.setItem('refreshToken', data.JWT.RefreshToken);
								window.location.replace('/');
							}
						});
				} else {
				}
			});
		};
	};

	useEffect(() => {
		userAccessToken();
		initializeNaverLogin();
	}, []);

	return (
		<div className="naver-button">
			<div ref={naverRef} id="naverIdLogin"></div>
			<button
				onClick={() => {
					handleClick();
				}}
				className="naver"
			>
				네이버로 로그인하기
			</button>
		</div>
	);
};

export default Naver_Login;
