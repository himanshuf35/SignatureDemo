import React, {FunctionComponent, useCallback, useState} from 'react';
import {Image, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Images from './src/assets/images';
import {TextBoxComponentProps} from './types';
import {colors, textBoxSize} from './constants';
import Animated, {useAnimatedStyle} from 'react-native-reanimated';
import {toM4, translate} from './utils';

const TextBox: FunctionComponent<TextBoxComponentProps> = ({
  data: {text, matrix, color},
  onChangeText,
  onCrossPress,
  index,
}) => {
  const [changedText, setText] = useState(text);
  const [isFocused, setFocused] = useState(false);
  const gesture = Gesture.Pan().onChange(event => {
    matrix.value = translate(matrix.value, event.changeX, event.changeY);
  });

  const onChange = useCallback(
    (updatedText: string) => {
      onChangeText(updatedText);
      setText(updatedText);
    },
    [onChangeText],
  );

  const onCrossPressed = useCallback(() => {
    onCrossPress(index);
  }, [index, onCrossPress]);

  const onFocus = useCallback(() => {
    setFocused(true);
  }, []);
  const onBlur = useCallback(() => {
    setFocused(false);
  }, []);

  const style = useAnimatedStyle(() => ({
    position: 'absolute',
    width: textBoxSize.width,
    backgroundColor: isFocused ? colors.textBackgroundColor : 'transparent',
    top: 0,
    left: 0,
    transform: [
      {
        translateX: -textBoxSize.width / 2,
      },
      {matrix: toM4(matrix.value)},
      {
        translateX: textBoxSize.width / 2,
      },
    ],
  }));
  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={style}>
        <TouchableOpacity onPress={onCrossPressed}>
          <Image source={Images.close} style={styles.crossIcon} />
        </TouchableOpacity>
        <TextInput
          scrollEnabled={false}
          onFocus={onFocus}
          onBlur={onBlur}
          autoFocus={!text}
          placeholder="Enter text here"
          selectionColor={color}
          multiline={true}
          style={[{color: color}, styles.text]}
          placeholderTextColor={colors.white}
          onChangeText={onChange}>
          {changedText}
        </TextInput>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 30,
  },
  crossIcon: {
    height: 30,
    width: 30,
    position: 'absolute',
    top: -15,
    right: -15,
  },
});

export default TextBox;
