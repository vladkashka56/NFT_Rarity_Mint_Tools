import { createSlice } from '@reduxjs/toolkit';

export const slice = createSlice({
  name: 'nftlimit',
  initialState: {
    value: false,
  },
  reducers: {
    updateNftLimitReached: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const {updateNftLimitReached} = slice.actions;

export default slice.reducer;