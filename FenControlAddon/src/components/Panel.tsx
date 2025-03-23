import React, { memo, useEffect, useMemo, useState } from "react";
import { AddonPanel } from "storybook/internal/components";
import { FenItem } from "./FenItem";
import { useArgs, useChannel } from "storybook/internal/manager-api";
import { defer } from "lodash";
import { useList } from "@uidotdev/usehooks";
import { useCustomState } from "./hooks";
import { inputGetter } from "./helpers";

interface PanelProps {
  active: boolean;
}

interface FenEntity {
  name: string;
  fen: string;
  isEditable?: boolean;
}

const DEFAULT_DATA: FenEntity[] = [
  {
    name: "Base",
    fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    isEditable: false,
  },
  {
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

const getNewName = (len: number) => `Untitled(${len})`;

export const Panel: React.FC<PanelProps> = memo(function MyPanel(props) {
  const [, updateArgs] = useArgs();

  const [items, { updateAt, removeAt, push }] = useList(DEFAULT_DATA);

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

  return (
    <AddonPanel {...props}>
      <h1>Fen control</h1>
      <div>
        <input value={name} onChange={changeName} />
        <input value={currentFen} onChange={changeFen} />
        <button
          onClick={() => {
            push({
              name,
              fen: currentFen,
            });
            setName(getNewName(names.size + 1));
          }}
          disabled={names.has(name)}
        >
          Добавить
        </button>
      </div>
      <ul>
        {items.map((fenData, index) => (
          <FenItem
            key={index}
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
          />
        ))}
      </ul>
    </AddonPanel>
  );
});
