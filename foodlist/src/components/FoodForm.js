import React from "react";
import FileInput from "./FileInput";
import "./FoodForm.css";
import { useState } from "react";
import { addDatas } from "../api/firebase";
import useTranslate from "../hooks/useTranslate";
import useAsync from "../hooks/useAsync";

const INITIAL_VALUES = {
  title: "",
  content: "",
  calorie: 0,
  imgUrl: null,
};

function sanitize(type, value) {
  switch (type) {
    case "number":
      return Number(value) || 0;

    default:
      return value;
  }
}

function FoodForm({
  onCancel,
  onSubmitSuccess,
  onSubmit,
  initialValues = INITIAL_VALUES,
  // App 에서는 initialValues가 없으니까 기본값으로 INITIAL_VALUES를 넣은것
  initialPreview,
}) {
  const [values, setValues] = useState(initialValues);
  // const [isSubmitting, setIsSubmitting] = useState(false);
  const t = useTranslate();
  const [isSubmitting, submittingError, onSubmitAsync] = useAsync(onSubmit);
  const handleChange = (name, value) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    // e.target 안에 type 또한 있다 그래서 구조분해한것
    handleChange(name, sanitize(type, value));
    // 원래 들어있던 name과 value 에서 value 자리에 Number로 넣어주기 위해
    // sanitize 라는 함수를 만들었고 거기 파라미터를 받기 위해 type을 e.target에서 받아온것
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // setIsSubmitting(true);
    const resultData = await onSubmitAsync("foods", values);
    onSubmitSuccess(resultData);
    // setIsSubmitting(false);

    setValues(INITIAL_VALUES);
  };
  return (
    <form className="FoodForm" onSubmit={handleSubmit}>
      <FileInput
        className="FoodForm-preview"
        onChange={handleChange}
        name="imgUrl"
        value={values.imgUrl}
        initialPreview={initialPreview}
      />
      {/* 여기있는 value를 src에 들어가게 만들어야해 왜냐면 value는 url 이니까 */}
      <div className="FoodForm-rows">
        <div className="FoodForm-title-calorie">
          <input
            className="FoodForm-title"
            type="text"
            onChange={handleInputChange}
            placeholder="이름을 입력해주세요"
            name="title"
            value={values.title}
          />
          <input
            className="FoodForm-calorie"
            type="number"
            onChange={handleInputChange}
            name="calorie"
            value={values.calorie}
          />
          {onCancel && (
            <button
              className="FoodForm-cancel-button"
              type="button"
              onClick={() => onCancel(null)}
            >
              {t("cancel button")}
            </button>
          )}
          <button
            className="FoodForm-submit-button"
            type="submit"
            disabled={isSubmitting}
          >
            {t("confirm button")}
          </button>
        </div>
        <textarea
          className="FoodForm-content"
          onChange={handleInputChange}
          placeholder="내용을 작성해주세요"
          name="content"
          value={values.content}
        />
      </div>
    </form>
  );
}

export default FoodForm;
