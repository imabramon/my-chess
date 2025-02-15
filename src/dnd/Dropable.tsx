import { ReactElement, FC, useRef, useEffect, MouseEventHandler } from "react";
import styled from "styled-components";
import { useDrag } from "./common";

interface DropableProps {
  children: ReactElement;
  onDrop?: (data: any) => void;
  onClick?: MouseEventHandler;
}

const BaseDropable = styled.div`
  width: fit-content;
  height: fit-content;
`;

export const Dropable: FC<DropableProps> = ({ children, onDrop, onClick }) => {
  const { addListener } = useDrag();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = addListener((e) => {
      if (!ref.current) return;

      const element = ref.current;

      const { x, y } = e;

      const rect = element.getBoundingClientRect();

      const isInHorisontal = !!x && x >= rect.x && x <= rect.x + rect.width;
      const isInVertical = !!y && y >= rect.y && y <= rect.y + rect.height;
      const isInRect = isInHorisontal && isInVertical;

      if (isInRect) onDrop?.(e);
    });
    return unsubscribe;
  }, [onDrop]);
  return (
    <BaseDropable ref={ref} onClick={onClick}>
      {children}
    </BaseDropable>
  );
};
