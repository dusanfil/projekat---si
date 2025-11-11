import React from "react";
import { View, Dimensions, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { WebView } from "react-native-webview";

export default function MapWebView({ selectedLokacije, podrucja, dani, odabranDanIndex, mainLokacijePodrucja }) {
  if (!selectedLokacije?.length || !dani?.length) return null;

  const center = selectedLokacije[0];

  // Generate JS for polygons
  const polygonsJS = podrucja
    .filter(p => p.danId === dani[odabranDanIndex].id)
    .map(p => {
      const coords = p.koordinate.map(([lat, lon]) => `[${lat}, ${lon}]`).join(",");
      return `L.polygon([${coords}], {color: 'red', fillColor: 'rgba(255,0,0,0.2)', weight: 1}).addTo(map);`;
    })
    .join("\n");

  // Generate JS for markers
  const markersJS = [
    ...mainLokacijePodrucja
      .filter(lok => podrucja.some(p => p.lokacije.includes(lok.id) && p.danId === dani[odabranDanIndex].id))
      .map(lok => `L.marker([${lok.xKoordinata}, ${lok.yKoordinata}]).addTo(map).bindPopup("${lok.naziv}");`),
    ...selectedLokacije.map(lok => `L.marker([${lok.xKoordinata}, ${lok.yKoordinata}], {icon: L.icon({iconUrl: "https://maps.gstatic.com/mapfiles/ms2/micons/pink-dot.png", iconSize: [32,32]})}).addTo(map);`)
  ].join("\n");

  const html = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
      <style>html, body, #map { height: 100%; margin: 0; padding: 0; }</style>
    </head>
    <body>
      <div id="map"></div>
      <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
      <script>
        const map = L.map('map').setView([${center.xKoordinata}, ${center.yKoordinata}], 15);
        L.tileLayer('https://a.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
        ${polygonsJS}
        ${markersJS}
      </script>
    </body>
  </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        scrollEnabled={false}
        originWhitelist={['*']}
        source={{ html }}
        style={{ flex: 1 }}

      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: 600, // adjust as needed
  },
});