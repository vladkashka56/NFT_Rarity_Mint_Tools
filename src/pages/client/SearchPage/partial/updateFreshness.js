import { createSlice } from '@reduxjs/toolkit';

export const slice = createSlice({
  name: 'datafreshness',
  initialState: {
    value: 0,
  },
  reducers: {
    updateDataFreshnessTs: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const {updateDataFreshnessTs} = slice.actions;

export default slice.reducer;