import type {
  SkMatrix,
  SkPaint,
  SkPath,
  SkSize,
} from '@shopify/react-native-skia';
import type {SharedValue} from 'react-native-reanimated';

export type CurrentPath = {
  path: SkPath;
  paint: SkPaint;
  isEraser?: boolean;
};

export type TextBoxData = {
  text: string;
  matrix: SharedValue<SkMatrix>;
  color: string;
};

export type TextBoxComponentProps = {
  data: TextBoxData;
  index: number;
  onChangeText: (text: string) => void;
  onCrossPress: (index: number) => void;
};

export type PhotoEditorComponentProps = {
  image: string;
  renderControls: (props: EditControlsProps) => JSX.Element;
};

export type EditControlsProps = {
  onUndoPress?: () => void;
  onEraserPress?: () => void;
  onAddTextPress?: () => void;
  onBrushPress?: () => void;
  onDonePress?: () => void;
  setStrokeWidth?: (strokeWidth: number) => void;
  setStrokeColor?: (strokeColor: string) => void;
};

export type GestureHandlerProps = {
  matrix: SharedValue<SkMatrix>;
  size: SkSize;
};

export type ParagraphTextProps = {
  text: string;
  matrix: SharedValue<SkMatrix>;
};
