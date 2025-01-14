import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import * as WebBrowser from 'expo-web-browser';

interface PanoptoViewerProps {
  videoUrl: string;
  title?: string;
}

export const PanoptoViewer: React.FC<PanoptoViewerProps> = ({ videoUrl, title }) => {
  const handlePress = async () => {
    try {
      await WebBrowser.openBrowserAsync(videoUrl);
    } catch (error) {
      console.error('Error opening video:', error);
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <Text style={styles.playButton}>▶ Play Video</Text>
      {title && <Text style={styles.title}>{title}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    marginVertical: 8,
    alignItems: 'center',
  },
  playButton: {
    fontSize: 16,
    color: '#2196F3',
    fontWeight: '600',
  },
  title: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
