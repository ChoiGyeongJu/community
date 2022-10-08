/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react/jsx-key */
import './Freeboard.scss';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FreePagination from './FreePagination/FreePagination';
import boardImg from '../images/boardImg.png';
import { ScrollTop } from '../Hooks/Hooks';
import url from '../FetchURL/URL.js';

const Freeboard = () => {
	const navigate = useNavigate();
	const [boardcontents, setBoardcontents] = useState([]);

	useEffect(() => {
		fetch(`${url}/board/board-list/1`)
			.then(res => res.json())
			.then(data => {
				if (data.message === 'success') {
					setBoardcontents(data.board_list);
				}
			});
	}, []);

	// Pagination
	const [Pagination, setPagination] = useState();
	const [Page, setPage] = useState(0);
	const [buttonPagination, setButtonPagination] = useState();

	useEffect(() => {
		let Arrtmp = [];
		let buttonArr = [];
		if (boardcontents.length > 0) {
			for (let i = 0; i < boardcontents.length; i += 15) {
				Arrtmp.push(boardcontents.slice(i, i + 15));
			}
			setPagination(Arrtmp);
			for (let j = 0; j < Arrtmp.length; j += 5) {
				buttonArr.push(Arrtmp.slice(j, j + 5));
			}
			setButtonPagination(buttonArr);
		}
	}, [boardcontents]);
	return (
		<div className="freeboard">
			<div className="board">
				<div className="board-title">
					<img className="board-icon" src={boardImg} />
					<div className="category">자유게시판</div>
					<div
						className="write-button"
						onClick={() => {
							ScrollTop();
							navigate('/upload');
						}}
					>
						글쓰기
					</div>
				</div>
				<div className="index">
					<div className="index-title">번호</div>
					<div className="index-title" style={{ width: '63%' }}>
						제목
					</div>
					<div className="index-title" style={{ width: '13%' }}>
						작성자
					</div>
					<div className="index-title" style={{ width: '10%' }}>
						등록일
					</div>
					<div className="index-title" style={{ width: '8%' }}>
						조회수
					</div>
				</div>
				{boardcontents &&
					Pagination &&
					Pagination[Page].map((com, idx) => {
						return (
							<div className="contents-info">
								<div className="number">{com.id}</div>
								<div
									className="title"
									onClick={() => {
										ScrollTop();
										navigate(`/Detailpage/${com.id}`);
									}}
								>
									{com.title}
								</div>
								<div className="writer">{com.nickname}</div>
								<div className="date">{com.date}</div>
								<div className="views">{com.views}</div>
							</div>
						);
					})}
				{buttonPagination && Pagination.length > 0 && (
					<FreePagination
						buttonPagination={buttonPagination}
						setPage={setPage}
						Page={Page}
						Pagination={Pagination}
					/>
				)}
			</div>
		</div>
	);
};

export default Freeboard;
