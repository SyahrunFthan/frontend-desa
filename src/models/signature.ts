export interface Point {
  x: number;
  y: number;
  color: string;
  size: number;
}

export interface Path {
  points: Point[];
  color: string;
  size: number;
}

export interface SignatureItem {
  id: string;
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
  dataUrl: string;
}

export type ViewSize = Record<number, { w: number; h: number }>;

export const PAGE_W = 800;
export const PAGE_H = 1000;
export const RESIZE_STEP = 1.08;
export const MIN_SIZE = 20;
export const MAX_SIZE = 2000;
