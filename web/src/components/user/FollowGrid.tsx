import React from 'react';
import { GridList, GridListTile, Avatar, Typography } from '@material-ui/core';
import Link from 'next/link';
import { UserApiService } from 'src/services/userapi.service';
import { makeStyles } from '@material-ui/core/styles';

type ComponentProps = {
  people: any;
};

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(2),
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    background: theme.palette.background.paper,
  },
  bigAvatar: {
    width: 60,
    height: 60,
    margin: 'auto',
  },
  gridList: {
    width: 500,
    height: 220,
  },
  tileText: {
    textAlign: 'center',
    marginTop: 10,
  },
}));

const FollowGrid = (props: ComponentProps) => {
  const classes = useStyles();
  const { people } = props;

  return (
    <div className={classes.root}>
      <GridList cellHeight={160} className={classes.gridList} cols={4}>
        {people.map((person, i) => {
          return (
            <GridListTile style={{ height: 120 }} key={i}>
              <Link href={'/profile/' + person._id}>
                <React.Fragment>
                  <Avatar
                    src={UserApiService.getPhotoUrl(person._id)}
                    className={classes.bigAvatar}
                  />
                  <Typography className={classes.tileText}>
                    {person.name}
                  </Typography>
                </React.Fragment>
              </Link>
            </GridListTile>
          );
        })}
      </GridList>
    </div>
  );
};

export default FollowGrid;
