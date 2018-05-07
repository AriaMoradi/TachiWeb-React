import React from 'react';
import { ListItem } from 'material-ui/List';
import Moment from 'moment';
import Grid from 'material-ui/Grid';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import classNames from 'classnames';
import { Client } from 'api';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { chapterType, mangaType } from 'types';

// TODO: add additional actions such as mark as read/unread.
// TODO: align the bottom row text? It's a little off horizontally right now.

const styles = () => ({
  read: {
    color: '#AAA',
  },
});

const chapterText = (read, last_page_read) => {
  let text = '';
  if (!read && last_page_read > 0) {
    text = `Page ${last_page_read + 1}`;
  }
  return text;
};

const ChapterListItem = ({ classes, mangaInfo, chapter }) => {
  const dimIfRead = read => classNames({ [classes.read]: read });
  const goToPage = chapter.read ? 0 : chapter.last_page_read;

  return (
    <ListItem button divider component={Link} to={Client.page(mangaInfo.id, chapter.id, goToPage)}>
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="subheading" className={dimIfRead(chapter.read)}>
            {chapter.name}
          </Typography>
        </Grid>
        <Grid item style={{ flex: 1 }}>
          <Typography variant="caption" className={dimIfRead(chapter.read)}>
            {Moment(chapter.date).format('L')}
          </Typography>
        </Grid>
        <Grid item>
          <Typography>{chapterText(chapter.read, chapter.last_page_read)}</Typography>
        </Grid>
      </Grid>
    </ListItem>
  );
};

ChapterListItem.propTypes = {
  classes: PropTypes.object.isRequired,
  mangaInfo: mangaType.isRequired,
  chapter: chapterType.isRequired,
};

export default withStyles(styles)(ChapterListItem);
