import { ChangeEvent } from "react";

export const inputGetter = (e: ChangeEvent<HTMLInputElement>) => {
  return e.target.value;
};
