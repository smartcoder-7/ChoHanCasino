import {
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
} from '@material-ui/core';
import React, { ChangeEvent } from 'react';

interface Props {
  error: string;
  id: string;
  label?: string;
  onChange: (field: string) => void;
  value: string;
}

function CustomInput({ id, label, value, error, onChange }: Props) {
  const handleOnChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { value } = event.target;
    onChange(value);
  };

  return (
    <FormControl>
      {label && <InputLabel htmlFor={id}>{label}</InputLabel>}
      <Input id={id} value={value} onChange={handleOnChange} />
      <FormHelperText id={id}>{error}</FormHelperText>
    </FormControl>
  );
}

export default CustomInput;
