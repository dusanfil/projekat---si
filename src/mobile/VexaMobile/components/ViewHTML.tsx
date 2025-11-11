import React from 'react';
import { ScrollView, useWindowDimensions } from 'react-native';
import RenderHtml from 'react-native-render-html';


export default function ViewHTML({ description }: { description: string }) {
  const { width } = useWindowDimensions();

  return (
    <ScrollView style={{ flex: 1 }}>
      <RenderHtml
        contentWidth={width}
        source={{ html: description }}
        tagsStyles={{p:{color:'white'},body:{color:'white'}}}
      />
    </ScrollView>
  );
}
