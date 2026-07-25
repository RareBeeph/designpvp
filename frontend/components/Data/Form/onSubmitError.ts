import { FormikHelpers } from 'formik';

import { AnyError } from '@/components/Data/Configs/types';

export default function onSubmitError<TValues>(
  actions: FormikHelpers<TValues>,
  newError: AnyError | undefined,
) {
  newError?.response?.data.errors?.forEach(fieldError => {
    if (fieldError.attr) actions.setFieldError(fieldError.attr, fieldError.detail);
  });
}
