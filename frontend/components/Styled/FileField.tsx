import { Button, FormHelperText, Stack, Typography } from '@mui/material';
import { useField } from 'formik';

import { useBreakpoint } from '@/hooks';

export interface StyledFileFieldProps {
  name: string;
  label?: string;
  /** Passed straight to the input, e.g. "image/*". Only a hint - validate server side. */
  accept?: string;
}

/**
 * A file picker wired into Formik.
 *
 * formik-mui has no equivalent, and `<Field>` can't drive a file input anyway: browsers
 * forbid setting `value` on one, so it has to stay uncontrolled and push the selected
 * File into form state by hand.
 */
export default function StyledFileField({ name, label, accept }: StyledFileFieldProps) {
  const [field, meta, helpers] = useField<File | null>(name);
  const { isSmall } = useBreakpoint();
  const error = meta.touched ? meta.error : undefined;

  return (
    <Stack direction="column" spacing={0.5}>
      <Stack direction="row" alignItems="center">
        <Button variant="outlined" component="label" size={isSmall ? 'small' : 'medium'}>
          {label ?? name}
          <input
            type="file"
            accept={accept}
            hidden
            onChange={event => {
              void helpers.setValue(event.currentTarget.files?.[0] ?? null);
              void helpers.setTouched(true);
            }}
          />
        </Button>
        <Typography variant="body2" noWrap>
          {field.value?.name ?? 'No file chosen'}
        </Typography>
      </Stack>
      {error && <FormHelperText error>{error}</FormHelperText>}
    </Stack>
  );
}
