/* eslint-disable react/jsx-key */
import './Mainpage.scss';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Mainpage = () => {
	const navigate = useNavigate();
	const [board, setBoard] = useState(['자유게시판', 'XX게시판', 'XX게시판', 'XX게시판']);
	const [boardcontents, setBoardcontents] = useState([
		{
			id: '1',
			writer: '홍길동1',
			title:
				'테스트 게시판 제목임테스트 트 게시판 제목임테스트 게시판 제목임테스트 게시판 제목임테스게시판 제목임테스트 게시판 제목임',
			date: '2022-09-26',
		},
		{ id: '2', writer: '홍길동2', title: '테스트 게시판 제목임', date: '2022-09-26' },
		{ id: '3', writer: '홍길동3', title: '테스트 게시판 제목임', date: '2022-09-26' },
		{ id: '4', writer: '홍길동4', title: '테스트 게시판 제목임', date: '2022-09-26' },
		{ id: '5', writer: '홍길동5', title: '테스트 게시판 제목임', date: '2022-09-26' },
		{ id: '6', writer: '홍길동6', title: '테스트 게시판 제목임', date: '2022-09-26' },
		{ id: '7', writer: '홍길동7', title: '테스트 게시판 제목임', date: '2022-09-26' },
	]);

	return (
		<div className="main-page">
			{board.map((item, idx) => {
				return (
					<div className="board" key={idx}>
						<div className="title">{item}</div>
						{boardcontents.map((com, id) => {
							return (
								<div className="board-contents" key={id}>
									<div className="board-writer">{com.writer}</div>
									<div
										className="board-title"
										onClick={() => {
											navigate(`/Detailpage/${com.id}`);
										}}
									>
										{com.title}
									</div>
									<div className="board-date">{com.date}</div>
								</div>
							);
						})}
					</div>
				);
			})}
		</div>
	);
};

export default Mainpage;
