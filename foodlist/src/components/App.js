import "./App.css";
import logoImg from "../assets/logo.png";
import searChImg from "../assets/ic-search.png";
import FoodForm from "./FoodForm";
import FoodList from "./FoodList";
import footerLogo from "../assets/logo-text.png";
import backgroundImg from "../assets/background.png";
import { useEffect, useState } from "react";
import {
  addDatas,
  deleteDatas,
  getDatas,
  getDatasByOrderLimit,
  getSearchDatas,
  updateDatas,
} from "../api/firebase";
import LocaleSelected from "./LocaleSelected";

import useTranslate from "../hooks/useTranslate";
import useAsync from "../hooks/useAsync";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteItem,
  fetchItems,
  setOrder,
  updateItem,
} from "../store/foodListSlice";

const LIMIT = 5;

function AppSortButton({ children, selected, onClick }) {
  return (
    <button
      className={`AppSortButton ${selected ? "selected" : ""}`}
      onClick={onClick}
      disabled={selected}
    >
      {children}
    </button>
  );
}

function App() {
  const dispatch = useDispatch();
  const { items, order, lastQuery, hasNext, isLoading } = useSelector(
    (state) => state.foodList
  );
  // const search = useSelector((state) => state.foodList.search);
  // const [items, setItems] = useState([]);
  // const [search, setSearch] = useState("");
  // const [order, setOrder] = useState("createdAt");
  // const [lq, setLq] = useState();
  // lastQuery를 관리하기위해 만든 state이다.
  // const [hasNext, setHasNext] = useState(true);
  // 더보기버튼을 관리 하기 위해 만든 state이다
  const t = useTranslate();
  // const [isLoading, setIsLoading] = useState(false);
  // const [isLoading, loadingError, getDatasAsnyc] =
  //   useAsync(getDatasByOrderLimit);

  const handleLoad = async (options) => {
    dispatch(fetchItems({ collectionName: "foods", queryOptions: options }));
    // setIsLoading(true);
    // const { resultData, lastQuery } = await getDatasByOrderLimit(
    //   "foods",
    //   options
    // );
    // setIsLoading(false);
    // const { resultData, lastQuery } = await getDatasAsnyc("foods", options);
    // console.log(lastQuery);
    // if (!options.lq) {
    //   setItems(resultData);
    // } else if (options.lq) {
    //   setItems((prev) => [...prev, ...resultData]);
    // }
    // setLq(lastQuery);
    // if (!lastQuery) {
    //   setHasNext(false);
    // }
    // 여기있는 lastQuery는 계속 가지고 있어야해. 그래야 마지막에 화면에 나온게 뭔지 알수 있지
  };
  // console.log(items);

  // console.log(listItems);
  // const handleLoad = async (options) => {
  //   const { resultData, lastQuery } = await getDatasByOrderLimit(
  //     "foods",
  //     options
  //   );
  //   setItems((prev) => [...prev, ...resultData]);
  //   setLq(lastQuery);
  // };
  // ==========> 이상태로 냅두면 더보기를 누르면 1번부터 계속 다시 나와 그래서 그걸 방지하기 위해서 다른 코드로 로직으로 짜야해

  const handleNewestClick = () => dispatch(setOrder("createdAt"));
  const handleCalorieClick = () => dispatch(setOrder("calorie"));

  //d일반 리듀서스

  const handleMoreClick = () => {
    const queryOptions = {
      conditions: [],
      orderBys: [{ field: order, direction: "desc" }],
      lastQuery: lastQuery,
      limits: LIMIT,
    };
    handleLoad(queryOptions);
    // 그냥 handleLoad 넣어주면 되는데 위에 options 라고 객체 넣어주기로 했으니까 파라미터에 객체방식으로 데이터를 넣어준거야
  };

  const handleDelete = async (docId, imgUrl) => {
    //item 에서 docId 를 받아온다.

    //db에서 데이터 삭제(스토리지에 있는 사진 파일도 삭제, database에 있는 데이터 삭제) ==> 스토리지에 파일은 imgUrl이 , database는 docId 필요
    const { result, message } = await deleteDatas("foods", docId, imgUrl);
    if (!result) {
      alert(message);
      return;
    }
    // 삭제 성공 시 화면에 그 결과를 반영해야한다.
    const queryOptions = {
      conditions: [],
      orderBys: [{ field: order, direction: "desc" }],
      lastQuery: undefined,
      limits: LIMIT,
    };
    handleLoad(queryOptions);
  };

  const handleAddSuccess = (resultData) => {
    const queryOptions = {
      conditions: [],
      orderBys: [{ field: order, direction: "desc" }],
      lastQuery: undefined,
      limits: LIMIT,
    };
    handleLoad(queryOptions);
    // setItems((prevItems) => [resultData, ...prevItems]);
  };

  const handleUpdate = (collectionName, docId, updateObj, imgUrl) => {
    dispatch(updateItem({ collectionName, docId, updateObj, imgUrl }));
  };

  const handleUpdateSuccess = (result) => {
    console.log(result);
    // setItems((prev) => {
    //   const splitIdx = prev.findIndex((item) => item.id === result.id);
    //   return [...prev.slice(0, splitIdx), result, ...prev.slice(splitIdx + 1)];
    // });
  };

  const handleSearchChange = (e) => {
    // setSearch(e.target.value);
  };

  const handleSearchSubmit = async (e) => {
    // e.preventDefault();
    // if (search === "") {
    //   handleLoad({ fieldName: order, limits: LIMIT, lq: undefined });
    // } else {
    //   const resultData = await getSearchDatas("foods", {
    //     limits: LIMIT,
    //     search: search,
    //   });
    //   setItems(resultData);
    // }
  };

  useEffect(() => {
    // handleLoad({ fieldName: order, limits: LIMIT, lq: undefined });
    const queryOptions = {
      conditions: [],
      orderBys: [{ field: order, direction: "desc" }],
      lastQuery: undefined,
      limits: LIMIT,
    };
    handleLoad(queryOptions);
  }, [order]);
  // 여기 fieldName:order, limits : LIMIT는 원래 getDatasByOrderLimit 함수에 파라미터로 들어가있던걸 여기로 옮기고 위에 options 라는 파라미터로 만든거뿐이야

  return (
    <div className="App" style={{ backgroundImage: `url(${backgroundImg})` }}>
      <div className="App-nav">
        <img src={logoImg} />
      </div>
      <div className="App-container">
        <div className="App-FoodForm">
          <FoodForm onSubmit={addDatas} onSubmitSuccess={handleAddSuccess} />
        </div>
        <div className="App-filter">
          <form className="App-search" onSubmit={handleSearchSubmit}>
            <input className="App-search-input" onChange={handleSearchChange} />
            <button className="App-search-button">
              <img src={searChImg} />
            </button>
          </form>
          <div className="App-orders">
            <AppSortButton
              selected={order === "createdAt"}
              onClick={handleNewestClick}
            >
              {t("newest")}
            </AppSortButton>
            <AppSortButton
              onClick={handleCalorieClick}
              selected={order === "calorie"}
            >
              {t("calorie")}
            </AppSortButton>
          </div>
        </div>
        <FoodList
          items={items}
          handleDelete={handleDelete}
          onUpdate={handleUpdate}
          onUpdateSuccess={handleUpdateSuccess}
        />
        {hasNext && (
          <button
            onClick={handleMoreClick}
            className="App-load-more-button"
            disabled={isLoading}
          >
            {t("load more ")}
          </button>
        )}
      </div>
      <div className="App-footer">
        <div className="App-footer-container">
          <img src={footerLogo} />
          <LocaleSelected />
          <div className="App-footer-menu">
            {t("terms of service")} | {t("privary policy")}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
