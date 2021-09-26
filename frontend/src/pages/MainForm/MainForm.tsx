import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { FormEvent, useState } from 'react';

import Input from '../../components/global/Input';
import CardPage from '../../containers/layout/CardPage';
import { FIELDS } from './MainForm.constant';

interface FormValues {
  [FIELDS.ETH_ADDRESS]: string;
  [FIELDS.USER_DID]: string;
  [FIELDS.FACEBOOK_ID]: string;
  [FIELDS.TWITTER_HANDLE]: string;
}

const initialState = {
  [FIELDS.ETH_ADDRESS]: '',
  [FIELDS.USER_DID]: '',
  [FIELDS.FACEBOOK_ID]: '',
  [FIELDS.TWITTER_HANDLE]: '',
};

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));

function MainForm() {
  const [formValues, setFormValues] = useState<FormValues>(initialState);
  const classes = useStyles();
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    console.info('==>', formValues);
  };

  const handleSetFormFieldValue = (fieldName: string) => (value: string) => {
    setFormValues({
      ...formValues,
      [fieldName]: value,
    });
  };

  return (
    <div>
      <CardPage title="Post User Data">
        <form className={classes.root} autoComplete="off">
          <Input
            id="userDID"
            label="User DID"
            value={formValues[FIELDS.USER_DID]}
            onChange={handleSetFormFieldValue(FIELDS.USER_DID)}
            error="error"
          />
          <Input
            id="ethAddress"
            label="Eth address"
            value={formValues[FIELDS.ETH_ADDRESS]}
            onChange={handleSetFormFieldValue(FIELDS.ETH_ADDRESS)}
            error="error"
          />
          <Input
            id="facebookId"
            label="Facebook Id"
            value={formValues[FIELDS.FACEBOOK_ID]}
            onChange={handleSetFormFieldValue(FIELDS.FACEBOOK_ID)}
            error="error"
          />
          <Input
            id="twitterHandle"
            label="Twitter Handle"
            value={formValues[FIELDS.TWITTER_HANDLE]}
            onChange={handleSetFormFieldValue(FIELDS.TWITTER_HANDLE)}
            error="error"
          />
          <div>
            <Button type="submit" onClick={handleSubmit}>
              Submit
            </Button>
          </div>
        </form>
      </CardPage>
    </div>
  );
}

export default MainForm;
