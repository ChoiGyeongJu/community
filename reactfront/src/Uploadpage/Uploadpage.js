/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react/jsx-key */
import './Uploadpage.scss';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EditorComponent from './EditorComponent';
import Select from 'react-select';
import { ScrollTop } from '../Hooks/Hooks';
import url from '../FetchURL/URL.js';

const Uploadpage = () => {
	const customStyles = {
		control: (provided, state) => ({
			...provided,
			background: '#fff',
			borderColor: '#9e9e9e',
			minHeight: '40px',
			height: '40px',
			boxShadow: state.isFocused ? null : null,
			cursor: 'pointer',
		}),

		valueContainer: (provided, state) => ({
			...provided,
			height: '40px',
			padding: '0 6px',
		}),

		input: (provided, state) => ({
			...provided,
			margin: '0px',
		}),
		indicatorSeparator: state => ({
			display: 'none',
		}),
		indicatorsContainer: (provided, state) => ({
			...provided,
			height: '40px',
		}),
	};
	const navigate = useNavigate();
	const [title, setTitle] = useState('');
	const [category, setCategory] = useState([
		{
			value: 1,
			label: '자유게시판',
		},
		{ value: 2, label: '스포츠' },
		{ value: 3, label: '주식/코인' },
		{ value: 4, label: '게임' },
	]);

	const handleTitle = e => {
		const { name, value } = e.target;
		if (name === 'title') {
			setTitle(value);
		} else {
			setTitle(value);
		}
	};

	const [content, setContent] = useState('');
	function onEditorChange(value) {
		setContent(value);
	}

	const [Selected, setSelected] = useState();
	const handleSelect = e => {
		setSelected(e.value);
	};

	const Upload = () => {
		if (window.confirm('게시글을 등록하시겠습니까?')) {
			const formData = new FormData();
			formData.append('title', title);
			formData.append('content', content);
			formData.append('category', Selected);

			if (title && content && Selected) {
				fetch(`${url}/board/upload`, {
					method: 'POST',
					headers: {
						AccessToken: localStorage.getItem('token'),
						RefreshToken: localStorage.getItem('refreshToken'),
					},
					body: formData,
				})
					.then(res => res.json())
					.then(data => {
						console.log(data);
						if (data.message === 'success') {
							window.location.replace(`/Detailpage/${data.board_id}`);
						} else {
							alert('등록 실패');
						}
					});
			} else {
				alert('모든 칸을 채워주세요.');
			}
		} else {
		}
	};

	return (
		<div className="upload">
			<div className="container">
				<div className="board-title">게시글 등록</div>
				<div className="content-container">
					<Select
						className="select-box"
						placeholder="게시판을 선택해주세요."
						options={category}
						styles={customStyles}
						value={category.find(obj => obj.value === Selected)}
						onChange={handleSelect}
					/>
					<input name="title" placeholder="제목을 입력해주세요." onChange={handleTitle} />
					<EditorComponent value={content} onChange={onEditorChange} />
				</div>
				<div className="button">
					<div
						className="cancel-button"
						onClick={() => {
							ScrollTop();
							navigate(-1);
						}}
					>
						취소
					</div>
					<div className="upload-button" onClick={Upload}>
						등록
					</div>
				</div>
			</div>
		</div>
	);
};

export default Uploadpage;
