interface BaseEntry {
	id: string;
	description: string;
	date: string;
	specialist: string;
	diagnosisCodes?: Array<Diagnosis['code']>;
}

export enum HealthCheckRating {
	"Healthy" = 0,
	"LowRisk" = 1,
	"HighRisk" = 2,
	"CriticalRisk" = 3
}

interface HealthCheckEntry extends BaseEntry {
	type: "HealthCheck",
	healthCheckRating: HealthCheckRating;
};

export interface SickLeave {
	startDate: string;
	endDate: string;
}

interface OccupationalHealthCareEntry extends BaseEntry {
	type: "OccupationalHealthcare";
	employerName: string;
	sickLeave?: SickLeave;
};

export interface Discharge {
	dischargeDate: string;
	criteria: string;
}

interface HospitalEntry extends BaseEntry{
	type: "Hospital";
	discharge: Discharge;
}

export type Entry = 
	| HospitalEntry
	| OccupationalHealthCareEntry
	| HealthCheckEntry

export interface Diagnosis {
	code: string;
	name: string;
	latin?: string;
};

export interface Patient {
	id: string;
	name: string;
	dateOfBirth: string;
	ssn: string;
	gender: string;
	occupation: string;
	entries: Entry[]
};

export enum Gender {
	Male = 'male',
	Female = 'female',
	Other = 'other'
}

export type PublicPatient = Omit<Patient, 'ssn' | 'entries'>;

export type NewPatient = Omit<Patient, 'id'>;

export type EntryType = 'HealthCheck' | 'OccupationalHealthcare' | 'Hospital';

export type NewEntry<T> = T extends 'HealthCheck' ? Omit<HealthCheckEntry, 'id'>
	: T extends 'OccupationalHealthcare' ? Omit<OccupationalHealthCareEntry, 'id'>
	: T extends 'Hospital' ? Omit<HospitalEntry, 'id'> : undefined; 