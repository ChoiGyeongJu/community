import KakaoLogin from 'react-kakao-login';
import { useEffect } from 'react';
import url from '../../../FetchURL/URL.js';
import './Kakao_Login.scss';
import token from '../../../Secret/kakaoToken.js';

const Kakao_Login = () => {
	const kakaoResponse = response => {
		localStorage.setItem('token', response.response.access_token);
		fetch(`${url}/user/login/kakao`, {
			method: 'POST',
			headers: {
				Authorization: response.response.access_token,
			},
		})
			.then(res => res.json())
			.then(data => {
				localStorage.removeItem('token');
				if (data.message === 'success') {
					localStorage.setItem('token', data.JWT.AccessToken);
					localStorage.setItem('refreshToken', data.JWT.RefreshToken);
					window.location.replace('/');
				}
			});
	};
	return (
		<div className="kakao-button">
			<KakaoLogin
				token={token}
				onSuccess={kakaoResponse}
				onFail={console.log('')}
				onLogout={console.info}
				useLoginForm
				style={{
					borderRadius: '40px',
					width: '200px',
					height: '32px',
					cursor: 'pointer',
					backgroundColor: 'rgb(255, 235, 0)',
					border: '1px',
				}}
			/>
		</div>
	);
};

export default Kakao_Login;
