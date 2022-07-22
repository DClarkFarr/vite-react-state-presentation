import { useEffect, useRef } from "react";
import { debounce } from "lodash";

const logCount = debounce((p: string, c: number, fn: CallableFunction) => {
  console.log(`${p} rendered ${c} times`);
  fn();
}, 2000);

const useRenderCounter = (page: string) => {
  const count = useRef(0);
  
  count.current += 1;

  logCount(page, count.current, () => {
    count.current = 0
  });

  return {
    count: count.current
  }
}

export default useRenderCounter;
