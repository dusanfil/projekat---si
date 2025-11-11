import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');


type LoadingProps = {
    text?:string;
};

const Loading:React.FC<LoadingProps> = ({text = ''}) => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.center}>
      <Text style={styles.text}>Ucitavanje {text}</Text>
      <Text style={styles.text}>{dots}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 35,
    fontWeight: '400',
    color:'#fff',
    //width:360,
  },
});

export default Loading;
