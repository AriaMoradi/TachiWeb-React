import React from 'react';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';

// FAB button position based on this link
// https://stackoverflow.com/questions/37760448/how-to-make-floating-action-button-content-overlap-two-divs-in-materializecss

// NOTE: parent must be [position: relative] for this to position correctly.
// for example:
// const styles = () => ({
//   fabParent: {
//     position: 'relative',
//   },
// });

const styles = () => ({
  fab: {
    position: 'absolute',
    bottom: 0,
    right: '5%',
    marginBottom: -28,
  },
});

const FAB = ({ classes, children, onClick }) => (
  <Button variant="fab" color="primary" className={classes.fab} onClick={onClick}>
    {children}
  </Button>
);

export default withStyles(styles)(FAB);