import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import PanoptoViewer from '../PanoptoViewer';
import { useFontSize } from '../../context/FontSizeContext';

const testVideos = [
  {
    title: 'Panopto Video Example',
    url: 'https://brighton.cloud.panopto.eu/Panopto/Pages/Viewer.aspx?id=77904e14-2362-495f-acce-ae9e00a8cb82'
  },
  {
    title: 'YouTube Video Example',
    url: 'https://youtu.be/OzLoUCCASwM?si=fLRShWwtgyuxv_VH'
  }
];

export default function VideoTestScreen() {
  const { fontSize } = useFontSize();

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={[styles.header, { fontSize: fontSize * 1.5 }]}>Video Player Test</Text>
        
        {testVideos.map((video, index) => (
          <View key={index} style={styles.videoContainer}>
            <Text style={[styles.videoTitle, { fontSize }]}>{video.title}</Text>
            <PanoptoViewer url={video.url} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#404040',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
    marginTop: 20,
  },
  videoContainer: {
    marginBottom: 20,
  },
  videoTitle: {
    color: '#ffffff',
    marginBottom: 8,
  },
});
