/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

import { CoursePart } from '../types';

const Part: React.FC<any> = (props: { part: CoursePart}) => {
	const part = props.part;
	switch(part.name) {
		case 'Fundamentals':
			return <p>{part.name} {part.exerciseCount} {part.description}</p>;
		case 'Using props to pass data':
			return <p>{part.name} {part.exerciseCount} {part.groupProjectCount}</p>;
		case 'Deeper type usage':
			return <p>{part.name} {part.exerciseCount} {part.description} {part.exerciseSubmissionLink}</p>;
		case 'Testing course parts':
			return <p>{part.name} {part.exerciseCount} {part.description} {part.testPart}</p>
		default:
			return assertNever(part);
	}
};

const assertNever = (value: never): never => {
	throw new Error(`Unhandled discriminated union member: ${JSON.stringify(value)}`);
};


export default Part;