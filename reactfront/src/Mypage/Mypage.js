/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react/jsx-key */
import './Mypage.scss';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScrollTop } from '../Hooks/Hooks';
import url from '../FetchURL/URL.js';
import userImg from '../images/mypageUser.svg';
import replyImg from '../images/reply.png';

const Mypage = () => {
	const navigate = useNavigate();
	const [Myboard, setMyboard] = useState([]);
	const [MyReview, setMyReview] = useState([]);
	const [beforeName, setBeforeName] = useState({});

	const [afterName, setafterName] = useState(); // 댓글
	const handleNickname = e => {
		setafterName(e.target.value);
	};

	useEffect(() => {
		if (localStorage.getItem('token')) {
			fetch(`${url}/user/mypage`, {
				method: 'GET',
				headers: {
					AccessToken: localStorage.getItem('token'),
					RefreshToken: localStorage.getItem('refreshToken'),
				},
			})
				.then(res => res.json())
				.then(data => {
					console.log(data);
					setBeforeName(data.user_info);
					setMyboard(data.board_list);
					setMyReview(data.review_list);
				});
		}
	}, []);

	const UpdateNickname = () => {
		// 댓글 수정 함수
		if (afterName) {
			if (window.confirm('닉네임을 변경하시겠습니까?')) {
				const formData = new FormData();
				formData.append('nickname', afterName);
				fetch(`${url}/user/update-nickname`, {
					method: 'PATCH',
					headers: {
						AccessToken: localStorage.getItem('token'),
						RefreshToken: localStorage.getItem('refreshToken'),
					},
					body: formData,
				})
					.then(res => res.json())
					.then(data => {
						if (data.message === 'success') {
							window.location.reload();
						} else if (data.message === 'Nickname Already Exist') {
							alert('다른 사용자가 사용중인 닉네임입니다.');
						}
					});
			}
		}
	};

	return (
		<div className="mypage">
			<div className="board">
				<div className="board-title">
					<img className="board-icon" src={userImg} />
					<div className="category">마이페이지</div>
				</div>
				<div className="content">
					내 게시글
					{Myboard.length === 0 ? (
						<p className="title">등록한 게시글이 없습니다.</p>
					) : (
						Myboard.map((com, idx) => {
							return (
								<div
									className="title"
									key={idx}
									onClick={() => {
										navigate(`/Detailpage/${com.id}`);
									}}
								>
									{com.date} {com.title}
								</div>
							);
						})
					)}
				</div>
				<div className="content">
					내 댓글
					{MyReview.length === 0 ? (
						<p className="title">등록한 댓글이 없습니다.</p>
					) : (
						MyReview.map((com, idx) => {
							return (
								<div
									className="title"
									key={idx}
									onClick={() => {
										navigate(`/Detailpage/${com.board_id}`);
									}}
								>
									{com.date} {com.board_title}에 남긴 댓글
									<div className="review">
										<img className="reply-image" src={replyImg} />
										{com.content}
									</div>
								</div>
							);
						})
					)}
				</div>
				<div style={{ marginTop: '100px' }} />
				<div className="content">
					닉네임 변경하기
					<div className="change-name">변경 전 닉네임 : {beforeName.nickname}</div>
					<div className="change-name">
						변경 할 닉네임 :{' '}
						<input placeholder="변경하실 닉네임을 입력하세요." onChange={handleNickname} />
					</div>
					<button onClick={UpdateNickname}>변경하기</button>
				</div>
			</div>
		</div>
	);
};

export default Mypage;
