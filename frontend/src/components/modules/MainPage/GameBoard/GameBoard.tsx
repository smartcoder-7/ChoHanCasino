import { Box, Button, Paper } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Input from '@material-ui/core/Input';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import React, { useState } from 'react';

enum Option {
  ODD = 0,
  EVEN = 1,
}

interface FormValues {
  amount: number;
  choice: number;
}

const initialState = {
  amount: 0,
  choice: 0,
};

interface Props {
  onBet: (values: FormValues) => void;
}

export default function GameBoard({ onBet }: Props) {
  const [values, setValues] = useState<FormValues>(initialState);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues((old: FormValues) => ({
      ...old,
      [event.target.name as keyof FormValues]: +event.target.value,
    }));
  };

  const handleSubmit = () => {
    onBet(values);
  };

  return (
    <Paper elevation={1}>
      <Box>
        <FormControl component="fieldset">
          <FormLabel component="legend">Select your choice</FormLabel>
          <RadioGroup
            aria-label="choice"
            name="choice"
            value={values?.choice}
            onChange={handleChange}
          >
            <FormControlLabel
              value={Option.ODD}
              control={<Radio />}
              label="Odd"
            />
            <FormControlLabel
              value={Option.EVEN}
              control={<Radio />}
              label="Even"
            />
          </RadioGroup>
        </FormControl>
        <FormControl component="fieldset">
          <FormLabel component="legend">Input the amount to bet!</FormLabel>
          <Input
            placeholder="Input the amount"
            type="number"
            name="amount"
            onChange={handleChange}
            value={values.amount}
            required
          />
        </FormControl>
      </Box>
      <Box>
        <Button onClick={handleSubmit}>Bet!</Button>
      </Box>
    </Paper>
  );
}
