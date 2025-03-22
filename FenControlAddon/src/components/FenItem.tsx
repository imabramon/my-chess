import React, { FC, useCallback } from "react";

interface FenItemProps {
  name: string;
  fen: string;
  onApply: () => void;
  onDelete: () => void;
}

export const FenItem: FC<FenItemProps> = (props) => {
  const { name, fen, onApply, onDelete } = props;

  const _onDelete = useCallback(() => {
    if (confirm("Вы действительно хотите удалить?")) {
      onDelete();
    }
  }, [onDelete]);
  return (
    <li>
      <input value={name} />
      <input value={fen} />
      <button onClick={onApply}>Применить</button>
      <button onClick={_onDelete}>Удалить</button>
    </li>
  );
};
