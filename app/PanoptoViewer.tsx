import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View, Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';

interface PanoptoViewerProps {
  url: string;
  title?: string;
}

const PanoptoViewer = ({ url, title }: PanoptoViewerProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('[PanoptoViewer] Mounted with URL:', url);
  }, [url]);

  const handlePress = async () => {
    try {
      console.log('[PanoptoViewer] Starting to open URL');
      console.log('[PanoptoViewer] URL type:', typeof url);
      console.log('[PanoptoViewer] URL length:', url?.length);
      console.log('[PanoptoViewer] Opening URL:', url);
      setLoading(true);
      setError(null);
      
      if (!url) {
        throw new Error('No URL provided');
      }

      // Handle different video types
      if (url.includes('brighton.cloud.panopto.eu')) {
        if (!url.startsWith('https://brighton.cloud.panopto.eu')) {
          throw new Error('Invalid Panopto URL format');
        }
      } else if (url.includes('youtu.be') || url.includes('youtube.com')) {
        if (!url.startsWith('https://')) {
          throw new Error('Invalid YouTube URL format');
        }
      } else {
        throw new Error('Unsupported video URL format');
      }

      const result = await WebBrowser.openBrowserAsync(url);
      console.log('[PanoptoViewer] Browser result:', result);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to open video';
      console.error('[PanoptoViewer] Error:', errorMessage);
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.container, error && styles.errorContainer]} 
      onPress={handlePress}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator size="large" color="#2196F3" />
      ) : (
        <View style={styles.content}>
          <Text style={styles.playIcon}>▶</Text>
          <View style={styles.textContainer}>
            <Text style={styles.playButton}>
              {url.includes('youtube.com') || url.includes('youtu.be') 
                ? 'Watch on YouTube'
                : 'Watch on Panopto'}
            </Text>
            {error && <Text style={styles.errorText}>{error}</Text>}
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    width: '100%',
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  playIcon: {
    fontSize: 24,
    color: '#2196F3',
    marginRight: 8,
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    borderColor: '#f44336',
  },
  playButton: {
    fontSize: 16,
    color: '#2196F3',
    fontWeight: '600',
  },
  errorText: {
    color: '#f44336',
    marginTop: 4,
    fontSize: 12,
  },
});

export default PanoptoViewer;
