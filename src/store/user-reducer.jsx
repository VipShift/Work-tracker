import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuid } from 'uuid';

const initialState = {
  users: [
    { id: 1, name: 'Иван', age: 25, phone: '123-45-67', workingHours: [] },
    { id: 2, name: 'Анна', age: 30, phone: '123-45-98', workingHours: [] },
  ],
};

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_USER': {
      const newId = state.users.length
        ? Math.max(...state.users.map((u) => u.id)) + 1
        : 1;

      const newUsers = {
        id: newId,
        name: action.payload.name,
        age: action.payload.age,
        phone: action.payload.phone,
      };

      return {
        ...state,
        users: [...state.users, newUsers],
      };
    }
    case 'UPDATE_USER': {
      return {
        ...state,
        users: state.users.map((user) =>
          user.id === action.payload.id
            ? {
                ...user,
                name: action.payload.name,
                age: action.payload.age,
                phone: action.payload.phone,
              }
            : user
        ),
      };
    }
    case 'ADD_WORKING_HOUR': {
      const { userId, amount, shiftType } = action.payload;
      const now = new Date();

      const formattedDate = now.toISOString().split('T')[0]; // YYYY-MM-DD
      const formattedTime = now.toISOString().slice(0, 5); // HH:MM

      return {
        ...state,
        users: state.users.map((user) =>
          user.id === userId
            ? {
                ...user,
                workingHours: [
                  ...(user.workingHours || []),
                  {
                    id: uuid(),
                    amount,
                    shiftType,
                    date: formattedDate,
                    time: formattedTime,
                  },
                ],
              }
            : user
        ),
      };
    }
    case 'UPDATE_WORKING_HOUR': {
      const { userId, hourId, newAmount, newShiftType, newDate, newTime } =
        action.payload;

      return {
        ...state,
        users: state.users.map((user) => {
          if (user.id !== userId) return user;

          return {
            ...user,
            workingHours: user.workingHours.map((wh) =>
              wh.id === hourId
                ? {
                    ...wh,
                    amount: newAmount,
                    shiftType: newShiftType,
                    date: newDate,
                    time: newTime,
                  }
                : wh
            ),
          };
        }),
      };
    }

    case 'DELETE_WORKING_HOUR': {
      const { userId, hourId } = action.payload;
      return {
        ...state,
        users: state.users.map((user) =>
          user.id === userId
            ? {
                ...user,
                workingHours: user.workingHours.filter(
                  (wh) => wh.id !== hourId
                ),
              }
            : user
        ),
      };
    }
    case 'DELETE_USER': {
      return {
        ...state,
        users: state.users.filter((user) => user.id !== action.payload.id),
      };
    }
    default:
      return state;
  }
};

export const addUser = (payload) => ({ type: 'ADD_USER', payload });
export const updateUser = (payload) => ({ type: 'UPDATE_USER', payload });
export const deleteUser = (payload) => ({ type: 'DELETE_USER', payload });
export const addWorkHour = (payload) => ({ type: 'ADD_WORKING_HOUR', payload });
export const updateWorkHour = (payload) => ({
  type: 'UPDATE_WORKING_HOUR',
  payload,
});
export const deleteWorkHour = (payload) => ({
  type: 'DELETE_WORKING_HOUR',
  payload,
});

// const userSlice = createSlice({
//   name: 'userState',
//   initialState,
//   reducers: {
//     updateUser: (state, action) => {
//       const { id, name, age } = action.payload;
//       const user = state.users.find((u) => u.id);
//       if (user) {
//         user.name = name;
//         user.age = age;
//       }
//     },
//     addUser: (state, action) => {
//       const { name, age } = action.payload;
//       const newId = state.users.length
//         ? Math.max(...state.users.map((u) => u.id)) + 1
//         : 1;
//       state.users.push({ id: newId, name, age });
//     },
//   },
// });

// export const { updateUser, addUser } = userSlice.actions;
// export default userSlice.reducer;
