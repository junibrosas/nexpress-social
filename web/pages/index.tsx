import React, { Component } from 'react'
import { Card, CardContent, CardMedia, withStyles, Typography, Grid } from '@material-ui/core';
import { AuthHelper } from 'src/helpers/auth.helper';
import { Page } from 'src/components/Page';

interface IProps {
  classes: any;
}

interface IState {
  defaultPage: boolean;
}

const styles = theme => ({
  root: {
    flexGrow: 1,
    margin: 30,
  },
  card: {
    maxWidth: 600,
    margin: 'auto',
    marginTop: theme.spacing.unit * 5
  },
  title: {
    padding: `${theme.spacing.unit * 3}px ${theme.spacing.unit * 2.5}px ${theme.spacing.unit * 2}px`,
    color: theme.palette.text.secondary
  },
  media: {
    minHeight: 330
  }
})

class Home extends Component<IProps, IState> {
  constructor(props) {
    super(props);

    this.state = {
      defaultPage: true
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <Page>
        <div className={classes.root}>
          {this.state.defaultPage &&
            <Grid container spacing={24}>
              <Grid item xs={12}>
                <Card className={classes.card}>
                  <Typography variant="headline" component="h2" className={classes.title}>
                    Home Page
                </Typography>
                  <CardMedia className={classes.media} image={"/static/images/seashell.jpg"} title="Unicorn Shells" />
                  <CardContent>
                    <Typography variant="body1" component="p">
                      Welcome to the MERN Social home page.
                  </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          }
          
        </div>
      </Page>
    )
  }

  componentWillReceiveProps = () => {
    this.init()
  }

  componentDidMount = () => {
    this.init()
  }

  init = () => {
    if (AuthHelper.isAuthenticated()) {
      this.setState({ defaultPage: false })
    } else {
      this.setState({ defaultPage: true })
    }
  }
}

export default withStyles(styles)(Home);
