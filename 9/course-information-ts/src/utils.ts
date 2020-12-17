/* eslint-disable @typescript-eslint/no-explicit-any */
import { CoursePart } from './types'

const isString = (text: any): text is string => {
	return typeof text === 'string' || text instanceof String;
};


export const CourseParser = (courses: Array<any>): CoursePart[] | null => {

	const malformatted = (course: any): boolean => {
		if (!course.name || !isString(course.name) || !course.exerciseCount || !Number(course.exerciseCount))
			return false;
		return true;
	}
	if (courses.filter(malformatted).length < courses.length)
		return null;
	
	return courses as CoursePart[];
	
};

