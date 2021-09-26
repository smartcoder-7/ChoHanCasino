import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  elevation?: number;
  title: string;
}

export default function CardPage({ title, elevation = 1, children }: Props) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignSelf="center"
      justifySelf="center"
      p={3}
    >
      <Typography variant="h4" gutterBottom>
        {title}
      </Typography>
      <Paper elevation={elevation}>{children}</Paper>
    </Box>
  );
}
