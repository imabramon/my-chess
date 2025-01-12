/* eslint-disable @typescript-eslint/no-explicit-any */
import { isEqual } from "lodash";
import { createNanoEvents, Emitter } from "nanoevents";
import {
  createContext,
  ReactElement,
  FC,
  useRef,
  useLayoutEffect,
  useContext,
  useCallback,
  useEffect,
} from "react";
import styled from "styled-components";

interface DND {
  x?: number;
  y?: number;
  data?: any;
  emmiter?: Emitter<Events>;
}

const DndContex = createContext<DND>({});

interface DndProviderProps {
  children: ReactElement;
}

interface DropEvent {
  x?: number;
  y?: number;
  data?: any;
}

interface Events {
  drop: (e: DropEvent) => void;
}

const createInitData: () => DND = () => {
  const emmiter = createNanoEvents<Events>();

  return {
    emmiter,
  };
};

export const DndProvider: FC<DndProviderProps> = ({ children }) => {
  const data = useRef<DND>(createInitData());

  return (
    <DndContex.Provider value={data.current}>{children}</DndContex.Provider>
  );
};

const useDrag = () => {
  const data = useContext(DndContex);

  const setX = useCallback((x: number) => {
    data.x = x;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const setY = useCallback((y: number) => {
    data.y = y;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const setData = useCallback((d: any) => {
    data.data = d;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const drop = useCallback(() => {
    data.emmiter?.emit("drop", { x: data.x, y: data.y, data: data.data });
  }, []);

  const addListener = useCallback((callback: (e: DropEvent) => void) => {
    return data.emmiter?.on("drop", callback);
  }, []);

  return { setX, setY, setData, data: data.data, drop, addListener };
};

const BaseDragable = styled.div`
  width: fit-content;
  height: fit-content;
`;

interface DragableProps {
  children: ReactElement;
  data: any;
}

export const Dragable: FC<DragableProps> = ({ children, data }) => {
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

interface DropableProps {
  children: ReactElement;
  onDrop?: (data: any) => void;
}

const BaseDropable = styled.div`
  width: fit-content;
  height: fit-content;
`;

export const Dropable: FC<DropableProps> = ({ children, onDrop }) => {
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
  }, []);
  return <BaseDropable ref={ref}>{children}</BaseDropable>;
};
