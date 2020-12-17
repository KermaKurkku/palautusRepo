import patients from '../../data/patients';
import { v4 as uuidv4 } from 'uuid';

import {
	PublicPatient,
	Patient,
	NewPatient,
	NewEntry,
	EntryType
} from '../types'

const getPatients = (): Array<Patient> => {
	return patients;
};

const getPatientsWithoutSensitiveInfo = (): PublicPatient[] => {
	return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
		id,
		name,
		dateOfBirth,
		gender,
		occupation
	}))
};

const addPatient = (obj: any): NewPatient => {
	const newPatient = {
		id: uuidv4(),
		...obj
	};
	patients.push(newPatient);
	return newPatient;
};

const findById = (id: string): Patient | undefined => {
	const patient = patients.find(p => p.id === id);
	return patient;
};

const addEntry = (id: string, entry: NewEntry<EntryType>) => {
	const patient = patients.find(p => p.id === id);
	if (!patient)
		return null;
	
	const newEntry = {
		id: uuidv4(),
		...entry
	}

	const patientWithNewEntry = {
		...patient,
		entries: patient.entries.concat(newEntry)
	};
	return patientWithNewEntry;
};

export default {
	getPatients,
	getPatientsWithoutSensitiveInfo,
	addPatient,
	findById,
	addEntry,
};