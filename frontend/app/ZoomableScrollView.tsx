// ZoomableScrollView.tsx - Simplified web version
import React, { useRef, useState } from 'react';
import { Button, Dimensions, Platform, StyleSheet, Text, View } from 'react-native';

const MIN_SCALE = 1;
const MAX_SCALE = 3;

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface ZoomableScrollViewProps {
  children: React.ReactNode;
  minScale?: number;
  maxScale?: number;
  style?: object;
  contentContainerStyle?: object;
}

const ZoomableScrollView: React.FC<ZoomableScrollViewProps> = ({
  children,
  minScale = MIN_SCALE,
  maxScale = MAX_SCALE,
  style = {},
  contentContainerStyle = {},
}) => {
  const [scale, setScale] = useState(minScale);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const lastTouchX = useRef(0);
  const lastTouchY = useRef(0);

  // Web-specific panning implementation
  const handleTouchStart = (e: any) => {
    if (scale > minScale) {
      setIsDragging(true);
      lastTouchX.current = e.nativeEvent.pageX;
      lastTouchY.current = e.nativeEvent.pageY;
    }
  };

  const handleTouchMove = (e: any) => {
    if (isDragging && scale > minScale) {
      const deltaX = e.nativeEvent.pageX - lastTouchX.current;
      const deltaY = e.nativeEvent.pageY - lastTouchY.current;
      
      setTranslateX(prev => prev + deltaX);
      setTranslateY(prev => prev + deltaY);
      
      lastTouchX.current = e.nativeEvent.pageX;
      lastTouchY.current = e.nativeEvent.pageY;
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const zoomIn = () => {
    setScale(prev => Math.min(maxScale, prev + 0.5));
  };

  const zoomOut = () => {
    const newScale = Math.max(minScale, scale - 0.5);
    setScale(newScale);
    // Reset position if zooming out to minimum
    if (newScale === minScale) {
      setTranslateX(0);
      setTranslateY(0);
    }
  };

  const resetZoom = () => {
    setScale(minScale);
    setTranslateX(0);
    setTranslateY(0);
  };

  // Web implementation with direct transform styles
  if (Platform.OS === 'web') {
    return (
      <View style={[styles.container, style]}>
        {/* Web Test Controls */}
        <View style={styles.webControls}>
          <View style={styles.controlGroup}>
            <Button title="Zoom In (+)" onPress={zoomIn} />
            <Button title="Zoom Out (-)" onPress={zoomOut} />
            <Button title="Reset (1x)" onPress={resetZoom} />
          </View>
          <Text style={styles.scaleText}>Current Scale: {scale.toFixed(1)}x</Text>
        </View>

        <View 
          style={styles.webViewport}
          onStartShouldSetResponder={() => true}
          onMoveShouldSetResponder={() => true}
          onResponderMove={handleTouchMove}
          onResponderRelease={handleTouchEnd}
          onResponderTerminate={handleTouchEnd}
        >
          <View 
            style={[
              styles.webContent,
              contentContainerStyle,
              {
                transform: [
                  { translateX: translateX },
                  { translateY: translateY },
                  { scale: scale },
                ],
                // Ensure content is large enough for timeline
                minWidth: scale > 1 ? '200%' : '100%',
                cursor: isDragging ? 'grabbing' : (scale > minScale ? 'grab' : 'default'),
              }
            ]}
            onStartShouldSetResponder={() => true}
            onResponderGrant={handleTouchStart}
          >
            {children}
          </View>
        </View>
      </View>
    );
  }

  // Native implementation (simplified)
  return (
    <View style={[styles.container, style]}>
      <View style={[styles.content, contentContainerStyle]}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: 'white',
  },
  webControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  controlGroup: {
    flexDirection: 'row',
    gap: 10,
  },
  scaleText: {
    fontWeight: 'bold',
    color: '#007AFF',
    fontSize: 14,
  },
  webViewport: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: 'white',
  },
  webContent: {
    width: '100%',
    height: '100%',
    padding: 20,
  },
  content: {
    flex: 1,
    padding: 20,
  },
});

export default ZoomableScrollView;