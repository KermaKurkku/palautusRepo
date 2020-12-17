import express from 'express';
import patientService from '../services/patientService';
import { toNewPatient, toNewEntry} from '../utils';

const router = express.Router();

router.post('/:id/entries', (req,res) => {
	try {
		const newEntry = toNewEntry(req.body);

		const patientWithNewEntry = patientService.addEntry(req.params.id, newEntry);
		res.json(patientWithNewEntry);
	} catch (e) {
		res.status(404).send(e.message);
	}
})

router.get('/:id', (req, res) => {
	const patient = patientService.findById(req.params.id);

	if (patient)
		res.send(patient);
	else
		res.sendStatus(404);
})

router.get('/', (_req, res) => {
	res.send(patientService.getPatientsWithoutSensitiveInfo());
});

router.post('/', (req, res) => {
	try {
		const newPatient = toNewPatient(req.body);
		
		const addedPatient = patientService.addPatient(newPatient);
		res.json(addedPatient)
	} catch (e) {
		res.status(404).send(e.message);
	}
});

export default router