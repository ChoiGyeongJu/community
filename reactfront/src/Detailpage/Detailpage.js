/* eslint-disable react/jsx-key */
import './Detailpage.scss';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';

const Detailpage = () => {
	const params = useParams();
	const [Detailcontents, setDetailcontents] = useState({
		writer: '홍길동1',
		title: '테스트 게시판 제목',
		date: '2022-09-26',
		views: 123,
		reviews: 1,
	});

	return (
		<div className="detail-page">
			<div className="board">
				<div className="board-title">자유게시판</div>
				<div className="contents-title">{Detailcontents.title}</div>
				<div className="contents-info">
					<div className="writer">
						<div style={{ fontWeight: '600', marginRight: '8px' }}>작성자</div>
						{Detailcontents.writer}
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
			</div>
		</div>
	);
};

export default Detailpage;
