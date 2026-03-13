import { Field, FieldAttributes } from 'formik';
import { DateTimePicker, DateTimePickerProps } from 'formik-mui-x-date-pickers';

import { useBreakpoint } from '@/hooks/useBreakpoint';

export const StyledDateTime = (props: FieldAttributes<any>) => {
  const breakpoint = useBreakpoint();

  return (
    <Field
      component={(fieldProps: DateTimePickerProps) => {
        if (fieldProps.slotProps) {
          fieldProps.slotProps.textField = {
            size: breakpoint.isSmall ? 'small' : 'medium',
            ...fieldProps.slotProps.textField,
          }; // Ugly, but forces fieldProps.slotProps.textField.size to exist
        }
        return <DateTimePicker {...fieldProps} />;
      }}
      label={props.name}
      {...props}
    />
  );
};
