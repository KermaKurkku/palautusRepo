import React from 'react';
import { Entry } from '../../types';

import {
	Header,
	Icon
} from 'semantic-ui-react';

const HealthCheck: React.FC<{ entry: Entry }> = ({ entry }) => {
	if (entry.type !== 'HealthCheck')
		return null

	return (
		<div>
			<Header as="h3">{entry.date} <Icon name="user md"/></Header>
			<p>{entry.description}</p>
			{
				entry.healthCheckRating === 0 ? <Icon name="heart" color="green" />
				: entry.healthCheckRating === 1 ? <Icon name="heart" color="yellow" />
				: entry.healthCheckRating === 2 ? <Icon name="heart" color="orange" />
				: <Icon name="heart" color="red" />
			}
		</div>
	)
};

export default HealthCheck;