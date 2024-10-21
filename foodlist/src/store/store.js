import { configureStore } from "@reduxjs/toolkit";
import foodListSlice from "./foodListSlice";
const store = configureStore({
  reducer: { foodList: foodListSlice.reducer },
  middleware: (getDefaultMiddleWare) =>
    getDefaultMiddleWare({ serializableCheck: false }),
});

export default store;
