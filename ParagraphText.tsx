import {FunctionComponent, useMemo} from 'react';
import React from 'react';
import {Paragraph, Skia, useFonts} from '@shopify/react-native-skia';
import {ParagraphTextProps} from './types';
import {textBoxSize} from './constants';

const ParagraphText: FunctionComponent<ParagraphTextProps> = ({
  text,
  matrix,
  color,
}) => {
  const customFontMgr = useFonts({
    Inter: [
      require('./src/assets/fonts/Inter-Regular.ttf'),
      require('./src/assets/fonts/Inter-Medium.ttf'),
      require('./src/assets/fonts/Inter-SemiBold.ttf'),
      require('./src/assets/fonts/Inter-Bold.ttf'),
    ],
  });

  const paragraph = useMemo(() => {
    if (!customFontMgr) {
      return null;
    }
    const textStyle = {
      color: Skia.Color(color),
      fontFamilies: ['Inter'],
      fontSize: 28,
    };
    return Skia.ParagraphBuilder.Make({}, customFontMgr)
      .pushStyle(textStyle)
      .addText(text)
      .build();
  }, [color, customFontMgr, text]);

  return (
    <Paragraph
      paragraph={paragraph}
      x={0}
      y={0}
      width={textBoxSize.width}
      matrix={matrix}
    />
  );
};

export default React.memo(ParagraphText);
