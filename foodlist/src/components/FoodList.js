import React, { useState } from "react";
import "./FoodList.css";
import FoodForm from "./FoodForm";
import useTranslate from "../hooks/useTranslate";
import { useSelector, useDispatch } from "react-redux";

function formatDate(value) {
  const date = new Date(value);
  return `${date.getFullYear()}. ${date.getMonth() + 1}.${date.getDate()}`;
}

function FoodListItem({ item, handleDelete, onEdit }) {
  const t = useTranslate();
  const { title, calorie, content, imgUrl, createdAt, id, docId } = item;
  const handleDeleteClick = () => {
    handleDelete(docId, imgUrl);
  };

  const handleEditClick = () => {
    onEdit(id);
  };
  return (
    <div className="FoodListItem">
      <img className="FoodListItem-preview" src={imgUrl} />
      <div className="FoodListItem-rows">
        <div className="FoodListItem-title-calorie">
          <h1 className="FoodListItem-title">{title}</h1>
          <span className="FoodListItem-calorie">{calorie}Kcal</span>
        </div>
        <p className="FoodListItem-content">{content}</p>
        <div className="FoodListItem-date-buttons">
          <p className="FoodListItem-date">{formatDate(createdAt)}</p>
          <div className="FoodListItem-buttons">
            <button
              className="FoodListItem-edit-button"
              onClick={handleEditClick}
            >
              {t("edit button")}
            </button>
            <button
              className="FoodListItem-delete-button"
              onClick={handleDeleteClick}
            >
              {t("delete button")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FoodList({ items, handleDelete, onUpdate, onUpdateSuccess }) {
  const [editingId, setEditingId] = useState(null);
  // const foodItems = useSelector((state) => state.foodList.items);
  // const dispatch = useDispatch();
  return (
    <ul className="FoodList">
      {items.map((item) => {
        if (item.id === editingId) {
          const { title, calorie, content, imgUrl, docId } = item;
          const initialValues = { title, calorie, content, imgUrl: null };

          // 사용자가 화면에서 직접 입력했던 것들이 initialValues
          // imgUrl에 null 값을 넣은 이유는 imgUrl을 갖고 있는 value가  문자열이기 때문에 오류가 나 그래서 null을 넣어준거야
          function handleSubmit(collectionName, dataObj) {
            const result = onUpdate(collectionName, dataObj, docId, imgUrl);
            // 여기있는 imgUrl 은 item 이 갖고있는 문자열이다
            return result;
          }

          const onSubmitSuccess = (result) => {
            onUpdateSuccess(result);
            setEditingId(null);
          };
          return (
            <li key={item.id}>
              <FoodForm
                onCancel={setEditingId}
                onSubmit={handleSubmit}
                initialPreview={imgUrl}
                initialValues={initialValues}
                onSubmitSuccess={onSubmitSuccess}
              />
            </li>
          );
        }

        return (
          <li key={item.id}>
            <FoodListItem
              item={item}
              handleDelete={handleDelete}
              onEdit={setEditingId}
            />
          </li>
        );
      })}
    </ul>
  );
}

export default FoodList;
