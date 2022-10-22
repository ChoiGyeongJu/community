/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react/jsx-key */
import React, { useState, useEffect, useRef } from 'react';
import url from '../../FetchURL/URL.js';
import './Review.scss';
import replyImg from '../../images/reply.png';

const Review = ({
	Reviewcontents, // 대댓글 포함 댓글 리스트
	boardId,
	UserInfo,
	parentArr, // 대댓글
	setParentArr,
	MyReviewArr, // 댓글 수정 삭제할때 자신의 리뷰인지 확인할 때 사용
	setMyReviewArr,
	parentReview, // 대댓글 리스트
	MyParentArr, // 대댓글 수정 삭제할때 자신의 리뷰인지 확인할 때 사용
	setMyParentArr,
}) => {
	const [content, setContent] = useState(); // 댓글
	const handleContent = e => {
		setContent(e.target.value);
	};

	const [parentContent, setparentContent] = useState(); // 대댓글
	const handleParentReview = e => {
		setparentContent(e.target.value);
	};

	const UploadReview = () => {
		// 댓글 등록 함수
		if (content && IsLogin) {
			if (window.confirm('댓글을 등록하시겠습니까?')) {
				const formData = new FormData();
				formData.append('content', content);
				formData.append('board', boardId);
				fetch(`${url}/review/upload`, {
					method: 'POST',
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
						} else {
							alert('댓글 등록에 실패하였습니다.');
						}
					});
			}
		}
	};

	const UploadParentReview = id => {
		// 답글 등록 함수
		if (parentContent && IsLogin) {
			if (window.confirm('답글을 등록하시겠습니까?')) {
				const formData = new FormData();
				formData.append('content', parentContent);
				formData.append('board', boardId);
				formData.append('parent_review', Reviewcontents[id].id);
				fetch(`${url}/review/upload`, {
					method: 'POST',
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
						} else {
							alert('댓글 등록에 실패하였습니다.');
						}
					});
			}
		}
	};

	const [IsLogin, setIsLogin] = useState(false);
	const [placeHolder, setPlaceHolder] = useState('');
	useEffect(() => {
		if (localStorage.getItem('token')) {
			setIsLogin(true);
			setPlaceHolder('댓글 내용을 입력하세요.');
		} else {
			setPlaceHolder('로그인 후 이용할 수 있습니다.');
		}
	}, []);

	const DeleteReview = id => {
		// 댓글 삭제 함수
		if (window.confirm('댓글을 삭제하시겠습니까?')) {
			fetch(`${url}/review/delete/${id}`, {
				method: 'DELETE',
				headers: {
					AccessToken: localStorage.getItem('token'),
					RefreshToken: localStorage.getItem('refreshToken'),
				},
			})
				.then(res => res.json())
				.then(data => {
					if (data.message === 'success') {
						window.location.reload();
					} else {
					}
				});
		}
	};

	const handleParent = id => {
		// 답글 textarea 토글
		if (localStorage.getItem('token')) {
			let tmp = [...parentArr];
			if (tmp[id] === false) {
				for (let i = 0; i < Reviewcontents.length; i++) {
					tmp[i] = false;
				}
				tmp[id] = true;
			} else {
				for (let i = 0; i < Reviewcontents.length; i++) {
					tmp[i] = false;
				}
			}
			setParentArr(tmp);
		}
	};

	const handleCorrect = id => {
		// 댓글 수정 삭제 토글
		initParentArr();
		let tmp = [...MyReviewArr];
		if (tmp[id] === false) {
			for (let i = 0; i < MyReviewArr.length; i++) {
				tmp[i] = false;
			}
			tmp[id] = true;
		} else {
			for (let i = 0; i < MyReviewArr.length; i++) {
				tmp[i] = false;
			}
		}
		setMyReviewArr(tmp);
	};

	const initReviewArr = () => {
		// 댓글 토글 false로 초기화
		let tmp = [...MyReviewArr];
		for (let i = 0; i < MyReviewArr.length; i++) {
			tmp[i] = false;
		}
		setMyReviewArr(tmp);
	};

	const handleParentCorrect = id => {
		// 대댓글 수정 삭제 토글
		initReviewArr();
		let tmp = [...MyParentArr];
		if (tmp[id] === false) {
			for (let i = 0; i < MyParentArr.length; i++) {
				tmp[i] = false;
			}
			tmp[id] = true;
		} else {
			for (let i = 0; i < MyParentArr.length; i++) {
				tmp[i] = false;
			}
		}
		setMyParentArr(tmp);
	};
	const initParentArr = () => {
		// 대댓글 토글 false로 초기화
		let tmp = [...MyParentArr];
		for (let i = 0; i < MyParentArr.length; i++) {
			tmp[i] = false;
		}
		setMyParentArr(tmp);
	};

	return (
		<div className="review-box">
			<div className="create-review">
				<textarea onChange={handleContent} disabled={!IsLogin} placeholder={placeHolder} />
				<button className="upload-button" onClick={UploadReview}>
					등록
				</button>
			</div>
			{Reviewcontents &&
				Reviewcontents.map((com, idx) => {
					return (
						<div key={idx}>
							{com.parent_review ? null : (
								<div>
									<div className="review-page">
										<div className="review-info">
											<div className="writer">{com.user}</div>
											<div className="date">{com.date}</div>
										</div>
										{UserInfo && UserInfo.id === com.user_id ? (
											<div>
												<div
													className="update"
													onClick={() => {
														handleCorrect(idx);
													}}
												>
													...
												</div>
												<div className={MyReviewArr[idx] ? 'show-toggle' : 'hide-toggle'}>
													<div className="text">수정</div>
													<div
														className="text"
														onClick={() => {
															DeleteReview(com.id);
														}}
													>
														삭제
													</div>
												</div>
											</div>
										) : null}
										<div className="review-content">
											<pre className="content">{com.content}</pre>
										</div>
										<div
											className="write-button"
											onClick={() => {
												handleParent(idx);
											}}
										>
											답글달기
										</div>
										{parentArr[idx] ? (
											<div style={{ paddingBottom: '50px' }}>
												<textarea onChange={handleParentReview} placeholder="답글을 입력하세요." />
												<button
													className="upload-button"
													onClick={() => {
														UploadParentReview(idx);
													}}
												>
													등록
												</button>
												<button
													className="upload-button"
													onClick={() => {
														handleParent(idx);
													}}
												>
													취소
												</button>
											</div>
										) : null}
										{/* 대댓글 리스트 */}
										{parentReview &&
											parentReview.map((item, id) => {
												return (
													<div key={id}>
														{item.parent_review === com.id ? (
															<div>
																<div className="parent-review">
																	<img className="reply-image" src={replyImg} />
																	<div className="parent-info">
																		<div className="writer">{item.user}</div>
																		<div className="date">{item.date}</div>
																	</div>
																	{UserInfo && UserInfo.id === item.user_id ? (
																		<div>
																			<div
																				className="update"
																				onClick={() => {
																					handleParentCorrect(id);
																				}}
																			>
																				...
																			</div>
																			<div
																				className={MyParentArr[id] ? 'show-toggle' : 'hide-toggle'}
																			>
																				<div className="text">수정</div>
																				<div
																					className="text"
																					onClick={() => {
																						DeleteReview(item.id);
																					}}
																				>
																					삭제
																				</div>
																			</div>
																		</div>
																	) : null}
																	<div className="parent-content">
																		<pre className="content">{item.content}</pre>
																	</div>
																</div>
															</div>
														) : null}
													</div>
												);
											})}
									</div>
								</div>
							)}
						</div>
					);
				})}
			{Reviewcontents.length === 0 ? (
				<div className="review-page">
					<p>등록된 댓글이 없습니다.</p>
				</div>
			) : null}
		</div>
	);
};

export default Review;
