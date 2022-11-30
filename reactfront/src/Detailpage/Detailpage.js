/* eslint-disable react/jsx-key */
import './Detailpage.scss';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import url from '../FetchURL/URL.js';
import Review from './Review/Review';
import { ScrollTop } from '../Hooks/Hooks';

const Detailpage = () => {
	const navigate = useNavigate();
	const params = useParams();
	const [Detailcontents, setDetailcontents] = useState({});

	useEffect(() => {
		fetch(`${url}/board/board/${params.boardId}`)
			.then(res => res.json())
			.then(data => {
				if (data.message === 'success') {
					setDetailcontents(data.board_info);
				}
			});
	}, []);

	const [parentArr, setParentArr] = useState([]);
	const [MyReviewArr, setMyReviewArr] = useState([]);
	const [MyParentArr, setMyParentArr] = useState([]);
	const [Reviewcontents, setReviescontents] = useState([]);
	const [parentReview, setParentReview] = useState([]);
	useEffect(() => {
		fetch(`${url}/review/list/${params.boardId}`)
			.then(res => res.json())
			.then(data => {
				if (data.message === 'success') {
					setReviescontents(data.review_info);
				}
			});
	}, []);

	useEffect(() => {
		let tmp = []; // 댓글 길이만큼 false 배열 (토글에 사용)
		let parent_tmp = []; // 대댓글 정보 리스트
		let temp = []; // 대댓글 길이만큼 false 배열 (토글에 사용)
		for (let i = 0; i < Reviewcontents.length; i++) {
			tmp.push(false);
			if (Reviewcontents[i].parent_review) {
				parent_tmp.push(Reviewcontents[i]);
			}
		}
		for (let i = 0; i < parent_tmp.length; i++) {
			temp.push(false);
		}
		setParentArr(tmp);
		setMyReviewArr(tmp);
		setParentReview(parent_tmp.reverse());
		setMyParentArr(temp);
	}, [Reviewcontents]);

	const [UserInfo, setUserInfo] = useState([]);
	useEffect(() => {
		if (localStorage.getItem('token')) {
			fetch(`${url}/user/user`, {
				method: 'GET',
				headers: {
					AccessToken: localStorage.getItem('token'),
					RefreshToken: localStorage.getItem('refreshToken'),
				},
			})
				.then(res => res.json())
				.then(data => {
					setUserInfo(data.user_info);
				});
		}
	}, []);

	const [resize, setResize] = useState(window.innerWidth);
	const handleResize = () => {
		setResize(window.innerWidth);
	};

	useEffect(() => {
		window.addEventListener('resize', handleResize);
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	useEffect(() => {
		let reviewComp = document.getElementById('reviewNum');
		let displayComp = document.getElementById('contents-info');
		if (resize < 500) {
			reviewComp.style.display = 'none';
		} else {
			reviewComp.style.display = '';
		}
		if (resize < 300) {
			displayComp.style.display = 'block';
		} else {
			displayComp.style.display = 'flex';
		}
	}, [resize]);

	return (
		<div className="detail-page">
			<div className="board">
				<div className="board-title">{Detailcontents.category}</div>
				<div className="contents-title">{Detailcontents.title}</div>
				<div id="contents-info" className="contents-info">
					<div className="writer">
						<div style={{ fontWeight: '600', marginRight: 'min(2vw, 6px)' }}>작성자</div>
						{Detailcontents.nickname}
					</div>
					<div className="date">
						<div id="date" style={{ fontWeight: '600', marginRight: 'min(2vw, 8px)' }}>
							등록일
						</div>
						{Detailcontents.date}
					</div>
					<div id="views" className="views">
						<div style={{ fontWeight: '600', marginRight: 'min(2vw, 8px)' }}>조회수</div>
						{Detailcontents.views}
					</div>
					<div id="reviewNum" className="reviewNum">
						<div style={{ fontWeight: '600', marginRight: 'min(2vw, 8px)' }}>댓글</div>
						{Reviewcontents.length}
					</div>
				</div>
				<div
					className="contents-box"
					dangerouslySetInnerHTML={{
						__html: Detailcontents.content,
					}}
				/>
				<div className="review">
					댓글 ({Reviewcontents.length})
					<div
						className="list-button"
						onClick={() => {
							ScrollTop();
							navigate(`/Board${Detailcontents.category_id}`);
						}}
					>
						목록
					</div>
				</div>

				<Review
					Reviewcontents={Reviewcontents}
					boardId={params.boardId}
					UserInfo={UserInfo}
					parentArr={parentArr}
					setParentArr={setParentArr}
					MyReviewArr={MyReviewArr}
					setMyReviewArr={setMyReviewArr}
					parentReview={parentReview}
					MyParentArr={MyParentArr}
					setMyParentArr={setMyParentArr}
				/>
			</div>
		</div>
	);
};

export default Detailpage;
