// src/store/user-slice.js
import { createSlice } from '@reduxjs/toolkit';
import {
  fetchUsers,
  saveUser,
  updateUserInFirebase,
  deleteUserFromFirebase,
  saveWorkHour,
  updateWorkHourInFirebase,
  deleteWorkHourFromFirebase,
} from './user-thunks';

const initialState = {
  users: [],
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      // Загрузка всех пользователей
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Добавление пользователя
      .addCase(saveUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })

      // Обновление пользователя
      .addCase(updateUserInFirebase.fulfilled, (state, action) => {
        state.users = state.users.map((u) =>
          u.id === action.payload.id ? action.payload : u
        );
      })

      // Удаление пользователя
      .addCase(deleteUserFromFirebase.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u.id !== action.payload);
      })

      // ✅ Добавление часов
      .addCase(saveWorkHour.fulfilled, (state, action) => {
        const { userId, newHour } = action.payload;
        const user = state.users.find((u) => u.id === userId);
        if (user) {
          if (!user.workingHours) {
            user.workingHours = {};
          }
          user.workingHours[newHour.id] = newHour;
        }
      })

      // ✅ Обновление часов
      .addCase(updateWorkHourInFirebase.fulfilled, (state, action) => {
        const { userId, hourId, updatedHour } = action.payload;
        const user = state.users.find((u) => u.id === userId);
        if (user && user.workingHours && user.workingHours[hourId]) {
          user.workingHours[hourId] = updatedHour;
        }
      })

      // ✅ Удаление часов

      // user-slice.js

      .addCase(deleteWorkHourFromFirebase.fulfilled, (state, action) => {
        const { userId, hourId } = action.payload;
        const user = state.users.find((u) => u.id === userId);
        if (user && user.workingHours && user.workingHours[hourId]) {
          delete user.workingHours[hourId];
        }
      });
  },
});

export default userSlice.reducer;
