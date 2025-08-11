// src/store/user-thunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
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
import { setUsersFromRealtime } from './user-slice';

export const subscribeToUsersRealtime = () => (dispatch) => {
  const dbRef = ref(db, 'users');

  return onValue(dbRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const users = Object.entries(data).map(([key, value]) => ({
        id: key,
        ...value,
      }));
      dispatch(setUsersFromRealtime(users));
    } else {
      dispatch(setUsersFromRealtime([]));
    }
  });
};

// Получение всех пользователей
export const fetchUsers = createAsyncThunk(
  'user/fetchUsers',
  async (_, thunkAPI) => {
    try {
      const dbRef = ref(db);
      const snapshot = await get(child(dbRef, 'users'));
      if (!snapshot.exists()) return [];

      const data = snapshot.val();

      // Формируем массив с id из ключей
      const users = Object.entries(data).map(([key, value]) => ({
        id: key,
        ...value,
      }));

      return users;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Добавление нового пользователя
export const saveUser = createAsyncThunk(
  'user/saveUser',
  async (user, thunkAPI) => {
    try {
      const id = uuid();
      const newUser = { ...user, id, workingHours: [] };
      await set(ref(db, `users/${id}`), newUser);
      console.log('[saveUser] User saved');
      return null;
    } catch (error) {
      console.error('[saveUser ERROR]', error);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Обновление пользователя
export const updateUserInFirebase = createAsyncThunk(
  'user/updateUser',
  async (user, thunkAPI) => {
    try {
      await update(ref(db, `users/${user.id}`), user);
      return user;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Удаление пользователя
export const deleteUserFromFirebase = createAsyncThunk(
  'user/deleteUser',
  async (id, thunkAPI) => {
    try {
      await remove(ref(db, `users/${id}`));
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Добавление рабочих часов
export const saveWorkHour = createAsyncThunk(
  'user/saveWorkHour',
  async ({ userId, hour }, thunkAPI) => {
    try {
      const newHour = { ...hour, id: uuid() };
      const userRef = ref(db, `users/${userId}/workingHours`);
      const newRef = push(userRef);
      await set(newRef, newHour);
      return null;
    } catch (error) {
      console.error('[saveWorkHour ERROR]', error);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Обновление рабочего часа
export const updateWorkHourInFirebase = createAsyncThunk(
  'user/updateWorkHour',
  async ({ userId, hourId, updatedHour }, thunkAPI) => {
    try {
      await set(ref(db, `users/${userId}/workingHours/${hourId}`), updatedHour);
      return null;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Удаление рабочего часа
export const deleteWorkHourFromFirebase = createAsyncThunk(
  'user/deleteWorkHour',
  async ({ userId, hourId }, thunkAPI) => {
    try {
      await remove(ref(db, `users/${userId}/workingHours/${hourId}`));
      return null;
    } catch (error) {
      console.error('[deleteWorkHour ERROR]', error);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
