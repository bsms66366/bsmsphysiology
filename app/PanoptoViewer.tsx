import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import * as WebBrowser from 'expo-web-browser';

interface PanoptoViewerProps {
  url: string;
  title?: string;
}

const PanoptoViewer = ({ url, title }: PanoptoViewerProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('PanoptoViewer mounted with URL:', url);
  }, [url]);

  const handlePress = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Attempting to open Panopto URL:', url);
      
      if (!url.startsWith('https://brighton.cloud.panopto.eu')) {
        throw new Error('Invalid Panopto URL format');
      }

      await WebBrowser.openBrowserAsync(url);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to open video';
      console.error('Error opening video:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity 
        style={[styles.container, error && styles.errorContainer]} 
        onPress={handlePress}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#2196F3" />
        ) : (
          <>
            <Text style={styles.playButton}>▶ Watch Video</Text>
            {title && <Text style={styles.title}>{title}</Text>}
            {error && <Text style={styles.errorText}>{error}</Text>}
            <Text style={styles.urlText}>{url}</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#404040',
    padding: 16,
    borderRadius: 8,
    marginVertical: 16,
    width: '100%',
  },
  container: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    minHeight: 50,
    justifyContent: 'center',
    width: '100%',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
  },
  playButton: {
    fontSize: 18,
    color: '#2196F3',
    fontWeight: '600',
  },
  title: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  errorText: {
    color: '#f44336',
    marginTop: 8,
    fontSize: 12,
    textAlign: 'center',
  },
  urlText: {
    color: '#666',
    marginTop: 8,
    fontSize: 10,
    textAlign: 'center',
  },
});

export default PanoptoViewer;
