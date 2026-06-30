import { MenuItem } from '@mui/material';
import { Field } from 'formik';
import { SelectProps } from 'formik-mui';
import { Select } from 'formik-mui';

import { useBreakpoint } from '@/hooks/useBreakpoint';

export default function StyledSelectField({
  data,
  name,
  value,
  ...props
}: {
  name: string;
  value: string | string[];
  data: { id: number; name: string }[];
}) {
  const { isSmall } = useBreakpoint();

  return (
    <Field
      component={(SelectProps: SelectProps) => (
        <Select size={isSmall ? 'small' : 'medium'} {...SelectProps} />
      )}
      name={name}
      value={value}
      multiple={typeof value !== 'string'}
      {...props}
    >
      {data.map(v => (
        <MenuItem value={v.id.toString()} key={v.id}>
          {v.name}
        </MenuItem>
      ))}
    </Field>
  );
}
