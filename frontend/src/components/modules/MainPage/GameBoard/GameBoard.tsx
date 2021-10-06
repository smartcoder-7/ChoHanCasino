import {
  Box,
  Button,
  createStyles,
  FormHelperText,
  makeStyles,
  Paper,
  Theme,
} from '@material-ui/core';
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

export interface FormValues {
  amount: number;
  choice: number;
}

const initialState = {
  amount: 0,
  choice: 0,
};

interface Props {
  isAdmin: boolean;
  mininumBet: number;
  onBet: (values: FormValues) => void;
  onEndBet: () => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    buttonWrapper: {
      display: 'flex',
      justifyContent: 'space-around',
      margin: 'auto',
      width: '50%',
    },
    formLabel: {
      fontSize: theme.typography.h6.fontSize,
    },
    formWrapper: {
      display: 'flex',
      flexDirection: 'column',
      marginBottom: theme.spacing(3),
    },
    input: {
      maxWidth: 300,
    },
    radioWrapper: {
      marginBottom: theme.spacing(3),
      marginRight: theme.spacing(7),
    },
    root: {
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'column',
      paddingBottom: theme.spacing(4),
      paddingTop: theme.spacing(5),
    },
  }),
);

export default function GameBoard({ onBet, isAdmin, onEndBet }: Props) {
  const classes = useStyles();
  const [values, setValues] = useState<FormValues>(initialState);
  const [error, setError] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    error && setError('');
    setValues((old: FormValues) => ({
      ...old,
      [event.target.name as keyof FormValues]: +event.target.value,
    }));
  };

  const handleSubmit = () => {
    if (values.amount <= 0) {
      setError('Amount has to be greater than min amount');
      return;
    }
    onBet(values);
  };

  return (
    <Paper elevation={1} className={classes.root}>
      <Box className={classes.formWrapper} px={10}>
        <FormControl component="fieldset" className={classes.radioWrapper}>
          <FormLabel
            component="legend"
            color="primary"
            className={classes.formLabel}
          >
            Your choice:
          </FormLabel>
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
          <FormLabel
            component="legend"
            color="primary"
            className={classes.formLabel}
          >
            Wager (ETH)
          </FormLabel>
          <Input
            placeholder="Input the amount"
            type="number"
            name="amount"
            onChange={handleChange}
            value={values.amount}
            required
            className={classes.input}
          />
          {error && <FormHelperText error>{error}</FormHelperText>}
        </FormControl>
      </Box>
      <Box className={classes.buttonWrapper}>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Bet
        </Button>
        {isAdmin && (
          <Button onClick={onEndBet} variant="contained" color="secondary">
            End bet
          </Button>
        )}
      </Box>
    </Paper>
  );
}
