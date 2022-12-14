/* eslint-disable no-useless-constructor */
import React, { Component } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ImageResize from 'quill-image-resize';
Quill.register('modules/ImageResize', ImageResize);

class EditorComponent extends Component {
	constructor(props) {
		super(props);
	}

	modules = {
		toolbar: [
			//[{ 'font': [] }],
			[{ header: [1, 2, false] }],
			['bold', 'italic', 'underline', 'strike'],
			// [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
			['image'],
			[{ align: [] }, { color: [] }, { background: [] }], // dropdown with defaults from theme
			// ['clean'],
		],
		ImageResize: {
			parchment: Quill.import('parchment'),
		},
	};

	formats = [
		// 'font',
		'header',
		'bold',
		'italic',
		'underline',
		'strike',
		'blockquote',
		'list',
		'bullet',
		'indent',
		'link',
		'image',
		'align',
		'color',
		'background',
	];

	render() {
		const { value, onChange } = this.props;
		return (
			<div style={{ height: 'min(850px, 90vw)', minHeight: '400px' }}>
				<ReactQuill
					style={{ height: 'min(700px, 60vw)', minHeight: '300px' }}
					theme="snow"
					modules={this.modules}
					formats={this.formats}
					value={value || ''}
					onChange={(content, delta, source, editor) => onChange(editor.getHTML())}
				/>
			</div>
		);
	}
}
export default EditorComponent;
