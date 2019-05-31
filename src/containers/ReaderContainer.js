// @flow
import { connect } from "react-redux";
import { selectMangaInfo, fetchMangaInfo } from "redux-ducks/mangaInfos";
import {
  selectChaptersForManga,
  selectChapter,
  selectNextChapterId,
  selectPrevChapterId,
  fetchChapters
} from "redux-ducks/chapters";
import {
  selectPageCounts,
  selectPageCount,
  fetchPageCount
} from "redux-ducks/pageCounts";
import { selectDefaultViewer } from "redux-ducks/settings";
import type { DefaultViewer } from "redux-ducks/settings";
import Reader from "pages/Reader";
import type { MangaType, ChapterType } from "types";

type StateToProps = {
  // [Written 5/10/2019] this setting could be missing from the prefs object
  // also, there is no typing for prefs currently, so manually typing this
  defaultViewer: DefaultViewer,

  mangaInfo: ?MangaType,
  chapters: Array<ChapterType>,
  chapter: ?ChapterType,
  chapterId: number, // never null because it's pulled from the URL
  pageCounts: { +[chapterId: number]: number },
  pageCount: number,
  page: number, // never null because it's pulled from the URL
  prevChapterId: ?number,
  nextChapterId: ?number
};

const mapStateToProps = (state, ownProps): StateToProps => {
  const mangaId = parseInt(ownProps.match.params.mangaId, 10);
  const chapterId = parseInt(ownProps.match.params.chapterId, 10);
  const page = parseInt(ownProps.match.params.page, 10);

  return {
    defaultViewer: selectDefaultViewer(state),

    mangaInfo: selectMangaInfo(state, mangaId),
    chapters: selectChaptersForManga(state, mangaId),
    chapter: selectChapter(state, mangaId, chapterId),
    chapterId,
    pageCounts: selectPageCounts(state),
    pageCount: selectPageCount(state, chapterId) || 0, // FIXME: inefficient redux design?
    page,
    prevChapterId: selectPrevChapterId(state, mangaId, chapterId),
    nextChapterId: selectNextChapterId(state, mangaId, chapterId)
  };
};

type DispatchToProps = {
  fetchMangaInfo: Function,
  fetchChapters: Function,
  fetchPageCount: Function
};

const mapDispatchToProps = (dispatch, ownProps): DispatchToProps => {
  const { mangaId } = ownProps.match.params;

  return {
    fetchMangaInfo: () => dispatch(fetchMangaInfo(mangaId)),
    fetchChapters: () => dispatch(fetchChapters(mangaId)),
    fetchPageCount: chapterId => dispatch(fetchPageCount(mangaId, chapterId))
  };
};

export type ReaderContainerProps = StateToProps & DispatchToProps;
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Reader);
