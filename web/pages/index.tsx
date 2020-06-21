import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  withStyles,
  Typography,
  Grid,
} from '@material-ui/core';
import { AuthHelper } from 'src/helpers/auth.helper';
import Page from 'src/components/common/Page';
import NewsFeed from 'src/components/post/NewsFeed';
import FindPeople from 'src/components/user/FindPeople';

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    margin: 30,
  },
  card: {
    maxWidth: 600,
    margin: 'auto',
    marginTop: theme.spacing(5),
  },
  title: {
    padding: `${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(
      2
    )}px`,
    color: theme.palette.text.secondary,
  },
  media: {
    minHeight: 330,
  },
});

type ComponentProps = {
  classes: any;
};

const Home = ({ classes }: ComponentProps) => {
  const [defaultPage, setDefaultPage] = React.useState(true);
  const isAuthenticated = AuthHelper.isAuthenticated();

  React.useEffect(() => {
    if (isAuthenticated) {
      setDefaultPage(false);
    } else {
      setDefaultPage(true);
    }
  }, [isAuthenticated]);

  return (
    <Page>
      <div className={classes.root}>
        {defaultPage && (
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Card className={classes.card}>
                <Typography variant='h2' className={classes.title}>
                  Get A Social Life
                </Typography>
                <CardMedia
                  className={classes.media}
                  image={'/public/images/people-connect.jpg'}
                  title='Unicorn Shells'
                />
                <CardContent>
                  <Typography variant='body1' component='p'>
                    Nexpress helps you connect and share with the people in your
                    life.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
        {!defaultPage && (
          <Grid container spacing={4}>
            <Grid item xs={8} sm={7}>
              <NewsFeed />
            </Grid>
            <Grid item xs={6} sm={5}>
              <FindPeople />
            </Grid>
          </Grid>
        )}
      </div>
    </Page>
  );
};

export default withStyles(styles)(Home);
