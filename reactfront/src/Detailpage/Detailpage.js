/* eslint-disable react/jsx-key */
import './Detailpage.scss';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import url from '../FetchURL/URL.js';

const Detailpage = () => {
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

	return (
		<div className="detail-page">
			<div className="board">
				<div className="board-title">자유게시판</div>
				<div className="contents-title">{Detailcontents.title}</div>
				<div className="contents-info">
					<div className="writer">
						<div style={{ fontWeight: '600', marginRight: '8px' }}>작성자</div>
						{Detailcontents.nickname}
					</div>
					<div className="writer" style={{ width: '15%' }}>
						<div style={{ fontWeight: '600', marginRight: '8px' }}>등록일</div>
						{Detailcontents.date}
					</div>
					<div className="writer" style={{ width: '10%' }}>
						<div style={{ fontWeight: '600', marginRight: '8px' }}>조회수</div>
						{Detailcontents.views}
					</div>
					<div className="writer" style={{ width: '8%' }}>
						<div style={{ fontWeight: '600', marginRight: '8px' }}>댓글</div>
						{Detailcontents.reviews}
					</div>
				</div>
				<div className="contents-box">{Detailcontents.content}</div>
			</div>
		</div>
	);
};

export default Detailpage;
