import React, { FC, useCallback } from "react";
import { inputGetter } from "./helpers";
import { useCustomState, useSync, useUnmount } from "../hooks/common";

interface FenItemProps {
  name: string;
  fen: string;
  curentFen: string;
  isEditable?: boolean;
  onApply: () => void;
  onDelete: () => void;
  onSave: (name: string, fen: string) => void;
  canSave: (name: string, fen: string) => boolean;
}

export const FenItem: FC<FenItemProps> = (props) => {
  const {
    name,
    fen,
    isEditable,
    onApply,
    onDelete,
    onSave,
    curentFen,
    canSave,
  } = props;

  const [_name, changeName, setName] = useCustomState(name, inputGetter);
  const [isNameSynced, syncName] = useSync(_name, name, setName);

  const [_fen, chageFen, setFen] = useCustomState(fen, inputGetter);
  const [isFenSynced, syncFen] = useSync(_fen, fen, setFen);

  const sync = useCallback(() => {
    syncName();
    syncFen();
  }, [syncFen, syncName]);

  const isAnyChanged = !(isNameSynced && isFenSynced);

  const _onDelete = useCallback(() => {
    if (true || confirm("Вы действительно хотите удалить?")) {
      onDelete();
    }
  }, [onDelete]);

  const _onSave = useCallback(() => {
    onSave(_name, _fen);
  }, [_name, _fen]);

  const loadCurrent = () => {
    setFen(curentFen);
    onSave(_name, curentFen);
  };

  const isEditDisabled = isEditable !== undefined ? !isEditable : false;

  return (
    <li>
      <input value={_name} onChange={changeName} disabled={isEditDisabled} />
      <input value={_fen} onChange={chageFen} disabled={isEditDisabled} />
      {!isAnyChanged ? (
        <>
          <button onClick={onApply}>Применить</button>
          <button onClick={loadCurrent} disabled={isEditDisabled}>
            Загрузить
          </button>
          <button onClick={_onDelete} disabled={isEditDisabled}>
            Удалить
          </button>
        </>
      ) : (
        <>
          <button onClick={_onSave} disabled={!canSave(_name, _fen)}>
            Сохранить
          </button>
          <button onClick={sync}>Отменить</button>
        </>
      )}
    </li>
  );
};
