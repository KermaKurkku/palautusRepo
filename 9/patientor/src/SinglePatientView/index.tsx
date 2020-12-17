import React from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'

import {
	Container,
	Header,
	Icon,
	List,
} from 'semantic-ui-react'

import { apiBaseUrl } from '../constants'
import { Patient, NewEntry, EntryType } from '../types'
import { useStateValue, updatePatient,  } from "../state";
import SingleEntry from './Components/SingleEntry'
import AddEntryModal from '../AddEntryModal'


const SinglePatientView: React.FC = () => {
	const [{ patients }, dispatch] = useStateValue();
	const { id } = useParams<{ id: string }>();

	const [modalOpen, setModalOpen] = React.useState<boolean>(false);
	const [error, setError] = React.useState<string | undefined>();

	React.useEffect(() => {
		const fetchById = async (id: string) => {
			try {
				const { data: patientFromId } = await axios.get<Patient>(
					`${apiBaseUrl}/patients/${id}`
				);
				dispatch(updatePatient(patientFromId));
			} catch (e) {
				console.log('Error: ', e.message);
			}
			
		};
		
		if (!patients[id] || !patients[id].ssn)
			fetchById(id);
	}, [id]); // eslint-disable-line

	// Set entry field to open
	const openModal = (): void => setModalOpen(true);

	// close entry field
	const closeModal = (): void => {
		setModalOpen(false);
		setError(undefined);
	};

	const submitNewPatient = async (values: NewEntry<EntryType>) => {
		try {
			const { data: updatedPatient } = await axios.post<Patient>(
				`${apiBaseUrl}/patients/${id}/entries`,
				values
			);
			dispatch(updatePatient(updatedPatient));
			closeModal();
		} catch (e) {
			console.error(e.response.data);
			setError(e.response.data.error);
		}
	};

	if (!patients[id] || !patients[id].ssn)
		return <Header as="h2">...loading</Header>;

	return (
		<div className="App">
			<Container>
				<Header as="h1">{patients[id].name}
					{
						patients[id].gender === "male" ? <Icon name='mars' />
						: patients[id].gender === 'female' ? <Icon name='venus' />
						: <Icon name='genderless' />
					}
				</Header>
				<button className="ui primary button"
					onClick={() => openModal()}>Add Entry</button>
				<br/>
				<Container>
					ssn: {patients[id].ssn}<br/>
					occupation: {patients[id].occupation}
				</Container>
				{
					patients[id].entries.length > 0 ?
						<Container>
							<Header as="h3">entries</Header>
							<List>
								{
									patients[id].entries.map(e => 
										<List.Item key={e.id}>
											<div className="ui raised segment">
												<SingleEntry entry={e} />
											</div>
										</List.Item>
									)
								}
							</List>
						</Container>
					: null
				}
			</Container>
			<AddEntryModal
				modalOpen={modalOpen}
				onSubmit={submitNewPatient}
				error={error}
				onClose={closeModal}
			/>
		</div>
	)
};

export default SinglePatientView