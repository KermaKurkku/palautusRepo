import React from 'react';
import { Entry } from '../../types';

import {
	Header,
	Icon,
	List
} from 'semantic-ui-react';

const Hospital: React.FC<{ entry: Entry }> = ({ entry }) => {
	if (entry.type !== 'Hospital')
		return null;

	return (
		<div>
			<Header as="h3">{entry.date} <Icon name="hospital"/></Header>
			<p>{entry.description}</p>
			<Header as="h4">discharge</Header>
			<List>
				<List.Item>date: {entry.discharge.dischargeDate}</List.Item>
				<List.Item>criteria: {entry.discharge.criteria}</List.Item>
			</List>
		</div>
	)
};

export default Hospital;