import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  FunctionComponent,
} from 'react';
import {StyleSheet, Image as NativeImage} from 'react-native';
import {
  Canvas,
  Image,
  useImage,
  useTouchHandler,
  Skia,
  Path,
  useCanvasRef,
} from '@shopify/react-native-skia';
import type {
  CurrentPath,
  PhotoEditorComponentProps,
  TextBoxData,
} from './types';
import {getPaint, makeMatrix} from './utils';
import TextBox from './TextBox';
import {
  textBoxSize,
  deviceHeight,
  deviceWidth,
  colors,
  eraserStrokeWidth,
} from './constants';
import ParagraphText from './ParagraphText';

enum EditModes {
  brush = 1,
  text = 2,
}

const PhotoEditor: FunctionComponent<PhotoEditorComponentProps> = ({
  image,
  renderControls = null,
}) => {
  const parsedImage = useImage(image);
  const touchState = useRef(false);
  const photoCanvasRef = useCanvasRef();
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [strokeColor, setStrokeColor] = useState(colors.white);
  const [completedPaths, setCompletedPaths] = useState<CurrentPath[]>([
    {
      path: Skia.Path.Make(),
      paint: getPaint(strokeWidth, strokeColor),
    },
  ]);
  const [texts, setTexts] = useState<TextBoxData[]>([]);
  const [editMode, setEditMode] = useState<number | undefined>();
  const [eraserEnabled, setEraserEnabled] = useState(false);

  useEffect(() => {
    !editMode && setEraserEnabled(false);
  }, [editMode]);

  const addTextBox = useCallback((currentStroke: string) => {
    const newTextBox: TextBoxData = {
      text: '',
      matrix: makeMatrix(textBoxSize),
      color: currentStroke,
    };
    setTexts(prev => [...prev, newTextBox]);
  }, []);

  const onBrushPress = useCallback(() => {
    const currentPath = completedPaths[completedPaths.length - 1];
    currentPath.isEraser = false;
    currentPath.paint = getPaint(strokeWidth, strokeColor);
    currentPath.path.reset();
    setEraserEnabled(false);
    setCompletedPaths(prev => [...prev]);
    setEditMode(EditModes.brush);
  }, [completedPaths, strokeColor, strokeWidth]);

  const onAddTextPress = useCallback(() => {
    setEditMode(EditModes.text);
    (!texts.length || texts[texts.length - 1]?.text) && addTextBox(strokeColor);
  }, [addTextBox, strokeColor, texts]);

  const undoPaths = useCallback((prevPaths: CurrentPath[]) => {
    prevPaths[prevPaths?.length - 2]?.path.reset();
    prevPaths.splice(prevPaths?.length - 2, 1);
    setCompletedPaths([...prevPaths]);
  }, []);

  const undoText = useCallback(() => {
    texts.pop();
    setTexts([...texts]);
  }, [texts]);

  const onUndoPress = useCallback(() => {
    editMode === EditModes.brush ? undoPaths(completedPaths) : undoText();
  }, [completedPaths, editMode, undoPaths, undoText]);

  const onDonePress = useCallback(() => {
    setEditMode(undefined);
  }, []);

  const onTextBoxCrossPress = useCallback((index: number) => {
    setTexts(prev => {
      prev.splice(index, 1);
      return [...prev];
    });
  }, []);

  const onEraserPress = useCallback(() => {
    const currentPath = completedPaths[completedPaths.length - 1];
    currentPath.isEraser = true;
    currentPath.paint = getPaint(eraserStrokeWidth, 'transparent');
    setCompletedPaths(prev => [...prev]);
    setEraserEnabled(!eraserEnabled);
  }, [completedPaths, eraserEnabled]);

  const onChangeText = useCallback(
    (texBoxData: TextBoxData) => (text: string) => {
      texBoxData.text = text;
    },
    [],
  );

  const updatePaths = useCallback(
    (prevPaths: CurrentPath[], newPath: CurrentPath) => {
      prevPaths.push(newPath);
      setCompletedPaths([...completedPaths]);
    },
    [completedPaths],
  );

  const onDrawingStart = useCallback(
    (touchInfo: {x: number; y: number}) => {
      const currentPath = completedPaths[completedPaths.length - 1];
      const {x, y} = touchInfo;
      touchState.current = true;
      currentPath?.path?.moveTo(x, y);
    },
    [completedPaths],
  );

  const onDrawingActive = useCallback(
    (touchInfo: {x: number; y: number}) => {
      const currentPath = completedPaths[completedPaths.length - 1];
      if (touchState.current) {
        const {x, y} = touchInfo;
        currentPath.path.lineTo(x, y);
      }
    },
    [completedPaths],
  );

  const onDrawingFinished = useCallback(() => {
    const newPath = {
      path: Skia.Path.Make(),
      paint: eraserEnabled
        ? getPaint(eraserStrokeWidth, 'transparent')
        : getPaint(strokeWidth, strokeColor),
      isEraser: eraserEnabled,
    };
    updatePaths(completedPaths, newPath);
    touchState.current = false;
  }, [completedPaths, eraserEnabled, strokeColor, strokeWidth, updatePaths]);

  const pencilTouchHandler = useTouchHandler(
    {
      onActive: onDrawingActive,
      onStart: onDrawingStart,
      onEnd: onDrawingFinished,
    },
    [completedPaths, eraserEnabled],
  );

  return (
    <>
      <NativeImage source={{uri: image}} style={[styles.nativeImage]} />
      <Canvas
        onTouch={editMode === EditModes.brush ? pencilTouchHandler : undefined}
        ref={photoCanvasRef}
        style={styles.flex1}>
        {!editMode && (
          <Image
            x={0}
            y={0}
            height={deviceHeight}
            width={deviceWidth}
            image={parsedImage}
            fit={'cover'}
          />
        )}
        {completedPaths?.map((path, index) => {
          if (path.isEraser) {
            return (
              <Path
                key={index}
                path={path.path}
                strokeWidth={eraserStrokeWidth}
                style={'stroke'}
                blendMode={'clear'}
              />
            );
          }
          return <Path key={index} path={path.path} paint={path.paint} />;
        })}
        {(!editMode || editMode === EditModes.brush) &&
          texts?.map(({text, matrix}, index) => (
            <ParagraphText key={text + index} text={text} matrix={matrix} />
          ))}
      </Canvas>
      {editMode === EditModes.text &&
        texts?.map((texBoxData, index) => (
          <TextBox
            key={texBoxData?.text ?? '' + index}
            data={texBoxData}
            onChangeText={onChangeText(texBoxData)}
            index={index}
            onCrossPress={onTextBoxCrossPress}
          />
        ))}
      {renderControls &&
        renderControls({
          setStrokeWidth,
          setStrokeColor,
          onAddTextPress,
          onBrushPress,
          onEraserPress,
          onUndoPress,
          onDonePress,
        })}
    </>
  );
};

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  rowSpaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nativeImage: {
    position: 'absolute',
    height: deviceHeight,
    width: deviceWidth,
    zIndex: 0,
  },
});

export default PhotoEditor;
