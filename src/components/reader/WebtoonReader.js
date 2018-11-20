// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import ResponsiveGrid from 'components/ResponsiveGrid';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import ImageWithLoader from 'components/reader/ImageWithLoader';
import type { ChapterType } from 'types';
import { Server, Client } from 'api';
import { withRouter } from 'react-router-dom';
import Link from 'components/Link';
import Waypoint from 'react-waypoint';
import { UrlPrefixConsumer } from 'components/UrlPrefixContext';
import ReaderOverlay from 'components/reader/ReaderOverlay';

// Waypoints that wrap around components require special code
// However, it automatically works with normal elements like <div>
// So I'm wrapping <ImageWithLoader> with <div>
// https://github.com/brigade/react-waypoint#children

// There's no built in way to get information on what element fired Waypoint onEnter/onLeave
// need to use anonymous functions to work around this
// https://github.com/brigade/react-waypoint/issues/160

// I'm using pagesToLoad to lazy load so I don't request every page from the server at once.
// It's currently using the same number of pages to load ahead as ImagePreloader.
// From my basic testing (looking at the console Network tab), they don't seem to be interfering.

// When you change chapter, the chapterId in the URL changes.
// This triggers the next page to render, THEN componentDidUpdate() runs.
// I'm using each image's source URL as a key to determine if it should start loading.
// I was previously just using the page #, but all the images were rendering
// before componentDidUpdate() could clear pagesToLoad.

// TODO: Might want to do custom <ScrollToTop /> behavior specifically for this reader
//       or create a custom scroll-to-top component that's customizable with whatever params passed

// FIXME: (at least in dev) there seems to be some lag when the URL changes
//        Also, a possibly related minor issue where spinners will reset when page changes
//
//        I believe these are related to the component updated on URL change
//        Should be fixable using shouldComponentUpdate()

// FIXME: weird bug that I happens like 10% of the time
//        When you jump to a page, it instead shows an adjacent image...
//        Really not sure why that's happening.

// FIXME: since we position new pages to the bottom of the viewport, you can see pages above
//        and it'll load those images. This loads more content and pushes the position of your
//        image lower than it was originally.
//
//        At the time of writing this, I felt like it's too much effort for a small benefit,
//        so I'm not working on this yet.

// TODO: have some sort of interaction where you go to the next chapter if you keep scrolling down
//       sort of similar to the idea of keyboard interactions, don't rely on mouse clicks

const styles = {
  page: {
    width: '100%',
  },
  navButtonsParent: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  topOffset: {
    marginTop: 144,
  },
};

type Props = {
  classes: Object, // styles

  // overlay specific props
  title: string,
  chapterNum: number,
  page: number,
  backUrl: string,

  // reader props
  mangaId: number,
  pageCount: number,
  chapter: ChapterType,
  nextChapterUrl: string,
  prevChapterUrl: string,

  // React router props
  match: Object,
  history: Object,

  // UrlPrefixConsumer prop
  urlPrefix: string,
};

type State = {
  pagesInView: Array<number>, // make sure to always keep this sorted
  pagesToLoad: Array<string>, // urls for the image, acts as a unique key
  jumpingToPage: ?number, // using to prevent loading skipped images when jumping pages
};

const numLoadAhead = 3;

class WebtoonReader extends Component<Props, State> {
  state = {
    pagesInView: [],
    pagesToLoad: [],
    jumpingToPage: null,
  };

