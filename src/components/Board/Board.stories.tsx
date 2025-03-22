import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import { Board, BoardProps } from "./Board"; // Допустим, у вас есть компонент ChessBoard

export default {
  title: "ChessBoard",
  component: Board,
} as Meta;

const Template: StoryFn<BoardProps> = (args) => <Board {...args} />;

export const Default = Template.bind({});
Default.args = {
  fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
};
