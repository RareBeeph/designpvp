import { MenuItem } from '@mui/material';
import { Field } from 'formik';
import { SelectProps } from 'formik-mui';
import { Select } from 'formik-mui';

import { useBreakpoint } from '@/hooks';

export default function StyledSelectField({
  data,
  name,
  value,
  multiple,
  ...props
}: {
  name: string;
  value: string | string[];
  multiple?: boolean;
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
      multiple={multiple ?? Array.isArray(value)}
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