  componentDidMount() {
    const { match } = this.props;
    const page = parseInt(match.params.page, 10);

    if (page === 0) {
      window.scrollTo(0, 0);
    } else {
      // If you're directly loading a specific page number, jump to it
      // NOTE: scrolling finished before waypoints are instantiated, so no events are triggered
      scrollToPage(parseInt(match.params.page, 10));
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // NOTE: not checking if the mangaId in the URL changed. Don't think this is a problem
    const { match } = this.props;
    const chapterChanged = match.params.chapterId !== prevProps.match.params.chapterId;

    if (chapterChanged) {
      this.resetForNewChapter();
    }

    // When pagesInView state is changed, check if URL should be updated
    this.updateUrlToCurrentPage(prevState);
  }

  resetForNewChapter = () => {
    window.scrollTo(0, 0);
    this.setState({ pagesInView: [], pagesToLoad: [], jumpingToPage: null });
  };

  updateUrlToCurrentPage = (prevState) => {
    // This is a helper function, call from componentDidUpdate()
    //
    // NOTE: It seems that if you rapidly scroll, page becomes undefined.
    //       Also, on hot-reload or debug mode reload, lastPage is undefined.
    //       This would cause an infinite loop when I wasn't checking if lastpage != null.
    const {
      urlPrefix, mangaId, chapter, history,
    } = this.props;
    const { pagesInView } = this.state;
    const { pagesInView: prevPagesInView } = prevState;

    const lastPage = pagesInView[pagesInView.length - 1];
    const prevLastPage = prevPagesInView[prevPagesInView.length - 1];

    if (lastPage != null && lastPage !== prevLastPage) {
      history.replace(Client.page(urlPrefix, mangaId, chapter.id, lastPage));
    }
  };

  handleJumpToPage = (newPage: number) => {
    this.setState({ jumpingToPage: newPage });
    scrollToPage(newPage); // TODO: might need to put this in setState callback function
  };

  handlePageEnter = (page) => {
    const { mangaId, chapter, pageCount } = this.props;

    this.setState((prevState) => {
      const newPagesInView = addAPageInView(prevState.pagesInView, page);
      const newPagesToLoad = addMorePagesToLoad(
        mangaId,
        chapter.id,
        numLoadAhead,
        pageCount,
        newPagesInView,
        prevState.pagesToLoad,
      );

      // This assumes that scrollToPage() always tries to put the target image at the top
      // and that handleScrollToBottom() handles things when scrollToPage() can't do that
      const isJumping = prevState.jumpingToPage !== null;
      const targetPageIsOnTop = newPagesInView[0] === prevState.jumpingToPage;

      if (isJumping && !targetPageIsOnTop) {
        return {};
      } else if (isJumping && targetPageIsOnTop) {
        return {
          pagesInView: newPagesInView,
          pagesToLoad: newPagesToLoad,
          jumpingToPage: null,
        };
      }

      return {
        pagesInView: newPagesInView,
        pagesToLoad: newPagesToLoad,
      };
    });
  };

  handlePageLeave = (page) => {
    this.setState((prevState) => {
      const { pagesInView } = prevState;
      return {
        pagesInView: pagesInView.filter(pageInView => pageInView !== page),
      };
    });
  };

  handleScrollToBottom = () => {
    // Tells component to abort page jumping because it's hit the bottom of the page
    const { mangaId, chapter, pageCount } = this.props;

    this.setState((prevState) => {
      const newPagesToLoad = addMorePagesToLoad(
        mangaId,
        chapter.id,
        numLoadAhead,
        pageCount,
        prevState.pagesInView,
        prevState.pagesToLoad,
      );

      return {
        pagesToLoad: newPagesToLoad,
        jumpingToPage: null,
      };
    });
  };

  render() {
    const {
      classes,
      title,
      chapterNum,
      page,
      backUrl,
      mangaId,
      chapter,
      pageCount,
      nextChapterUrl,
      prevChapterUrl,
    } = this.props;
    const { pagesToLoad } = this.state;

    const sources = createImageSrcArray(mangaId, chapter.id, pageCount);

    return (
      <React.Fragment>
        <ReaderOverlay
          title={title}
          chapterNum={chapterNum}
          pageCount={pageCount}
          page={page}
          backUrl={backUrl}
          prevChapterUrl={prevChapterUrl}
          nextChapterUrl={nextChapterUrl}
          onJumpToPage={this.handleJumpToPage}
        />

        <ResponsiveGrid spacing={0} className={classes.topOffset}>
          {sources.map((source, index) => (
            <Grid item xs={12} key={source} id={index}>
              <Waypoint
                onEnter={() => this.handlePageEnter(index)}
                onLeave={() => this.handlePageLeave(index)}
              >
                <div> {/* Refer to notes on Waypoint above for why this <div> is necessary */}
                  <ImageWithLoader
                    src={pagesToLoad.includes(source) ? source : null}
                    className={classes.page}
                    alt={`${chapter.name} - Page ${index + 1}`}
                  />
                </div>
              </Waypoint>
            </Grid>
          ))}

          <Grid item xs={12} className={classes.navButtonsParent}>
            <Button component={Link} to={prevChapterUrl} disabled={!prevChapterUrl}>
              <Icon>navigate_before</Icon>
              Previous Chapter
            </Button>
            <Button component={Link} to={nextChapterUrl} disabled={!nextChapterUrl}>
              Next Chapter
              <Icon>navigate_next</Icon>
            </Button>
          </Grid>
        </ResponsiveGrid>

        <Waypoint onEnter={this.handleScrollToBottom} />
      </React.Fragment>
    );
  }
}

// Helper functions
function createImageSrcArray(mangaId, chapterId, pageCount) {
  const sources = [];
  for (let page = 0; page < pageCount; page += 1) {
    sources.push(Server.image(mangaId, chapterId, page));
  }
  return sources;
}

function addAPageInView(oldPagesInView, newPage) {
  const pagesCopy = oldPagesInView.slice();
  pagesCopy.push(newPage);
  return pagesCopy.sort();
}

// Adds the next img sources to load to the current array of img sources to load
function addMorePagesToLoad(mangaId, chapterId, numLoadAhead, pageCount, pagesInView, oldArray) {
  if (!pagesInView.length) return oldArray; // pages can sometimes be empty if scrolling too fast

  const newPages = [];
  for (let i = 0; i < numLoadAhead + pagesInView.length; i += 1) {
    // includes the current pages just to be safe
    if (pagesInView[0] + i < pageCount) {
      newPages.push(Server.image(mangaId, chapterId, pagesInView[0] + i));
    }
  }

  const arrayCopy = oldArray.slice();
  arrayCopy.push(...newPages);

  return [...new Set(arrayCopy)]; // unique values only
}

function scrollToPage(pageNum: number) {
  // If an image's height is less than the vh, scrolling to it will cause the subsequent page
  // to be the page-in-view (which will also update the URL)
  // This will also make the ReaderOverlay current page jump to the next page
  //
  // However, this is intentional so that jumping to a page be consistent and predictable.
  // This guarantees that you will load the target image and no image before it
  // (unless you hit the bottom of the page)

  const page = document.getElementById(pageNum.toString()); // this is the <Grid> wrapping element
  if (!page) return;

  window.scrollTo(0, page.offsetTop);
}

// Using UrlPrefixConsumer to get the urlPrefix needed to build urls
const WebtoonReaderWithContext = props => (
  <UrlPrefixConsumer>
    {urlPrefix => <WebtoonReader {...props} urlPrefix={urlPrefix} />}
  </UrlPrefixConsumer>
);

export default withRouter(withStyles(styles)(WebtoonReaderWithContext));
