import { useCallback } from "react";
import { Meta, StoryFn } from "@storybook/react";
import { useChannel } from "@storybook/preview-api";
import { Board, BoardProps } from "./Board"; // Допустим, у вас есть компонент ChessBoard

export default {
  title: "ChessBoard",
  component: Board,
} as Meta;

const Template: StoryFn<BoardProps> = (args) => {
  const emit = useChannel({});

  const setCurrentFen = useCallback(
    (fenString: string) => {
      emit("FEN_CHANGING", { currentFen: fenString });
    },
    [emit]
  );

  return <Board setCurrentFen={setCurrentFen} {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
};
