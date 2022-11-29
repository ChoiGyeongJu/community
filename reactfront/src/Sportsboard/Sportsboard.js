/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react/jsx-key */
import '../Freeboard/Freeboard.scss';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SportsPagination from './SportsPagination/SportsPagination';
import boardImg from '../images/boardImg.png';
import { ScrollTop } from '../Hooks/Hooks';
import url from '../FetchURL/URL.js';

const Sportsboard = () => {
	const navigate = useNavigate();
	const [boardcontents, setBoardcontents] = useState([]);

	useEffect(() => {
		fetch(`${url}/board/board-list/2`)
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

	const AddViews = id => {
		fetch(`${url}/board/add-view/${id}`, {
			method: 'PATCH',
		})
			.then(res => res.json())
			.then(data => {
				if (data.message === 'success') {
				}
			});
	};

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
		let writerComp = document.getElementById('writer');
		let viewComp = document.getElementById('view');
		let titleComp = document.getElementById('title');
		let dateComp = document.getElementById('date');
		let category = document.getElementById('category');
		if (resize > 650) {
			writerComp.style.display = '';
			viewComp.style.display = '';
			category.style.fontSize = '16px';
			titleComp.style.width = '63%';
			dateComp.style.width = '8%';
		} else {
			writerComp.style.display = 'none';
			viewComp.style.display = 'none';
			category.style.fontSize = '3vw';
			titleComp.style.width = '72%';
			dateComp.style.width = '20%';
		}
	}, [resize]);

	return (
		<div className="freeboard">
			<div className="board">
				<div className="board-title">
					<img className="board-icon" src={boardImg} />
					<div id="category" className="category">
						스포츠 게시판
					</div>
					{localStorage.getItem('token') ? (
						<div>
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
					) : null}
				</div>
				<div id="index" className="index">
					<div className="index-title" style={{ width: 'auto', minWidth: '35px' }}>
						번호
					</div>
					<div id="title" className="index-title" style={{ width: '65%', marginRight: '5%' }}>
						제목
					</div>
					<div id="writer" className="index-title" style={{ width: '10%' }}>
						작성자
					</div>
					<div id="date" className="index-title" style={{ width: '10%' }}>
						등록일
					</div>
					<div id="view" className="index-title" style={{ width: '8%', marginLeft: '1.5%' }}>
						조회수
					</div>
				</div>
				{boardcontents &&
					Pagination &&
					Pagination[Page].map((com, idx) => {
						return (
							<div id="info" className="contents-info" key={idx}>
								<div className="number">{com.index}</div>
								<div
									className="title"
									onClick={() => {
										ScrollTop();
										AddViews(com.id);
										navigate(`/Detailpage/${com.id}`);
									}}
								>
									{com.title}
								</div>
								{resize > 650 ? <div className="writer">{com.nickname}</div> : null}
								<div className="date">{com.date}</div>
								{resize > 650 ? <div className="views">{com.views}</div> : null}
							</div>
						);
					})}
				{buttonPagination && Pagination.length > 0 && (
					<SportsPagination
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

export default Sportsboard;
