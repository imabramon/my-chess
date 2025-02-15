import { Emitter, createNanoEvents } from "nanoevents";
import {
  createContext,
  ReactElement,
  FC,
  useRef,
  useContext,
  useCallback,
  MouseEvent as ReactMouseEvent,
} from "react";
import { Coords } from "../types";

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

export const useDrag = () => {
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

const DRAG_DELTA = 3;

export const isMouseMove = (prev: Coords, current: Coords): boolean => {
  const xDelta = Math.abs(current.x - prev.x);
  const yDelta = Math.abs(current.y - prev.y);

  console.log("calll isMouseMouse", xDelta, yDelta);

  return xDelta > DRAG_DELTA || yDelta > DRAG_DELTA;
};

export const cordsFromMouse = (e: MouseEvent | ReactMouseEvent): Coords => {
  return {
    x: e.clientX,
    y: e.clientY,
  };
};
