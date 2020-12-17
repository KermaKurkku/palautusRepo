import React from 'react';
import { Entry } from '../../types';

import {
	Header,
	Icon,
	List
} from 'semantic-ui-react';

const OccupationalHealthCare: React.FC<{ entry: Entry }> = ({ entry }) => {
	if (entry.type !== 'OccupationalHealthcare')
		return null

	return (
		<div>
			<Header as="h3">{entry.date} <Icon name="stethoscope"/> {entry.employerName}</Header>
			<p>{entry.description}</p>
			
			{
				entry.sickLeave ?
					<div>
						<Header as="h4">Sick leave</Header>
						<List>
							<List.Item>start date: {entry.sickLeave.startDate}</List.Item>
							<List.Item>end date: {entry.sickLeave.endDate}</List.Item>
						</List>
					</div>
				: null
			}
		</div>
	)
};

export default OccupationalHealthCare;