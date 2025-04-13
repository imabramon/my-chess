import React, { FC, useCallback } from "react";
import { inputGetter } from "./helpers";
import { useCustomState, useSync, useUnmount } from "../hooks/common";
import { IconButton, Form, ListItem, LI } from "storybook/internal/components";
import Icons from "@storybook/icons";
import styled from "styled-components";

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

const Container = styled.li`
  display: flex;
  list-style: none;
  box-sizing: border-box;
  flex-direction: row;
  gap: 8px;
`;

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
    <Container>
      <Form.Input
        style={{
          width: 100,
        }}
        value={_name}
        onChange={changeName}
        disabled={isEditDisabled}
      />
      <Form.Input
        style={{
          width: 350,
        }}
        value={_fen}
        onChange={chageFen}
        disabled={isEditDisabled}
      />
      {!isAnyChanged ? (
        <>
          <IconButton onClick={onApply} title="Применить">
            <Icons.TransferIcon />
          </IconButton>
          <IconButton
            onClick={loadCurrent}
            title="Загрузить"
            disabled={isEditDisabled}
          >
            <Icons.DownloadIcon />
          </IconButton>
          <IconButton
            onClick={_onDelete}
            title="Удалить"
            disabled={isEditDisabled}
          >
            <Icons.TrashIcon />
          </IconButton>
        </>
      ) : (
        <>
          <IconButton
            onClick={_onSave}
            title="Сохранить"
            disabled={!canSave(_name, _fen)}
          >
            <Icons.CheckIcon />
          </IconButton>
          <IconButton onClick={sync} title="Отменить">
            <Icons.ReplyIcon />
          </IconButton>
        </>
      )}
    </Container>
  );
};
