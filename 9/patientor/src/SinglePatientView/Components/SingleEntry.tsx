import React from 'react';

import HealthCheck from './HealthCheck';
import OccupationalHealthcare from './OccupationalHealthCare';
import Hospital from './Hospital';
import { Entry } from '../../types';
import DiagnosisList from './DiagnosisList';

const SingleEntry: React.FC<{ entry: Entry }> = ({ entry }) => {	
	const entryDetails = () => {
		switch (entry.type) {
			case "HealthCheck":
				return <HealthCheck entry={entry} />;
			case "OccupationalHealthcare":
				return <OccupationalHealthcare entry={entry} />;
			case "Hospital":
				return <Hospital entry={entry} />;
			default:
				assertNever(entry);
		}
	}
	return (
		<div>
			{entryDetails()}
			<DiagnosisList entry={entry} />
		</div>
	)
}

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

export default SingleEntry