import { useState, useCallback, useMemo } from "react";

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
