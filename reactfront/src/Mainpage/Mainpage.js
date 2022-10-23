/* eslint-disable react/jsx-key */
import './Mainpage.scss';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScrollTop } from '../Hooks/Hooks';
import url from '../FetchURL/URL.js';

const Mainpage = () => {
	const navigate = useNavigate();
	const [boardcontents, setBoardcontents] = useState([]);
	const [category, setCategory] = useState([]);

	useEffect(() => {
		fetch(`${url}/board/categories`)
			.then(res => res.json())
			.then(data => {
				if (data.message === 'success') {
					setCategory(data.categories_info);
				}
			});
		fetch(`${url}/board/board-all`)
			.then(res => res.json())
			.then(data => {
				if (data.message === 'success') {
					setBoardcontents(data.board_info);
				}
			});
	}, []);
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
	return (
		<div className="main-page">
			{category.length > 0 &&
				category.map((item, idx) => {
					return (
						<div className="board" key={idx}>
							<div
								className="title"
								onClick={() => {
									navigate(`/Board${idx + 1}`);
								}}
							>
								{item.name}
							</div>
							{boardcontents[idx] &&
								boardcontents[idx].map((com, id) => {
									return (
										<div className="board-contents" key={id}>
											<div className="board-writer">{com.nickname}</div>
											<div
												className="board-title"
												onClick={() => {
													ScrollTop();
													AddViews(com.id);
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
