import React from 'react';
import { Entry, Diagnosis } from '../../types';
import axios from 'axios';
import { apiBaseUrl } from '../../constants';
import { addDiagnoses, useStateValue } from '../../state';

import {
	Container
} from 'semantic-ui-react';



const DiagnosisList: React.FC<{ entry: Entry }> = ({ entry }) => {
	const [{ diagnoses }, dispatch] = useStateValue();
	React.useEffect(() => {
		const getDiagnoses = async () => {
			try {
				const { data: diagnosesToAdd } = await axios.get<Diagnosis[]>(apiBaseUrl+'/diagnosis');
				dispatch(addDiagnoses(diagnosesToAdd));
			} catch (e) {
				console.log('Error: ', e.message)
			}
		}
		if (!Object.keys(diagnoses).length)
			getDiagnoses()
	}, []) // eslint-disable-line

	if (!Object.keys(diagnoses).length)
		return <h2>...loading</h2>

	return (
		<div>
			<Container>
					{ 
						entry.diagnosisCodes 
						? <ul>
								{
									entry.diagnosisCodes.map(d => 
										<li key={d}>{d} {diagnoses[d].name}</li>)
								}
							</ul>
						: null
					}
			</Container>
		</div>
	)
}

export default DiagnosisList;