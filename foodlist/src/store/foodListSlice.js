import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  addDatas,
  deleteDatas,
  getDatasByOrderLimit,
  getSearchDatas,
  updateDatas,
} from "../api/firebase";
const foodListSlice = createSlice({
  name: "foodList",
  initialState: {
    items: [],
    loadingError: "",
    hasNext: true,
    search: "",
    lastQuery: null,
    isLoading: false,
    order: "createdAt",
  },
  reducers: {
    setOrder: (state, action) => {
      state.order = action.payload;
    },
    setHasNext: (state, action) => {
      state.hasNext = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        const { resultData, lastQuery } = action.payload;
        if (action.payload.isReset) {
          state.items = resultData;
        } else {
          // state.items = [...state.items, ...resultData];
          resultData.forEach((data) => {
            state.items.push(data);
          });
        }
        // if (!action.payload.lastQuery) {
        //   state.hasNext = false;
        // } else {
        //   state.hasNext = true;
        // }
        // state.hasNext = action.payload.lastQuery ? true : false;
        state.hasNext = !!action.payload.lastQuery;
        // 이렇게도 쓸수 있음 ==> 부정연산자 두번한것. ()안에는 true가 나오고 ! 만나서 false가 되고 그다음 괄호 밖에 ! 만나니까 true 가 됌
        state.lastQuery = lastQuery;
        state.isLoading = false;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.isLoading = false;
        state.loadingError = action.payload;
      })
      .addCase(addItem.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.status = "complete";
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => {
          return item.id !== action.payload.id;
        });
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        const idx = state.items.findIndex(
          (item) => item.id === action.payload.id
        );
        state.items[idx] = action.payload;
        state.isLoading = false;
      });
  },
});

const fetchItems = createAsyncThunk(
  "items/fetchItems",
  async ({ collectionName, queryOptions }) => {
    try {
      const resultData = await getDatasByOrderLimit(
        collectionName,
        queryOptions
      );
      resultData.isReset = !queryOptions.lastQuery ? true : false;
      // resultData.isReset = !!queryOptions.lastQuery;
      return resultData;
    } catch (error) {
      return "FETCH Error: " + error;
    }
  }
);

const addItem = createAsyncThunk(
  "items/addItem",
  async ({ collectionName, addObj }) => {
    try {
      const resultData = await addDatas(collectionName, addObj);
      return resultData;
    } catch (error) {
      console.log("add error", error);
    }
  }
);

const deleteItem = createAsyncThunk(
  "items/deleteItem",
  async ({ collectionName, docId, imgUrl }) => {
    try {
      const { resultData, message } = await deleteDatas(
        collectionName,
        docId,
        imgUrl
      );
      return { resultData, message };
    } catch (error) {
      console.log("delete error", error);
    }
  }
);

const updateItem = createAsyncThunk(
  "item/updateItem",
  async ({ collectionName, docId, updateObj, imgUrl }) => {
    try {
      const resultData = await updateDatas(
        collectionName,
        docId,
        updateObj,
        imgUrl
      );
      return resultData;
    } catch (error) {
      return `UPDATE Error : + ${error}`;
    }
  }
);

const searchItem = createAsyncThunk(
  "item/searchItem",
  async ({ collectionName, options }) => {
    try {
      const resultData = await getSearchDatas(collectionName);
    } catch (error) {
      console.log("search error", error);
    }
  }
);
export default foodListSlice;
export { fetchItems, addItem, deleteItem, updateItem };
export const { setOrder, setHasNext } = foodListSlice.actions;
