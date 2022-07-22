import { useEffect, useRef } from "react";
import { debounce } from "lodash";

const logCount = debounce((p: string, c: number) => {
  console.log(`${p} rendered ${c} times`);
}, 2000);

const useRenderCounter = (page: string) => {
  const count = useRef(0);
  
  count.current += 1;

  logCount(page, count.current);

  return {
    count: count.current
  }
}

export default useRenderCounter;
