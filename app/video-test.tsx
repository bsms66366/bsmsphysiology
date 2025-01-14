import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import PanoptoViewer from './PanoptoViewer';
import { useFontSize } from '../context/FontSizeContext';

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
  const router = useRouter();
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

      <Pressable
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Text style={[styles.backButtonText, { fontSize }]}>Back to Home</Text>
      </Pressable>
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
  backButton: {
    backgroundColor: '#00679A',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});
