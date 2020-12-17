import React from "react";
import ReactDOM from "react-dom";

import { CoursePart } from './types'

import Header from './components/Header';
import Content from './components/Content';
import Total from './components/Total';

const App: React.FC = () => {
  const courseName = "Half Stack application development";

	// this is the new coursePart variable
	const courseParts: CoursePart[] = [
		{
			name: "Fundamentals",
			exerciseCount: 10,
			description: "This is an awesome course part"
		},
		{
			name: "Using props to pass data",
			exerciseCount: 7,
			groupProjectCount: 3
		},
		{
			name: "Deeper type usage",
			exerciseCount: 14,
			description: "Confusing description",
			exerciseSubmissionLink: "https://fake-exercise-submit.made-up-url.dev"
		},
		{
			name: "Testing course parts",
			exerciseCount: 2,
			description: "This is a test",
			testPart: "Testing"
		}
	];

  return (
    <div>
			<Header name={courseName} />
			<Content parts={courseParts} />
			<Total courses={courseParts} />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));

