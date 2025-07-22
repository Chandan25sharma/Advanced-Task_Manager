declare module 'react-beautiful-dnd' {
  export interface DragDropContextProps {
    onDragEnd: (result: DropResult) => void;
    children: React.ReactNode;
  }
  
  export interface DroppableProps {
    droppableId: string;
    type?: string;
    children: (provided: DroppableProvided, snapshot: DroppableStateSnapshot) => React.ReactElement;
  }
  
  export interface DraggableProps {
    draggableId: string;
    index: number;
    children: (provided: DraggableProvided, snapshot: DraggableStateSnapshot) => React.ReactElement;
  }
  
  export interface DropResult {
    draggableId: string;
    type: string;
    source: DraggableLocation;
    destination?: DraggableLocation | null;
    reason: DropReason;
  }
  
  export interface DraggableLocation {
    droppableId: string;
    index: number;
  }
  
  export type DropReason = 'DROP' | 'CANCEL';
  
  export interface DroppableProvided {
    innerRef: (element: HTMLElement | null) => void;
    droppableProps: any;
    placeholder: React.ReactElement | null;
  }
  
  export interface DroppableStateSnapshot {
    isDraggingOver: boolean;
    draggingOverWith?: string;
  }
  
  export interface DraggableProvided {
    innerRef: (element: HTMLElement | null) => void;
    draggableProps: any;
    dragHandleProps: any;
  }
  
  export interface DraggableStateSnapshot {
    isDragging: boolean;
    isDropAnimating: boolean;
  }
  
  export const DragDropContext: React.ComponentType<DragDropContextProps>;
  export const Droppable: React.ComponentType<DroppableProps>;
  export const Draggable: React.ComponentType<DraggableProps>;
}

declare module '*.css' {
  const content: any;
  export default content;
}

declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.jpeg' {
  const content: string;
  export default content;
}
