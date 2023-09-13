import { createSlice } from '@reduxjs/toolkit';

export const slice = createSlice({
  name: 'forceflag',
  initialState: {
    value: 0,
  },
  reducers: {
    updateForceFlag: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const {updateForceFlag} = slice.actions;

export default slice.reducer;