/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

import { CoursePart } from '../types';
import { CourseParser } from '../utils';

const Total: React.FC<any> = ({ courses }) => {
	const formattedCourses = CourseParser(courses);

	if (!formattedCourses)
		return <p style={{ color: 'red' }}>malformatted courses</p>;

	const total = (acc: number, val: CoursePart) => {
		return acc + Number(val.exerciseCount);
	};

	return (
	<p>Total {formattedCourses.reduce(total, 0)}</p>
	);
	
};

export default Total;