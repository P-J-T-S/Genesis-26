// redux store configuration
import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./slices/themeSlice";
import wasteReducer from "./slices/waste/wasteSlice";
import { apiSlice } from "./slices/apiSlice";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    waste: wasteReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  
  // Optional: enable Redux DevTools automatically in dev
  devTools: import.meta.env.DEV,
});

export default store;
