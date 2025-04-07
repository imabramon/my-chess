import { useState, useCallback } from "react";

type UseListActions<T> = {
  set: (newList: T[]) => T[];
  push: (...items: T[]) => T[];
  updateAt: (index: number, item: T) => T[];
  insertAt: (index: number, item: T) => T[];
  update: (predicate: (a: T) => boolean, newItem: T) => T[];
  removeAt: (index: number) => T[];
  clear: () => T[];
  reset: () => T[];
  sort: (compareFn?: (a: T, b: T) => number) => T[];
  filter: (callbackFn: (value: T, index: number, array: T[]) => boolean) => T[];
  reverse: () => T[];
};

export function useList<T>(initialList: T[] = []): [T[], UseListActions<T>] {
  const [list, setList] = useState<T[]>(initialList);

  const set = useCallback((newList: T[]) => {
    setList(newList);
    return newList;
  }, []);

  const push = useCallback(
    (...items: T[]) => {
      const newList = [...list, ...items];
      setList(newList);
      return newList;
    },
    [list],
  );

  const updateAt = useCallback(
    (index: number, item: T) => {
      const newList = [...list];
      newList[index] = item;
      setList(newList);
      return newList;
    },
    [list],
  );

  const insertAt = useCallback(
    (index: number, item: T) => {
      const newList = [...list.slice(0, index), item, ...list.slice(index)];
      setList(newList);
      return newList;
    },
    [list],
  );

  const update = useCallback(
    (predicate: (a: T) => boolean, newItem: T) => {
      const newList = list.map((item) => (predicate(item) ? newItem : item));
      setList(newList);
      return newList;
    },
    [list],
  );

  const removeAt = useCallback(
    (index: number) => {
      const newList = [...list.slice(0, index), ...list.slice(index + 1)];
      setList(newList);
      return newList;
    },
    [list],
  );

  const clear = useCallback(() => {
    setList([]);
    return [];
  }, []);

  const reset = useCallback(() => {
    setList(initialList);
    return initialList;
  }, [initialList]);

  const sort = useCallback(
    (compareFn?: (a: T, b: T) => number) => {
      const newList = [...list].sort(compareFn);
      setList(newList);
      return newList;
    },
    [list],
  );

  const filter = useCallback(
    (callbackFn: (value: T, index: number, array: T[]) => boolean) => {
      const newList = list.filter(callbackFn);
      setList(newList);
      return newList;
    },
    [list],
  );

  const reverse = useCallback(() => {
    const newList = [...list].reverse();
    setList(newList);
    return newList;
  }, [list]);

  return [
    list,
    {
      set,
      push,
      updateAt,
      insertAt,
      update,
      removeAt,
      clear,
      reset,
      sort,
      filter,
      reverse,
    },
  ];
}
