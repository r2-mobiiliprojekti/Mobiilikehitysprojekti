export type Item = {
  id: number;
  SWE_word: string;
  FIN_word: string[];
};

export type Layout = {
  x: number;
  y: number;
};

export type DragProps = {
    item: Item;
    target?: Layout;
    onMatch: (id: number) => void 
  };