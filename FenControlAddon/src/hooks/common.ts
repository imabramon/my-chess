import {
  useState,
  useCallback,
  useMemo,
  useLayoutEffect,
  useRef,
  useEffect,
} from "react";

export const useCustomState = <T, R>(
  init: T,
  getter: (rawState: R) => T,
): [T, (s: R) => void, (s: T) => void] => {
  const [state, setState] = useState(init);

  const customSetState = useCallback(
    (rawState: R) => {
      setState(getter(rawState));
    },
    [getter],
  );

  return [state, customSetState, setState];
};

export const useSync = <T>(
  local: T,
  global: T,
  setLocal: (s: T) => void,
): [boolean, () => void] => {
  const isSynced = useMemo(() => local === global, [local, global]);

  const sync = useCallback(() => {
    if (!isSynced) setLocal(global);
  }, [global, isSynced]);

  return [isSynced, sync];
};

export function useEvent<T extends (...args: never[]) => unknown>(func: T): T {
  const refCallee = useRef(func);

  //TODO Rewrite to useInsertionEffect after update to React 18
  useLayoutEffect(() => {
    refCallee.current = func;
  });

  return useCallback((...args: never[]) => refCallee.current(...args), []) as T;
}

export const useUnmount = <T extends (...args: never[]) => void>(
  func: T,
): void => {
  const onUnmount = useEvent(func);

  useEffect(() => {
    return onUnmount;
  }, []);
};
