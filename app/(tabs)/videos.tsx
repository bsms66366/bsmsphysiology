import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import PanoptoViewer from '../PanoptoViewer';

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

export default function VideosScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Video Player Test</Text>
      
      {testVideos.map((video, index) => (
        <View key={index} style={styles.videoContainer}>
          <Text style={styles.videoTitle}>{video.title}</Text>
          <PanoptoViewer url={video.url} />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#404040',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
    marginTop: 20,
  },
  videoContainer: {
    marginBottom: 20,
  },
  videoTitle: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 8,
  },
});
