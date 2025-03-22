import React, { memo } from "react";
import { AddonPanel } from "storybook/internal/components";
import { FenItem } from "./FenItem";
import { useArgs } from "storybook/internal/manager-api";
import { defer } from "lodash";

interface PanelProps {
  active: boolean;
}

interface FenEntity {
  name: string;
  fen: string;
}

const DEFAULT_DATA: FenEntity[] = [
  {
    name: "Base",
    fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  },
  {
    name: "Some",
    fen: "8/8/8/4p1K1/2k1P3/8/8/8 b - - 0 1",
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

export const Panel: React.FC<PanelProps> = memo(function MyPanel(props) {
  const [args, updateArgs] = useArgs();
  return (
    <AddonPanel {...props}>
      <h1>Fen control</h1>
      <ul>
        {DEFAULT_DATA.map((fenData) => (
          <FenItem
            key={fenData.name}
            {...fenData}
            onApply={() => {
              updateArgs({
                fen: fenData.fen,
              });
              defer(() => {
                forceRerender();
              });
            }}
            onDelete={() => {
              console.log("delete", fenData);
            }}
          />
        ))}
      </ul>
    </AddonPanel>
  );
});
