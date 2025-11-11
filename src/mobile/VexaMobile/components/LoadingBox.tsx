import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";

export default function LoadingBox() {
  return (
    <View style={styles.container}>
      <ActivityIndicator color="#0000ff" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width:200,
    height:200,
    backgroundColor: "#f0f0f0",
  }
});