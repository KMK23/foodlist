import { React, useEffect, useState } from "react";
import placeholderImg from "../assets/preview-placeholder.png";
import resetImg from "../assets/ic-reset-white.png";
import "./FileInput.css";

function FileInput({ name, value, onChange, initialPreview }) {
  if (typeof value === "string") {
    value = null;
  }
  const [preview, setPreview] = useState(initialPreview);

  // 미리보기를 보여줄때의 url은 value에 들어가는게 아니고

  const handleChange = (e) => {
    const nextValue = e.target.files[0];
    onChange(name, nextValue);
  };

  const handleClearClick = () => {
    onChange(name, null);
  };

  useEffect(() => {
    if (!value) return;
    const nextPreview = URL.createObjectURL(value);
    // value는 미디어소스, 블롭타입만 들어와야해
    // 그래서 위에 prop 으로 받은 value는 문자열이야
    //value를 문자열이 받게 되니까 오류가 나
    console.log(nextPreview);
    setPreview(nextPreview);
    return () => {
      setPreview(null);
      URL.revokeObjectURL(nextPreview);
    };
  }, [value]);
  return (
    <div className="FileInput">
      <img
        className={`FileInput-preview ${preview ? "selected" : ""}`}
        src={preview || placeholderImg}
      />
      <input
        className="FileInput-hidden-overlay"
        type="file"
        onChange={handleChange}
        // 원래 onChange={onChange} 이렇게 쓰여있었음 근데 name value 파라미터를 넣을곳이 없어서 위에 handleChange 라는 새로운 함수를 만들었음
      />
      {value && (
        <button
          className="FileInput-clear-button"
          onClick={handleClearClick}
          type="button"
        >
          {/* submit 이 어서 원래 그냥 삭제 되었는데 그런게 아ㅓ니라 x 눌렀을때 이미지만 삭제하려고 handleClearClick 함수 만든거야
          그리고 명시 해주기 위해 type="button"을 넣었어
          */}
          <img src={resetImg} />
        </button>
      )}
      {/* value가 있으면 조건부 렌더링 한거야.
       여기서 value는 파일에서 가져온 imgUrl이야
      */}
    </div>
  );
}

export default FileInput;
