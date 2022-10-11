/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from 'react';
import '../../Freeboard/FreePagination/FreePagination.scss';
import NextArrow from '../../images/NextArrow.png';
import { ScrollTop } from '../../Hooks/Hooks';

const StockPagination = props => {
	const { buttonPagination, Pagination, Page, setPage } = props;

	const handleButtonPage = order => {
		if (order === 'minus') {
			if (Page === 0) {
				// alert('첫 페이지 입니다.');
			} else {
				setPage(Page => Page - 1);
			}
		} else if (order === 'plus') {
			if (Page + 1 >= Pagination.length) {
				// alert('마지막 페이지 입니다.');
			} else {
				setPage(Page => Page + 1);
			}
		}
	};

	const handlePage = page => {
		setPage(page);
	};

	return (
		<div className="Freepagination">
			<div className="prevButtonBox">
				<img className="prevButton" src={NextArrow} onClick={() => handleButtonPage('minus')} />
			</div>
			<div className="pageNumberBox">
				{buttonPagination[parseInt(Page / 5)].map((com, idx) => {
					return (
						<p
							className={idx === Page % 5 ? 'currentbutton' : 'button'}
							key={idx}
							onClick={() => {
								handlePage(5 * parseInt(Page / 5) + idx);
								ScrollTop();
							}}
						>
							{5 * parseInt(Page / 5) + idx + 1}
						</p>
					);
				})}
				<div className="nextButtonBox">
					<img className="nextButton" src={NextArrow} onClick={() => handleButtonPage('plus')} />
				</div>
			</div>
		</div>
	);
};

export default StockPagination;
