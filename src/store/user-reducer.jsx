import { db } from '../firebase';
import {
  ref,
  set,
  update,
  remove,
  get,
  child,
  push,
  onValue,
} from 'firebase/database';
import { v4 as uuid } from 'uuid';

export const initialState = {
  users: [],
  loading: false,
  error: null,
};

// -------- Actions Types ----------//
const SET_USERS = 'user/SET_USERS';
const ADD_USER = 'user/ADD_USER';
const UPDATE_USER = 'user/UPDATE_USER';
const DELETE_USER = 'user/DELETE_USER';
const SET_ERROR = 'user/SET_ERROR';
const SET_LOADING = 'user/SET_LOADING';

// -------- Reducer ----------//
export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USERS:
      return {
        ...state,
        users: action.payload,
      };
    case ADD_USER:
      return {
        ...state,
        users: [...state.users, action.payload],
      };
    case UPDATE_USER:
      return {
        ...state,
        users: state.users.map((u) =>
          u.id === action.payload.id ? action.payload : u
        ),
      };
    case DELETE_USER:
      return {
        ...state,
        users: state.users.filter((u) => u.id !== action.payload.userId),
      };
    case SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case SET_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

// -------- Actions Creators ----------//
export const setUserAction = (users) => ({ type: SET_USERS, payload: users });

export const addUserAction = (user) => ({ type: ADD_USER, payload: user });

export const updateUserAction = (user) => ({
  type: UPDATE_USER,
  payload: user,
});

export const deleteUserAction = (userId) => ({
  type: DELETE_USER,
  payload: { userId },
});

export const setErrorAction = (error) => ({
  type: SET_ERROR,
  payload: error,
});

export const setLoadingAction = (loading) => ({
  type: SET_LOADING,
  payload: loading,
});

// -------- Thunks ----------//
export const subscribeToUsersRealtimeFr = () => (dispatch) => {
  const dbRef = ref(db, 'users');
  return onValue(dbRef, (snapshot) => {
    const data = snapshot.val() || {};
    const users = Object.entries(data).map(([key, value]) => ({
      id: key,
      ...value,
    }));
    dispatch(setUserAction(users));
  });
};

export const saveUserFr = (user) => async (dispatch) => {
  try {
    const id = uuid();
    const newUser = { ...user, id, workingHours: {} };
    await set(ref(db, `users/${id}`), newUser);
  } catch (error) {
    dispatch(setErrorAction(error.message));
  }
};

export const updateUserFr = (user) => async (dispatch) => {
  try {
    await update(ref(db, `users/${user.id}`, user));
    dispatch(updateUserAction(user));
  } catch (error) {
    dispatch(setErrorAction(error.message));
  }
};

export const deleteUserFr = (userId) => async (dispatch) => {
  try {
    await remove(ref(db, `users/${userId}`));
    dispatch(deleteUserAction(userId));
  } catch (error) {
    dispatch(setErrorAction(error.message));
  }
};

export const saveUserHoursFr =
  ({ userId, hour }) =>
  async (dispatch) => {
    try {
      const newHour = { ...hour, id: uuid() };
      const newRef = push(ref(db, `users/${userId}/workingHours`));

      await set(newRef, newHour);
    } catch (error) {
      dispatch(setErrorAction(error.message));
    }
  };

export const updateWorkHourInFr =
  ({ userId, hourId, updatedHour }) =>
  async (dispatch) => {
    try {
      await set(ref(db, `users/${userId}/workingHours/${hourId}`), updatedHour);
    } catch (error) {
      dispatch(setErrorAction(error.message));
    }
  };

export const deleteWorkHourFromFr =
  ({ userId, hourId }) =>
  async (dispatch) => {
    try {
      await remove(ref(db, `users/${userId}/workingHours/${hourId}`));
    } catch (err) {
      dispatch(setErrorAction(err.message));
    }
  };
