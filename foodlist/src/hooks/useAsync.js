import { useState } from "react";

function useAsync(asyncFunction) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);

  const wrappedFunction = async (...args) => {
    //함수 선언

    // ...은 스프레드연산자가 아님 하나의 문법. 나머지 파라미터를 다 받을수 있는
    // ==>> 배열의 형태 ex) ...["foods", options] 그래서 ...과 [] 없애서
    //"foods", options 이렇게 함수안에 파라미터로 들어가는것
    try {
      setError(null);
      setPending(true);
      return await asyncFunction(...args);
      //함수 실행. ==> 여기는 스프레드 연산자를 쓴것
      // 그렇기 떄문에 [] or {} 이걸 풀어서 getDatasByOrderLimit 에 필요한 파라미터가 2개였기때문에 2개 딱 받는거야
    } catch (error) {
      setError(error);
      return;
    } finally {
      setPending(false);
    }
  };

  return [pending, error, wrappedFunction];
}

export default useAsync;

// isLoading, isSubmitting ==> 비동기 통신의 결과를 기다려주는 역할
// 비동기 통신이 원만하게 이루어질수 있도록 하는 커스텀 훅
