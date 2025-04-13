import React, { memo, useCallback, useEffect, useMemo } from "react";
import {
  AddonPanel,
  Form,
  H1,
  IconButton,
} from "storybook/internal/components";
import { FenItem } from "./FenItem";
import { useArgs, useChannel } from "storybook/internal/manager-api";
import { defer, uniqueId } from "lodash";
import { useLocalStorage } from "@uidotdev/usehooks";
import { useCustomState, useUnmount } from "../hooks/common";
import { inputGetter } from "./helpers";
import { useList } from "src/hooks/useList";
import Icons from "@storybook/icons";
import styled from "styled-components";

interface PanelProps {
  active: boolean;
}

interface FenEntity {
  id: string;
  name: string;
  fen: string;
  isEditable?: boolean;
}

const newFenId = () => uniqueId("fen_");

const DEFAULT_DATA: FenEntity[] = [
  {
    id: newFenId(),
    name: "Base",
    fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    isEditable: false,
  },
  {
    id: newFenId(),
    name: "Some test 2",
    fen: "8/8/8/4p1K1/2k1P3/8/8/8 b - - 0 1",
    isEditable: false,
  },
];

// hack
function forceRerender() {
  const buttons = window.parent.document.querySelectorAll("button[title]");
  buttons.forEach((button) => {
    if (button.getAttribute("title") === "Remount component") {
      // @ts-ignore
      button.click();
      return;
    }
  });
}

const useSave = <T extends (...args: any[]) => any>(
  origin: T,
  save: (T: ReturnType<T>) => void,
): T =>
  useCallback(
    ((...args: Parameters<T>): ReturnType<T> => {
      const result = origin(...args);
      save(result);
      return result;
    }) as T,
    [origin, save],
  );

const getNewName = (len: number) => `Untitled(${len})`;

const Container = styled.div`
  padding: 8px;
  width: 100%;
  height: 100%;
`;

const List = styled.ul`
  padding-left: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Header = styled.div`
  display: flex;
  list-style: none;
  box-sizing: border-box;
  flex-direction: row;
  gap: 8px;
`;

export const Panel: React.FC<PanelProps> = memo(function MyPanel(props) {
  const [, updateArgs] = useArgs();

  const [savedItems, saveItems] = useLocalStorage<FenEntity[]>(
    "fen-addon",
    DEFAULT_DATA,
  );

  const [items, rawActions] = useList(savedItems);

  const names = useMemo(
    () => new Set([...items.map(({ name }) => name)]),
    [items],
  );

  useEffect(() => {}, [names.size]);

  const [name, changeName, setName] = useCustomState(
    getNewName(names.size),
    inputGetter,
  );
  const [currentFen, changeFen, setCurrentFen] = useCustomState(
    "",
    inputGetter,
  );

  useChannel({
    FEN_CHANGING: ({ currentFen }: { currentFen: string }) => {
      setCurrentFen(currentFen);
    },
  });

  useUnmount(() => {
    saveItems(items);
  });

  const save = useCallback((items: FenEntity[]) => saveItems(items), []);

  const push = useSave(rawActions.push, save);
  const updateAt = useSave(rawActions.updateAt, save);
  const removeAt = useSave(rawActions.removeAt, save);

  return (
    <AddonPanel {...props}>
      <Container>
        <H1>Fen control</H1>
        <Header>
          <Form.Input
            style={{
              width: 100,
            }}
            value={name}
            onChange={changeName}
          />
          <Form.Input
            style={{
              width: 350,
            }}
            value={currentFen}
            onChange={changeFen}
          />
          <IconButton
            title="Добавить"
            onClick={() => {
              push({
                id: newFenId(),
                name,
                fen: currentFen,
              });
              setName(getNewName(names.size + 1));
            }}
            disabled={names.has(name)}
          >
            <Icons.AddIcon />
          </IconButton>
        </Header>
        <List>
          {items.map((fenData, index) => (
            <FenItem
              key={fenData.id}
              {...fenData}
              curentFen={currentFen}
              onApply={() => {
                updateArgs({
                  fen: fenData.fen,
                });
                defer(() => {
                  forceRerender();
                });
              }}
              onDelete={() => {
                removeAt(index);
              }}
              onSave={(name, fen) => {
                updateAt(index, {
                  ...fenData,
                  name,
                  fen,
                });
              }}
              canSave={(name) => {
                return !names.has(name);
              }}
            />
          ))}
        </List>
      </Container>
    </AddonPanel>
  );
});
