import {
  PaintStyle,
  Skia,
  StrokeCap,
  StrokeJoin,
  rect,
  fitbox,
  processTransform2d,
} from '@shopify/react-native-skia';
import {Dimensions} from 'react-native';

import type {
  SkMatrix,
  SkRect,
  SkSize,
  Vector,
} from '@shopify/react-native-skia';
import {makeMutable} from 'react-native-reanimated';
const window = Dimensions.get('window');

enum MatrixIndex {
  ScaleX = 0,
  SkewX = 1,
  TransX = 2,
  SkewY = 3,
  ScaleY = 4,
  TransY = 5,
  Persp0 = 6,
  Persp1 = 7,
  Persp2 = 8,
}

export const getPaint = (strokeWidth: number, color: string) => {
  const paint = Skia.Paint();
  paint.setStrokeWidth(strokeWidth);
  paint.setStrokeMiter(5);
  paint.setStyle(PaintStyle.Stroke);
  paint.setStrokeCap(StrokeCap.Round);
  paint.setStrokeJoin(StrokeJoin.Round);
  paint.setAntiAlias(true);
  const _color = paint.copy();
  _color.setColor(Skia.Color(color));
  return _color;
};

export const scale = (matrix: SkMatrix, s: number, origin: Vector) => {
  'worklet';
  const source = Skia.Matrix(matrix.get());
  source.translate(origin.x, origin.y);
  source.scale(s, s);
  source.translate(-origin.x, -origin.y);
  return source;
};

export const rotateZ = (matrix: SkMatrix, theta: number, origin: Vector) => {
  'worklet';
  const source = Skia.Matrix(matrix.get());
  source.translate(origin.x, origin.y);
  source.rotate(theta);
  source.translate(-origin.x, -origin.y);
  return source;
};

export const translate = (matrix: SkMatrix, x: number, y: number) => {
  'worklet';
  const m = Skia.Matrix();
  m.translate(x, y);
  m.concat(matrix);
  return m;
};

export const toM4 = (m3: SkMatrix) => {
  'worklet';
  const m = m3.get();
  const tx = m[MatrixIndex.TransX];
  const ty = m[MatrixIndex.TransY];
  const sx = m[MatrixIndex.ScaleX];
  const sy = m[MatrixIndex.ScaleY];
  const skewX = m[MatrixIndex.SkewX];
  const skewY = m[MatrixIndex.SkewY];
  const persp0 = m[MatrixIndex.Persp0];
  const persp1 = m[MatrixIndex.Persp1];
  const persp2 = m[MatrixIndex.Persp2];
  return [
    sx,
    skewY,
    persp0,
    0,
    skewX,
    sy,
    persp1,
    0,
    0,
    0,
    1,
    0,
    tx,
    ty,
    persp2,
    1,
  ];
};

export const makeMatrix = (size: SkSize) => {
  const src = rect(0, 0, size.width, size.height);
  const dst = deflate(rect(0, 0, window.width, window.height), 24);
  const m3 = processTransform2d(fitbox('contain', src, dst));
  const matrix = makeMutable(m3);
  return matrix;
};

export const deflate = (rct: SkRect, amount: number) =>
  rect(
    rct.x + amount,
    rct.y + amount,
    rct.width - amount * 2,
    rct.height - amount * 2,
  );
