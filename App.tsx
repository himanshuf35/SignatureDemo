/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useCallback} from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
  useColorScheme,
  Button,
  TouchableOpacity,
} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Colors} from 'react-native/Libraries/NewAppScreen';
// import {
//   SignatureResult,
//   SignaturePadMethods,
// } from 'react-native-signature-pad-native';
import PhotoEditor from './PhotoEditor';
import {EditControlsProps} from './types';
import {deviceWidth} from './constants';

const colorPalette: string[] = [
  '#a2b9bc',
  '#6b5b95',
  '#b2ad7f',
  '#feb236',
  '#878f99',
  '#d64161',
  '#ff7b25',
  '#86af49',
  '#b9936c',
  '#034f84',
  '#50394c',
  '#80ced6',
];

function App(): React.JSX.Element {
  // const signatureRef = useRef<SignaturePadMethods>(null);
  const isDarkMode = useColorScheme() === 'dark';
  // const [signatureSvg, setSignatureSvg] = React.useState<string>('');
  // const [signatureImage, setSignatureImage] = React.useState<string>('');
  // const [isModalVisible, setIsModalVisible] = React.useState<boolean>(false);
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  // const onDrawingEnd = React.useCallback((result: SignatureResult) => {
  //   setSignatureSvg(result.signaturePathSvg);
  //   setSignatureImage(result.image);
  // }, []);

  // const onClear = React.useCallback(() => {
  //   signatureRef.current?.clear();
  // }, []);
  // const onShowImage = React.useCallback(() => {
  //   setIsModalVisible(true);
  // }, []);

  const renderColors = useCallback(
    (setStrokeColor?: (color: string) => void) => {
      return (
        <View style={styles.rowWrap}>
          {colorPalette.map((color: string) => (
            <TouchableOpacity
              onPress={() => setStrokeColor?.(color)}
              style={[styles.colorCircle, {backgroundColor: color}]}
              key={Math.random().toString()}
            />
          ))}
        </View>
      );
    },
    [],
  );

  const renderControls = useCallback(
    ({
      onBrushPress,
      onAddTextPress,
      onEraserPress,
      onDonePress,
      onUndoPress,
      setStrokeColor,
    }: EditControlsProps) => {
      return (
        <>
          <View
            style={{
              position: 'absolute',
              top: 44,
              width: deviceWidth - 32,
            }}>
            <View style={styles.rowSpaceBetween}>
              <Button title={'Pencil'} onPress={onBrushPress} />
              <Button title={'Eraser'} onPress={onEraserPress} />
              <Button title={'Add text'} onPress={onAddTextPress} />
            </View>
          </View>
          <View
            style={[
              {
                position: 'absolute',
                bottom: 0,
                width: deviceWidth - 32,
              },
            ]}>
            {renderColors(setStrokeColor)}
            <View style={styles.rowSpaceBetween}>
              <Button title={'Undo'} onPress={onUndoPress} />
              <Button title={'Done'} onPress={onDonePress} />
            </View>
          </View>
        </>
      );
    },
    [renderColors],
  );

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      {/* <SafeAreaView style={{flex: 1}}> */}
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <PhotoEditor
        image={
          'https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg'
        }
        renderControls={renderControls}
      />
      {/* <View style={styles.backgroundStyle}>
          <SignaturePad
            ref={signatureRef}
            onDrawingEnd={onDrawingEnd}
            existingSignatureSvg={signatureSvg}
            style={styles.signatureContainer}
          />
        </View>
        <View style={styles.rowSpaceBetween}>
          <Button title={'Clear'} onPress={onClear} />
          <Button title={'Show Image'} onPress={onShowImage} />
        </View>
        <Modal visible={isModalVisible} animationType={'slide'}>
          <SafeAreaView>
            <Button title={'Close'} onPress={() => setIsModalVisible(false)} />
            <Image style={styles.imageStyle} source={{uri: signatureImage}} />
          </SafeAreaView>
        </Modal> */}
      {/* </SafeAreaView> */}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  backgroundStyle: {
    flex: 1,
  },
  rowSpaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 16,
  },
  signatureContainer: {
    height: 300,
    margin: 16,
    backgroundColor: '#F1F4F6',
    borderRadius: 16,
  },
  imageStyle: {
    height: 500,
  },
  rowWrap: {
    marginLeft: 25,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  colorCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    marginHorizontal: 4,
  },
});

export default App;
