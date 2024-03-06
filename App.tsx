/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useCallback, useRef} from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
  useColorScheme,
  Button,
  SafeAreaView,
  Image,
  Modal,
} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import SignaturePad, {
  SignatureResult,
  SignaturePadMethods,
} from 'react-native-signature-pad-native';
import PhotoEditor from './PhotoEditor';
import {EditControlsProps} from './types';
import {deviceWidth} from './constants';

function App(): React.JSX.Element {
  const signatureRef = useRef<SignaturePadMethods>(null);
  const isDarkMode = useColorScheme() === 'dark';
  const [signatureSvg, setSignatureSvg] = React.useState<string>('');
  const [signatureImage, setSignatureImage] = React.useState<string>('');
  const [isModalVisible, setIsModalVisible] = React.useState<boolean>(false);
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const onDrawingEnd = React.useCallback((result: SignatureResult) => {
    setSignatureSvg(result.signaturePathSvg);
    setSignatureImage(result.image);
  }, []);

  const onClear = React.useCallback(() => {
    signatureRef.current?.clear();
  }, []);
  const onShowImage = React.useCallback(() => {
    setIsModalVisible(true);
  }, []);

  const renderControls = useCallback(
    ({
      onBrushPress,
      onAddTextPress,
      onUndoPress,
      onEraserPress,
      onDonePress,
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
            <View style={styles.rowSpaceBetween}>
              <Button title={'Undo'} onPress={onUndoPress} />
              <Button title={'Done'} onPress={onDonePress} />
            </View>
          </View>
        </>
      );
    },
    [],
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
});

export default App;
