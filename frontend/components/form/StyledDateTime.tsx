import { Field, FieldAttributes } from 'formik';
import { DateTimePicker, DateTimePickerProps } from 'formik-mui-x-date-pickers';

import { useBreakpoint } from '@/hooks/useBreakpoint';

export const StyledDateTime = (props: FieldAttributes<any>) => {
  const breakpoint = useBreakpoint();

  return (
    <Field
      component={(props: DateTimePickerProps) => (
        <DateTimePicker
          slotProps={{
            textField: {
              size: breakpoint.isSmall ? 'small' : 'medium',
              ...props.slotProps?.textField,
            },
            ...props.slotProps,
          }}
          {...props}
        />
      )}
      label={props.name}
      {...props}
    />
  );
};
