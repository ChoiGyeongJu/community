/* eslint-disable react/jsx-no-useless-fragment */
import React, { useState, useEffect } from 'react';
import './Google_Login.scss';
// import { GoogleLogin, GoogleLogout } from 'react-google-login';
import { GoogleLogout } from 'react-google-login';
import url from '../../../FetchURL/URL.js';
import { GoogleLogin } from '@react-oauth/google';
import { GoogleOAuthProvider } from '@react-oauth/google';
import clientId from '../../../Secret/clientId.js';

const Google_Login = () => {
	//구글 로그인 성공했을때
	const onLogin = response => {
		localStorage.setItem('token', response.credential);
		fetch(`${url}/user/login/google`, {
			method: 'POST',
			headers: {
				Authorization: response.credential,
			},
		})
			.then(response => response.json())
			.then(data => {
				localStorage.removeItem('token');
				if (data.message === 'success') {
					localStorage.setItem('token', data.JWT.AccessToken);
					localStorage.setItem('refreshToken', data.JWT.RefreshToken);
					window.location.replace('/');
				}
			});
	};

	const onLogout = () => {
		localStorage.removeItem('token');
		localStorage.removeItem('refreshToken');
		alert('로그아웃 되었습니다.');
		window.location.replace('/');
	};

	return (
		<React.Fragment>
			<div>
				{
					localStorage.getItem('token') === null ? (
						<div className="google-button">
							{' '}
							<GoogleOAuthProvider clientId={clientId}>
								<GoogleLogin
									size="medium"
									shape="circle"
									width="80%"
									logo_alignment="center"
									onSuccess={credentialResponse => {
										console.log(credentialResponse);
										onLogin(credentialResponse);
									}}
									onError={() => {
										console.log('Login Failed');
									}}
								/>
							</GoogleOAuthProvider>
						</div>
					) : null
					// <button onClick={onLogout}>로그아웃</button>
					// <GoogleLogout clientId={clientId} buttonText="로그아웃" onLogoutSuccess={onLogout} />
				}
			</div>
		</React.Fragment>
	);
};

export default Google_Login;
