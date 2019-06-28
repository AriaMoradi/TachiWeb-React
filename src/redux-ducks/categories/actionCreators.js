// @flow
import { Server } from "api";
import type { ThunkAction } from "redux-ducks/reducers";
import format from "date-fns/format";
import { selectCategoriesIsLoaded, selectDefaultCategoryHasManga } from ".";
import {
  FETCH_REQUEST,
  FETCH_SUCCESS,
  FETCH_FAILURE,
  FETCH_CACHE,
  CREATE_REQUEST,
  CREATE_SUCCESS,
  CREATE_FAILURE,
  DELETE_REQUEST,
  DELETE_SUCCESS,
  DELETE_FAILURE,
  UPDATE_CATEGORY_NAME_REQUEST,
  UPDATE_CATEGORY_NAME_SUCCESS,
  UPDATE_CATEGORY_NAME_FAILURE,
  CHANGE_CURRENT_CATEGORY_ID,
  type ChangeCurrentCategoryIdAction
} from "./actions";

// ================================================================================
// Action Creators
// ================================================================================

export function changeCurrentCategoryId(
  categoryId: ?number
): ChangeCurrentCategoryIdAction {
  return { type: CHANGE_CURRENT_CATEGORY_ID, categoryId };
}

export function fetchCategories(): ThunkAction {
  return async (dispatch, getState) => {
    if (selectCategoriesIsLoaded(getState())) {
      dispatch({ type: FETCH_CACHE });
      return;
    }

    dispatch({ type: FETCH_REQUEST });

    try {
      const categories = await Server.api().getCategories();
      dispatch({ type: FETCH_SUCCESS, categories });

      // SIDE EFFECT
      if (!selectDefaultCategoryHasManga(getState())) {
        dispatch(changeCurrentCategoryId(categories[0].id));
      }
      // -----------
    } catch (error) {
      dispatch({
        type: FETCH_FAILURE,
        errorMessage: "Failed to find your library categories.",
        meta: { error }
      });
    }
  };
}

export function createCategory(): ThunkAction {
  return async dispatch => {
    dispatch({ type: CREATE_REQUEST });

    const name = `New Category ${format(new Date(), "MM-DD HH:mm:ss")}`;

    try {
      const newCategory = await Server.api().createCategory({ name });
      dispatch({ type: CREATE_SUCCESS, newCategory });
    } catch (error) {
      dispatch({
        type: CREATE_FAILURE,
        errorMessage: "Failed to create a new category.",
        meta: { error }
      });
    }
  };
}

export function deleteCategory(categoryId: number): ThunkAction {
  return async dispatch => {
    dispatch({ type: DELETE_REQUEST, categoryId });

    try {
      await Server.api().deleteCategory(categoryId);
      dispatch({ type: DELETE_SUCCESS });
    } catch (error) {
      dispatch({
        type: DELETE_FAILURE,
        errorMessage: "Failed to delete category.",
        meta: { error }
      });
    }
  };
}

export function updateCategoryName(
  categoryId: number,
  name: string
): ThunkAction {
  return async dispatch => {
    dispatch({ type: UPDATE_CATEGORY_NAME_REQUEST, categoryId, name });

    try {
      await Server.api().editCategory(categoryId, { name });
      dispatch({ type: UPDATE_CATEGORY_NAME_SUCCESS });
    } catch (error) {
      dispatch({
        type: UPDATE_CATEGORY_NAME_FAILURE,
        errorMessage: "Failed to update the category name.",
        meta: { error }
      });
    }
  };
}
