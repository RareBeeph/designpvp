import { Field, FieldAttributes } from 'formik';
import { TextField } from 'formik-mui';

import { useBreakpoint } from '@/hooks/useBreakpoint';

export const StyledTextField = (props: FieldAttributes<any>) => {
  const { isSmall } = useBreakpoint();
  const size = isSmall ? 'small' : 'medium';
  return <Field component={TextField} label={props.name} size={size} {...props} />;
};
