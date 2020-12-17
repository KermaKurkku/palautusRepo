import React from "react";
import { Grid, Button, Dropdown, DropdownItemProps, DropdownProps, Header, Segment } from "semantic-ui-react";
import { Field, Formik, Form, FormikProps } from "formik";

import { TextField, DiagnosisSelection, NumberField } from "../AddPatientModal/FormField";
import { NewEntry, EntryType, EntryTypeEnum } from "../types";
import { useStateValue } from '../state'

interface Props {
  onSubmit: (values: NewEntry<EntryType>) => void;
  onCancel: () => void;
}

export const AddEntryForm: React.FC<Props> = ({ onSubmit, onCancel }) => {
	const [{ diagnoses }] = useStateValue();
	const typeOptions: DropdownItemProps[] = Object.values(EntryTypeEnum).map(t => {
		return { text: t, value: t }
	})

	const [type, setType] = React.useState<string>(String(typeOptions[0].value))

	const TypeSelection = ({typeOptions, setFieldValue} : {typeOptions: DropdownItemProps[]; setFieldValue: FormikProps<{ type: string }>["setFieldValue"]; }) => {
		const field = "type";
		const onChange = (
			_event: React.SyntheticEvent<HTMLElement, Event>,
			data: DropdownProps
		) => {
			setFieldValue(field, data.value);
			setType(String(data.value))
		};
	
		return (
			<span>
				<Header as="h3">Type of entry {' '}
				<Dropdown
					inline
					label="type"
					name="type"
					options={typeOptions}
					defaultValue={type}
					onChange={onChange}
				/></Header>
			</span>
		)
	}
	

  return (
    <Formik
      initialValues={{
				description: "",
				date: "",
				specialist: "",
				diagnosisCodes: [],
				type: type,
				healthCheckRating: 0,
				employerName: "",
				startDate: "",
				endDate: "",
				dischargeDate: "",
				criteria: ""
      }}
      onSubmit={onSubmit}
      validate={values => {
				const isDate = (date: any) => {
					return Boolean(Date.parse(date));
				};
        const requiredError = "Field is required";
        const errors: { [field: string]: string } = {};
        if (!values.description) {
          errors.description = requiredError;
        }
        if (!values.date) {
          errors.date = requiredError;
				}
				if (values.date)
					if (!isDate(values.date)) {
						console.log(!isDate(values.date))
						errors.date = "Incorrect formatting"
					}
        if (!values.specialist) {
          errors.specialist = requiredError;
        }
        if (!values.diagnosisCodes) {
          errors.diagnosisCodes = requiredError;
				}
				
				switch (values.type) {
					case 'HealthCheck':
						if (values.healthCheckRating !== 0)
							if (values.healthCheckRating > 3 || values.healthCheckRating < 0 || !values.healthCheckRating)
								errors.healthCheckRating = "Incorrect value";
						return errors;
					case 'OccupationalHealthcare':
						if (!values.employerName)
							errors.employerName = requiredError;

						if (values.startDate)
							if (!isDate(values.startDate))
								errors.startDate = "Incorrect formatting"
						
						if (values.endDate) {
							if (!isDate(values.endDate))
								errors.endDate = "Incorrect formatting"
							else if (Date.parse(values.endDate) <= Date.parse(values.startDate))
								errors.endDate = "End date cannot be smaller than start date"
						}
						return errors;
					case 'Hospital':
						if (!values.dischargeDate)
							errors.dischargeDate = requiredError;
						else if(!isDate(values.dischargeDate))
							errors.dischargDate = "Incorrect formatting"

						if (!values.criteria)
							errors.criteria = requiredError;
						return errors
					default:
						break;
				}
      }}
    >
      {({ isValid, dirty, setFieldValue, setFieldTouched }) => {
        return (
          <Form className="form ui">
						<TypeSelection
							typeOptions={typeOptions}
							setFieldValue={setFieldValue}
						/>
						<br/>
            <Field
              label="description"
              placeholder="Description"
              name="description"
              component={TextField}
            />
            <Field
              label="Date"
              placeholder="YYYY-MM-DD"
              name="date"
              component={TextField}
            />
            <Field
              label="specialist"
              placeholder="Specialist"
              name="specialist"
              component={TextField}
            />
            <DiagnosisSelection 
							setFieldValue={setFieldValue}
							setFieldTouched={setFieldTouched}
							diagnoses={Object.values(diagnoses)}
						/>
						<Segment>
							{
								type === 'HealthCheck' ? 
								<Field 
									label="health check rating"
									name="healthCheckRating"
									component={NumberField}
									min={0}
									max={3}
								/> : type === 'OccupationalHealthcare' ?
								<div>
									<Field
										label="employer name"
										placeholder="employer name"
										name="employerName"
										component={TextField}
									/>
									<Header as="h4">Sick Leave</Header>
									<Field
										label="start date"
										placeholder="YYYY-MM-DD"
										name="startDate"
										component={TextField}
									/>
									<Field
										label="end date"
										placeholder="YYYY-MM-DD"
										name="endDate"
										component={TextField}
									/>
								</div> : type === 'Hospital' ?
								<div>
									<Header as="h4">Discharge</Header>
									<Field
										label="date"
										placeholder="YYYY-MM-DD"
										name="dischargeDate"
										component={TextField}
									/>
									<Field
										label="criteria"
										placeholder="criteria"
										name="criteria"
										component={TextField}
									/>
								</div>: null
							}
						</Segment>
            
            <Grid>
              <Grid.Column floated="left" width={5}>
                <Button type="button" onClick={onCancel} color="red">
                  Cancel
                </Button>
              </Grid.Column>
              <Grid.Column floated="right" width={5}>
                <Button
                  type="submit"
                  floated="right"
                  color="green"
                  disabled={!dirty || !isValid}
                >
                  Add
                </Button>
              </Grid.Column>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddEntryForm;
