import React, { useRef, useState } from 'react';
import { 
  Button, 
  Platform, 
  StyleSheet, 
  Text, 
  View, 
  PanResponder,
  Animated,
  GestureResponderEvent,
  PanResponderGestureState,
  ScrollView
} from 'react-native';

interface ZoomableScrollViewProps {
  children: React.ReactNode;
  minScale?: number;
  maxScale?: number;
  initialScale?: number;
  zoomStep?: number;
  style?: object;
  contentContainerStyle?: object;
  onScaleChange?: (scale: number) => void;
  isVertical?: boolean;
}

const ZoomableScrollView: React.FC<ZoomableScrollViewProps> = ({
  children,
  minScale = 1,
  maxScale = 3,
  initialScale = 1,
  zoomStep = 1.0,
  style = {},
  contentContainerStyle = {},
  onScaleChange,
  isVertical = false,
}) => {
  const [scale, setScale] = useState(initialScale);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  const animatedScale = useRef(new Animated.Value(initialScale)).current;
  const animatedTranslateX = useRef(new Animated.Value(0)).current;
  const animatedTranslateY = useRef(new Animated.Value(0)).current;
  
  const lastTouchX = useRef(0);
  const lastTouchY = useRef(0);
  const gestureX = useRef(0);
  const gestureY = useRef(0);

  const updateAnimatedValues = (newScale: number, newX: number, newY: number) => {
    animatedScale.setValue(newScale);
    animatedTranslateX.setValue(newX);
    animatedTranslateY.setValue(newY);
    onScaleChange?.(newScale);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt: GestureResponderEvent) => {
        setIsDragging(true);
        lastTouchX.current = evt.nativeEvent.pageX;
        lastTouchY.current = evt.nativeEvent.pageY;
        gestureX.current = translateX;
        gestureY.current = translateY;
      },
      onPanResponderMove: (evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        if (scale > minScale) {
          const newX = gestureX.current + gestureState.dx;
          const newY = gestureY.current + gestureState.dy;
          setTranslateX(newX);
          setTranslateY(newY);
          updateAnimatedValues(scale, newX, newY);
        }
      },
      onPanResponderRelease: () => {
        setIsDragging(false);
      },
      onPanResponderTerminate: () => {
        setIsDragging(false);
      },
    })
  ).current;

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
      
      const newX = translateX + deltaX;
      const newY = translateY + deltaY;
      
      setTranslateX(newX);
      setTranslateY(newY);
      
      lastTouchX.current = e.nativeEvent.pageX;
      lastTouchY.current = e.nativeEvent.pageY;
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const zoomIn = () => {
    const newScale = Math.min(maxScale, scale + zoomStep);
    setScale(newScale);
    if (Platform.OS === 'web') {
      onScaleChange?.(newScale);
    } else {
      updateAnimatedValues(newScale, translateX, translateY);
    }
  };

  const zoomOut = () => {
    const newScale = Math.max(minScale, scale - zoomStep);
    setScale(newScale);
    
    if (newScale === minScale) {
      setTranslateX(0);
      setTranslateY(0);
      if (Platform.OS === 'web') {
        onScaleChange?.(newScale);
      } else {
        updateAnimatedValues(newScale, 0, 0);
      }
    } else {
      if (Platform.OS === 'web') {
        onScaleChange?.(newScale);
      } else {
        updateAnimatedValues(newScale, translateX, translateY);
      }
    }
  };

  const resetZoom = () => {
    setScale(minScale);
    setTranslateX(0);
    setTranslateY(0);
    if (Platform.OS === 'web') {
      onScaleChange?.(minScale);
    } else {
      updateAnimatedValues(minScale, 0, 0);
    }
  };

  // Mobile vertical layout (uses ScrollView)
  if (Platform.OS !== 'web' && isVertical) {
    return (
      <View style={[styles.container, style]}>
        <View style={styles.mobileControls}>
          <View style={styles.controlGroup}>
            <Button title="Zoom In" onPress={zoomIn} disabled={scale >= maxScale} />
            <Button title="Zoom Out" onPress={zoomOut} disabled={scale <= minScale} />
            <Button title="Reset" onPress={resetZoom} />
          </View>
          <Text style={styles.scaleText}>Level: {Math.round(scale)}/3</Text>
        </View>

        <ScrollView 
          style={styles.scrollContainer}
          contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
          showsVerticalScrollIndicator={true}
        >
          <Animated.View
            style={[
              {
                transform: [{ scale: animatedScale }],
              }
            ]}
          >
            {children}
          </Animated.View>
        </ScrollView>
      </View>
    );
  }

  // Web implementation
  if (Platform.OS === 'web') {
    return (
      <View style={[styles.container, style]}>
        <View style={styles.webControls}>
          <View style={styles.controlGroup}>
            <Button title="Zoom In" onPress={zoomIn} disabled={scale >= maxScale} />
            <Button title="Zoom Out" onPress={zoomOut} disabled={scale <= minScale} />
            <Button title="Reset" onPress={resetZoom} />
          </View>
          <Text style={styles.scaleText}>Zoom Level: {Math.round(scale)}/3</Text>
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
                minWidth: '200%',
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

  // Mobile horizontal layout with PanResponder
  return (
    <View style={[styles.container, style]}>
      <View style={styles.mobileControls}>
        <View style={styles.controlGroup}>
          <Button title="Zoom In" onPress={zoomIn} disabled={scale >= maxScale} />
          <Button title="Zoom Out" onPress={zoomOut} disabled={scale <= minScale} />
          <Button title="Reset" onPress={resetZoom} />
        </View>
        <Text style={styles.scaleText}>Level: {Math.round(scale)}/3</Text>
      </View>
      
      <View style={styles.mobileViewport}>
        <Animated.View
          style={[
            styles.mobileContent,
            contentContainerStyle,
            {
              transform: [
                { translateX: animatedTranslateX },
                { translateY: animatedTranslateY },
                { scale: animatedScale },
              ],
            }
          ]}
          {...panResponder.panHandlers}
        >
          {children}
        </Animated.View>
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
  mobileControls: {
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
  mobileViewport: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: 'white',
  },
  webContent: {
    width: '100%',
    height: '100%',
    padding: 20,
  },
  mobileContent: {
    width: '100%',
    minHeight: '100%',
    padding: 20,
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 0,
  },
});

export default ZoomableScrollView;