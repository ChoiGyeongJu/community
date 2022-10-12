import './Loginpage.scss';
import Google_LogIn from './SocialLogin/GoogleLogin/Google_Login';

const Loginpage = () => {
	return (
		<div className="login-page">
			<div className="board">
				<div className="title">환영합니다!</div>
				<Google_LogIn />
			</div>
		</div>
	);
};

export default Loginpage;
