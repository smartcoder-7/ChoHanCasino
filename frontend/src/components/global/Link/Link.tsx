import { makeStyles } from '@material-ui/core/styles';
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

const useStyles = makeStyles(() => ({
  root: {
    textDecoration: 'none',
    color: 'inherit',
  },
}));

interface Props {
  children: ReactNode;
  to: string;
}

function CustomLink({ to, children, ...rest }: Props) {
  const classes = useStyles();

  return (
    <Link to={to} {...rest} className={classes.root}>
      {children}
    </Link>
  );
}

export default CustomLink;
