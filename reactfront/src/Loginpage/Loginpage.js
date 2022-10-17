/* eslint-disable react/jsx-pascal-case */
import './Loginpage.scss';
import Google_LogIn from './SocialLogin/GoogleLogin/Google_Login';
import Kakao_Login from './SocialLogin/KakaoLogin/Kakao_Login';
import Naver_Login from './SocialLogin/NaverLogin/Naver_Login';

const Loginpage = () => {
	return (
		<div className="login-page">
			<div className="board">
				<div className="title">환영합니다!</div>
				<Google_LogIn />
				<Kakao_Login />
				<Naver_Login />
			</div>
		</div>
	);
};

export default Loginpage;
