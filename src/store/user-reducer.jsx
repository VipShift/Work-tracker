// src/store/user-reducer.jsx

import { db, auth } from '../firebase';
import { ref, set, update, remove, push, onValue } from 'firebase/database';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { v4 as uuid } from 'uuid';

// ----------------- Initial State -----------------
export const initialState = {
  users: [],
  loading: false,
  error: null,
};

// ----------------- Action Types -----------------
const SET_USERS = 'user/SET_USERS';
const ADD_USER = 'user/ADD_USER';
const UPDATE_USER = 'user/UPDATE_USER';
const DELETE_USER = 'user/DELETE_USER';
const SET_LOADING = 'user/SET_LOADING';
const SET_ERROR = 'user/SET_ERROR';

// ----------------- Reducer -----------------
export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USERS:
      return { ...state, users: action.payload };

    case ADD_USER:
      return { ...state, users: [...state.users, action.payload] };

    case UPDATE_USER:
      return {
        ...state,
        users: state.users.map((u) =>
          u.uid === action.payload.uid ? action.payload : u
        ),
      };

    case DELETE_USER:
      return {
        ...state,
        users: state.users.filter((u) => u.uid !== action.payload),
      };

    case SET_LOADING:
      return { ...state, loading: action.payload };

    case SET_ERROR:
      return { ...state, error: action.payload };

    default:
      return state;
  }
};

// ----------------- Action Creators -----------------
export const setUsersAction = (users) => ({ type: SET_USERS, payload: users });
export const addUserAction = (user) => ({ type: ADD_USER, payload: user });
export const updateUserAction = (user) => ({
  type: UPDATE_USER,
  payload: user,
});
export const deleteUserAction = (cardId) => ({
  type: DELETE_USER,
  payload: cardId,
});
export const setLoadingAction = (loading) => ({
  type: SET_LOADING,
  payload: loading,
});
export const setErrorAction = (error) => ({ type: SET_ERROR, payload: error });

// ----------------- Thunks -----------------
export const subscribeToUsersRealtime = () => (dispatch) => {
  const usersRef = ref(db, 'users');
  return onValue(usersRef, (snapshot) => {
    const data = snapshot.val() || {};
    const users = Object.entries(data).map(([uid, value]) => ({
      uid,
      ...value,
    }));
    dispatch(setUsersAction(users));
  });
};

export const saveUserFr = (user) => async (dispatch) => {
  try {
    const uid = user.uid || uuid();
    const newUser = { ...user, uid, workingHours: {}, email: user.email || '' };
    await set(ref(db, `users/${uid}`), newUser);
  } catch (error) {
    dispatch(setErrorAction(error.message));
  }
};

export const updateUserFr = (user) => async (dispatch) => {
  try {
    await update(ref(db, `users/${user.uid}`), user);
    dispatch(updateUserAction(user));
  } catch (error) {
    dispatch(setErrorAction(error.message));
  }
};

export const deleteUserFr =
  ({ uid, cardId }) =>
  async (dispatch) => {
    try {
      await remove(ref(db, `users/${uid}/cards/${cardId}`));
      dispatch(deleteUserAction(cardId));
    } catch (error) {
      dispatch(setErrorAction(error.message));
    }
  };

export const addUserHourFr =
  ({ uid, hour }) =>
  async (dispatch) => {
    try {
      const newHour = { ...hour, id: uuid() };
      const newRef = push(ref(db, `users/${uid}/workingHours`));
      await set(newRef, newHour);
    } catch (error) {
      dispatch(setErrorAction(error.message));
    }
  };

export const updateUserHourFr =
  ({ uid, hourId, updatedHour }) =>
  async (dispatch) => {
    try {
      await set(ref(db, `users/${uid}/workingHours/${hourId}`), updatedHour);
    } catch (error) {
      dispatch(setErrorAction(error.message));
    }
  };

export const deleteUserHourFr =
  ({ uid, cardId, hourId }) =>
  async (dispatch) => {
    try {
      await remove(
        ref(db, `users/${uid}/cards/${cardId}/workingHours/${hourId}`)
      );
    } catch (error) {
      dispatch(setErrorAction(error.message));
    }
  };

// ---------- Thunks for AUTH ----------

// Регистрация нового пользователя
export const registerUserFr =
  ({ email, password }) =>
  async (dispatch) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const uid = userCredential.user.uid;

      const newUser = { uid, email, workingHours: {} };
      await set(ref(db, `users/${uid}`), newUser);

      dispatch(addUserAction(newUser)); // добавляем в store
      return newUser; // чтобы можно было .then() в компоненте
    } catch (error) {
      dispatch(setErrorAction(error.message));
      throw error;
    }
  };

// Логин
export const loginUserFr =
  ({ email, password }) =>
  async (dispatch) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      return user;
    } catch (error) {
      dispatch(setErrorAction(error.message));
      throw error;
    }
  };

// Логаут
export const logoutUserFr = () => async (dispatch) => {
  try {
    await signOut(auth);
    dispatch(setUsersAction([])); // чистим список юзеров
  } catch (error) {
    dispatch(setErrorAction(error.message));
  }
};
