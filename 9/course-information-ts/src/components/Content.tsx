/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import Part from './Part';

import { CoursePart } from '../types'
 
const Content: React.FC<any> = (props: {parts: CoursePart[]}) => {


	return (
		<div>
			<ul>
				{props.parts.map(part => (
					<li key={part.name}>
						<Part part={part} />
					</li>
				))}
			</ul>
		</div>
	);
};



export default Content;