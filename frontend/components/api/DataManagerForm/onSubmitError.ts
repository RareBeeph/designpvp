import { AnyError } from '../TableConfigs/types';
import { FormikHelpers } from 'formik';

export default function onSubmitError<TValues>(
  actions: FormikHelpers<TValues>,
  newError: AnyError | undefined,
) {
  newError?.response?.data.errors?.forEach(fieldError => {
    if (fieldError.attr) actions.setFieldError(fieldError.attr, fieldError.detail);
  });
}
