import { createSlice } from '@reduxjs/toolkit';

export const slice = createSlice({
  name: 'scrprogress',
  initialState: {
    value: 0,
  },
  reducers: {
    updateScrappingProgress: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const {updateScrappingProgress} = slice.actions;

export default slice.reducer;

  