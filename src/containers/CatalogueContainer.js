import { connect } from 'react-redux';
import { fetchSources } from 'redux-ducks/sources';
import {
  fetchCatalogue,
  fetchNextCataloguePage,
  FETCH_CATALOGUE,
  CATALOGUE_ADD_PAGE,
} from 'redux-ducks/catalogue';
import { fetchChapters, updateChapters } from 'redux-ducks/chapters';
import { fetchFilters } from 'redux-ducks/filters';
import {
  toggleFavorite,
  fetchMangaInfo,
  updateMangaInfo,
  TOGGLE_FAVORITE,
} from 'redux-ducks/mangaInfos';
import Catalogue from 'pages/Catalogue';
import { createLoadingSelector } from 'redux-ducks/loading';

const catalogueIsLoading = createLoadingSelector([FETCH_CATALOGUE]);
const addPageIsLoading = createLoadingSelector([CATALOGUE_ADD_PAGE]);
const favoriteIsToggling = createLoadingSelector([TOGGLE_FAVORITE]);

const mapStateToProps = (state) => {
  const { mangaIds, hasNextPage } = state.catalogue;
  const mangaLibrary = mangaToShow(state.mangaInfos, mangaIds);

  return {
    // Sources props
    sources: state.sources,
    // Catalogue props
    hasNextPage,
    // Chapter props
    chaptersByMangaId: state.chapters,
    // Library props
    mangaLibrary,
    // Filter props
    initialFilters: state.filters,
    // Fetching props
    catalogueIsLoading: catalogueIsLoading(state),
    addPageIsLoading: addPageIsLoading(state),
    favoriteIsToggling: favoriteIsToggling(state),
  };
};

const mapDispatchToProps = dispatch => ({
  fetchSources: () => dispatch(fetchSources()),
  // Passing in the new catalogue search settings
  fetchCatalogue: (sourceId, query, filters, retainFilters) =>
    dispatch(fetchCatalogue(sourceId, query, filters, retainFilters)),
  fetchFilters: sourceId => dispatch(fetchFilters(sourceId)),
  fetchChapters: mangaId => dispatch(fetchChapters(mangaId)),
  // Need a nested function to pass in mangaId in the JSX
  toggleFavoriteForManga: (mangaId, isFavorite) => () =>
    dispatch(toggleFavorite(mangaId, isFavorite)),
  fetchNextCataloguePage: (sourceId, query, filters) =>
    dispatch(fetchNextCataloguePage(sourceId, query, filters)),
  updateChapters: mangaId => dispatch(updateChapters(mangaId)),
  updateMangaInfo: mangaId => dispatch(updateMangaInfo(mangaId)),
  fetchMangaInfo: mangaId => dispatch(fetchMangaInfo(mangaId)),
});

// Helper functions
function mangaToShow(mangaLibrary, mangaIds) {
  return mangaIds.map(mangaId => mangaLibrary[mangaId]);
}

export default connect(mapStateToProps, mapDispatchToProps)(Catalogue);
