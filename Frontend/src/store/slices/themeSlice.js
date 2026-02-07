// slice to manage theme (forced to light)
import { createSlice } from "@reduxjs/toolkit";

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    mode: "light",
  },
  reducers: {
    toggleTheme(state) {
      // No-op: Theme is locked to light
      state.mode = "light";
    },
    setTheme(state, action) {
      // No-op or allow only if 'light' (optional, but effectively we just ignore or set to light)
      state.mode = "light";
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
