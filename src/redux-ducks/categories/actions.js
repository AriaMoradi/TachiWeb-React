// @flow
import type { CategoryType } from "types";

// ================================================================================
// Fetch Categories
// ================================================================================

// Action Constants and Types
export const FETCH_REQUEST = "categories/FETCH_REQUEST";
type FETCH_REQUEST_TYPE = "categories/FETCH_REQUEST";

export const FETCH_SUCCESS = "categories/FETCH_SUCCESS";
type FETCH_SUCCESS_TYPE = "categories/FETCH_SUCCESS";

export const FETCH_FAILURE = "categories/FETCH_FAILURE";
type FETCH_FAILURE_TYPE = "categories/FETCH_FAILURE";

export const FETCH_CACHE = "categories/FETCH_CACHE";
type FETCH_CACHE_TYPE = "categories/FETCH_CACHE";

// Action Object Types
type FetchRequestAction = { type: FETCH_REQUEST_TYPE };

type FetchSuccessAction = {
  type: FETCH_SUCCESS_TYPE,
  categories: $ReadOnlyArray<CategoryType>
};

type FetchFailureAction = {
  type: FETCH_FAILURE_TYPE,
  errorMessage: string,
  meta: Object
};

type FetchCacheAction = { type: FETCH_CACHE_TYPE };

// ================================================================================
// Create a category
// ================================================================================

// Action Constants and Types
export const CREATE_REQUEST = "categories/CREATE_REQUEST";
type CREATE_REQUEST_TYPE = "categories/CREATE_REQUEST";

export const CREATE_SUCCESS = "categories/CREATE_SUCCESS";
type CREATE_SUCCESS_TYPE = "categories/CREATE_SUCCESS";

export const CREATE_FAILURE = "categories/CREATE_FAILURE";
type CREATE_FAILURE_TYPE = "categories/CREATE_FAILURE";

// Action Object Types
type CreateRequestAction = { type: CREATE_REQUEST_TYPE };

type CreateSuccessAction = {
  type: CREATE_SUCCESS_TYPE,
  newCategory: CategoryType
};

type CreateFailureAction = {
  type: CREATE_FAILURE_TYPE,
  errorMessage: string,
  meta: Object
};

// ================================================================================
// Save new category name to server
// ================================================================================

// Action Constants and Types
export const UPDATE_CATEGORY_NAME_REQUEST =
  "categories/UPDATE_CATEGORY_NAME_REQUEST";
type UPDATE_CATEGORY_NAME_REQUEST_TYPE =
  "categories/UPDATE_CATEGORY_NAME_REQUEST";

export const UPDATE_CATEGORY_NAME_SUCCESS =
  "categories/UPDATE_CATEGORY_NAME_SUCCESS";
type UPDATE_CATEGORY_NAME_SUCCESS_TYPE =
  "categories/UPDATE_CATEGORY_NAME_SUCCESS";

export const UPDATE_CATEGORY_NAME_FAILURE =
  "categories/UPDATE_CATEGORY_NAME_FAILURE";
type UPDATE_CATEGORY_NAME_FAILURE_TYPE =
  "categories/UPDATE_CATEGORY_NAME_FAILURE";

// Action Object Types
type UpdateCategoryNameRequestAction = {
  type: UPDATE_CATEGORY_NAME_REQUEST_TYPE,
  categoryId: number,
  name: string
};

type UpdateCategoryNameSuccessAction = {
  type: UPDATE_CATEGORY_NAME_SUCCESS_TYPE
};

type UpdateCategoryNameFailureAction = {
  type: UPDATE_CATEGORY_NAME_FAILURE_TYPE,
  errorMessage: string,
  meta: Object
};

// ================================================================================
// etc
// ================================================================================
export const CHANGE_CURRENT_CATEGORY_ID =
  "categories/CHANGE_CURRENT_CATEGORY_ID";
type CHANGE_CURRENT_CATEGORY_ID_TYPE = "categories/CHANGE_CURRENT_CATEGORY_ID";

export type ChangeCurrentCategoryIdAction = {
  type: CHANGE_CURRENT_CATEGORY_ID_TYPE,
  categoryId: ?number
};

// ================================================================================
// Consolidated Action Type
// ================================================================================
export type CategoriesAction =
  | FetchRequestAction
  | FetchSuccessAction
  | FetchFailureAction
  | FetchCacheAction
  | CreateRequestAction
  | CreateSuccessAction
  | CreateFailureAction
  | UpdateCategoryNameRequestAction
  | UpdateCategoryNameSuccessAction
  | UpdateCategoryNameFailureAction
  | ChangeCurrentCategoryIdAction;
