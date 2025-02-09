import { isEqual } from "lodash";
import { ReactElement, FC, useRef, useLayoutEffect } from "react";
import styled from "styled-components";
import { useDrag } from "./common";

const BaseDragable = styled.div`
  width: fit-content;
  height: fit-content;
`;

interface DragableProps {
  children: ReactElement;
  data: any;
  onDrag?: () => void;
}

export const Dragable: FC<DragableProps> = ({ children, data, onDrag }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isDraging = useRef(false);
  const { setData, data: currentData, drop, setX, setY } = useDrag();

  useLayoutEffect(() => {
    if (!ref.current) return;

    const callback = (e: MouseEvent) => {
      //   console.log("calll", "move");
      const element = ref.current;
      if (!element) return;

      const isDrag = isDraging.current;
      if (isDrag) {
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

  return (
    <BaseDragable
      ref={ref}
      onMouseDown={(e) => {
        console.log("calll", "down");
        e.preventDefault();
        onDrag?.();
        if (!isEqual(currentData, data)) setData(data);
        isDraging.current = true;
      }}
      onMouseUp={() => {
        isDraging.current = false;
        drop();
        setData(undefined);
      }}
    >
      {children}
    </BaseDragable>
  );
};
