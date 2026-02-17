import { Field, FieldAttributes } from 'formik';
import { DateTimePicker } from 'formik-mui-x-date-pickers';

export const StyledDateTime = (props: FieldAttributes<any>) => {
  return <Field component={DateTimePicker} label={props.name} {...{ ...props }} />;
};
