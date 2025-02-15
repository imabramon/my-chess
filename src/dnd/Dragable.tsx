import { isEqual } from "lodash";
import {
  ReactElement,
  FC,
  useRef,
  useLayoutEffect,
  MouseEventHandler,
} from "react";
import styled from "styled-components";
import { cordsFromMouse, isMouseMove, useDrag } from "./common";
import { Coords } from "../types";

const BaseDragable = styled.div`
  width: fit-content;
  height: fit-content;
`;

interface DragableProps {
  children: ReactElement;
  data: any;
  onDrag?: () => void;
}

export const Dragable: FC<DragableProps> = ({
  children,
  data,
  onDrag: propsOnDrag,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isDraging = useRef(false);
  const mouseCoords = useRef<Coords | null>(null);
  const isBeginDragCalled = useRef(false);
  const { setData, data: currentData, drop, setX, setY } = useDrag();

  const onDrag = () => {
    console.log("calll", "onDrag");
    propsOnDrag?.();
  };

  useLayoutEffect(() => {
    if (!ref.current) return;

    const callback = (e: MouseEvent) => {
      //   console.log("calll", "move");
      const element = ref.current;
      if (!element) return;

      const current = cordsFromMouse(e);
      const prev = mouseCoords.current;

      const isDrag =
        isDraging.current && (prev ? isMouseMove(prev, current) : true);

      if (isDrag) {
        console.log("calll on move", current, prev);
        if (!isBeginDragCalled.current) {
          onDrag?.();
          isBeginDragCalled.current = true;
        }
        // console.log("calll", "isDraging");
        element.style.position = "fixed";
        element.style.top = `${e.clientY}px`;
        element.style.left = `${e.clientX}px`;
        element.style.zIndex = "1001";
        setX(e.clientX);
        setY(e.clientY);
      } else {
        // console.log("calll", "no draging");
        element.style.position = "static";
      }
    };

    document.addEventListener("mousemove", callback);

    return () => {
      document.removeEventListener("mousemove", callback);
    };
  }, [ref]);

  const onMouseDown: MouseEventHandler = (e) => {
    e.preventDefault();
    // onDrag?.();
    if (!isEqual(currentData, data)) setData(data);
    isDraging.current = true;
    mouseCoords.current = cordsFromMouse(e);
    isBeginDragCalled.current = false;
    console.log("calll", "down", mouseCoords.current);
  };

  const onMouseUp: MouseEventHandler = () => {
    isDraging.current = false;
    drop();
    setData(undefined);
    mouseCoords.current = null;
  };

  return (
    <BaseDragable ref={ref} onMouseDown={onMouseDown} onMouseUp={onMouseUp}>
      {children}
    </BaseDragable>
  );
};
