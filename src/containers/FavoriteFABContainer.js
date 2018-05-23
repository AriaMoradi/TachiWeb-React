// @flow
import { connect } from 'react-redux';
import FavoriteFAB from 'components/FavoriteFAB';
import { createLoadingSelector } from 'redux-ducks/loading';
import { toggleFavorite, TOGGLE_FAVORITE } from 'redux-ducks/mangaInfos';

const favoriteIsToggling: Function = createLoadingSelector([TOGGLE_FAVORITE]);

type Params = {
  mangaId: number,
};

type StateToProps = {
  isFavorite: boolean,
  favoriteIsToggling: boolean,
};

const mapStateToProps = (state: Object, ownProps: Params): StateToProps => ({
  isFavorite: getIsFavorite(state.mangaInfos, ownProps.mangaId),
  favoriteIsToggling: favoriteIsToggling(state),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  toggleFavorite: isFavorite => () => {
    const { mangaId } = ownProps;
    if (!mangaId) return () => null;

    return dispatch(toggleFavorite(mangaId, isFavorite));
  },
});

// Helper Functions
function getIsFavorite(mangaInfos, mangaId) {
  if (!mangaId) return false;

  const mangaInfo = mangaInfos[mangaId];
  return mangaInfo.favorite;
}

export default connect(mapStateToProps, mapDispatchToProps)(FavoriteFAB);
