import {
	NewPatient,
	Gender,
	HealthCheckRating,
	SickLeave,
	Discharge,
	NewEntry,
	EntryType
} from './types';

export const toNewPatient = ( object: any ): NewPatient => {
	return {
		name: parseName(object.name),
		dateOfBirth: parseDate(object.dateOfBirth),
		ssn: parseSsn(object.ssn),
		gender: parseGender(object.gender),
		occupation: parseOccupation(object.occupation),
		entries: []
	}
}

const isString = (text: any): text is string => {
	return typeof text === 'string' || text instanceof String;
};

const parseName = (name:any): string => {
	if (!name || !isString(name))
		throw new Error('Incorrect or missign name: '+ name);

	return name;
};

const isDate = (date: any) => {
	return Boolean(Date.parse(date));
};

const parseDate = (date: any): string => {
	if (!date || !isString(date) || !isDate(date))
		throw new Error('Incorrect or missing date of birth: '+ date);

	return date;
};

const parseSsn = (ssn: any): string => {
	if (!ssn || !isString(ssn))
		throw new Error('Incorrect or missing ssn: '+ ssn);

	return ssn;
};

const isGender = (param: any): param is Gender => {
	return Object.values(Gender).includes(param);
};

const parseGender = (gender: any): Gender => {
	if (!gender || !isGender(gender))
		throw new Error('Incorrect or missing gender');

	return gender;
};

const parseOccupation = (occupation: any): string => {
	if (!occupation || !isString(occupation))
		throw new Error('Incorrect or missing occupation');

	return occupation;
};


export const toNewEntry = ( object: any ): NewEntry<EntryType> => {
	const entryType: EntryType = parseType(object.type);
	const newEntry = {
		description: parseDescription(object.description),
		date: parseDate(object.date),
		specialist: parseSpecialist(object.specialist),
		diagnosisCodes: parseDiagnosisCodes(object.diagnosisCodes),
	}

	switch (entryType) {
		case 'HealthCheck':
			const healthEntry: NewEntry<'HealthCheck'> = {
				...newEntry,
				type: object.type,
				healthCheckRating: parseHealthRating(object.healthCheckRating)
			}
			return healthEntry;
		case 'OccupationalHealthcare':
			if (!object.startDate && !object.endDate) {
				const occupationalEntry: NewEntry<'OccupationalHealthcare'> = {
					...newEntry,
					type: object.type,
					employerName: parseName(object.employerName),
				}
				return occupationalEntry
			} else {
				const occupationalEntry: NewEntry<'OccupationalHealthcare'> = {
					...newEntry,
					type: object.type,
					employerName: parseName(object.employerName),
					sickLeave: parseSickLeave(object.startDate, object.endDate),
				}
				return occupationalEntry;
			}
		case 'Hospital':
			const hospitalEntry: NewEntry<'Hospital'> = {
				...newEntry,
				type: object.type,
				discharge: parseDischarge(object.dischargeDate, object.criteria)
			}
			return hospitalEntry
	}
}

const parseDescription = (description: string): string => {
	if (!description || !isString(description))
		throw new Error('Incorrect or missing description');

	return description;
};

const parseSpecialist = (specialist: string): string => {
	if (!specialist || !isString(specialist))
		throw new Error('Incorrect or missing specialist');

	return specialist;
};

const parseDiagnosisCodes = (codes: string[]): string[] | undefined => {
	if (!codes)
		return undefined;
	
	for (let code in codes) {
		if (!isString(code))
			throw new Error('Incorrect or missing diagnosis codes');
			return
	};

	return codes;
};

const parseType = (type: string): EntryType => {
	if (!type || !isString(type))
		throw new Error('Incorrect or missing type');

	switch(type) {
		case 'HealthCheck':
			return 'HealthCheck'
		case 'OccupationalHealthcare':
			return 'OccupationalHealthcare';
		case 'Hospital':
			return 'Hospital';
		default:
			throw new Error('Incorrect or missing type');
	};
};

const isHealthRating = (param: any): param is HealthCheckRating => {
	return Object.values(HealthCheckRating).includes(param);
};
const parseHealthRating = (rating: any): HealthCheckRating => {
	if (rating === null || !isHealthRating(rating))
		throw new Error('Incorrect or missing health check rating');

	return rating;
}

const parseSickLeave = (startDate: any, endDate: any): SickLeave => {		
	if ((!startDate && endDate) || (startDate && !endDate) || !isDate(startDate) || !isDate(endDate))
		throw new Error('Incorrect or missing sick leave');

	return {
		startDate: startDate,
		endDate: endDate
	};
}

const parseDischarge = (date: any, criteria: any): Discharge => {
	console.log(date, criteria)
	if (!date || !criteria || !isDate(date) || !isString(criteria))
		throw new Error('Incorrect or missing discharge');
	
	return {
		dischargeDate: date as string,
		criteria: criteria as string
	};
}