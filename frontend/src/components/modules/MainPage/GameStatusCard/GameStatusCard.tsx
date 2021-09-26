import { Card, CardContent, CardHeader, Typography } from '@material-ui/core';

export default function GameStatusCard() {
  return (
    <Card>
      <Card>
        <CardHeader
          title={
            <Typography variant="body2" color="textSecondary" component="p">
              Game Status
            </Typography>
          }
        />
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
            Lizards are a widespread group of squamate reptiles, with over 6,000
            species, ranging across all continents except Antarctica
          </Typography>
        </CardContent>
      </Card>
    </Card>
  );
}
