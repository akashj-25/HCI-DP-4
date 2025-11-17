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

const MIN_SCALE = 1;
const MAX_SCALE = 3;

interface ZoomableScrollViewProps {
  children: React.ReactNode;
  minScale?: number;
  maxScale?: number;
  style?: object;
  contentContainerStyle?: object;
  onScaleChange?: (scale: number) => void;
  isVertical?: boolean;
}

const ZoomableScrollView: React.FC<ZoomableScrollViewProps> = ({
  children,
  minScale = MIN_SCALE,
  maxScale = MAX_SCALE,
  style = {},
  contentContainerStyle = {},
  onScaleChange,
  isVertical = false,
}) => {
  const [scale, setScale] = useState(minScale);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  const animatedScale = useRef(new Animated.Value(minScale)).current;
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

  const zoomInWeb = () => {
    const newScale = Math.min(maxScale, scale + 0.5);
    setScale(newScale);
    onScaleChange?.(newScale);
  };

  const zoomOutWeb = () => {
    const newScale = Math.max(minScale, scale - 0.5);
    setScale(newScale);
    onScaleChange?.(newScale);
    
    if (newScale === minScale) {
      setTranslateX(0);
      setTranslateY(0);
    }
  };

  const resetZoomWeb = () => {
    setScale(minScale);
    setTranslateX(0);
    setTranslateY(0);
    onScaleChange?.(minScale);
  };

  const zoomIn = () => {
    const newScale = Math.min(maxScale, scale + 0.5);
    setScale(newScale);
    updateAnimatedValues(newScale, translateX, translateY);
  };

  const zoomOut = () => {
    const newScale = Math.max(minScale, scale - 0.5);
    setScale(newScale);
    
    if (newScale === minScale) {
      setTranslateX(0);
      setTranslateY(0);
      updateAnimatedValues(newScale, 0, 0);
    } else {
      updateAnimatedValues(newScale, translateX, translateY);
    }
  };

  const resetZoom = () => {
    setScale(minScale);
    setTranslateX(0);
    setTranslateY(0);
    updateAnimatedValues(minScale, 0, 0);
  };

  // Web implementation
  if (Platform.OS !== 'web' && isVertical) {
    return (
      <View style={[styles.container, style]}>
        <View style={styles.mobileControls}>
          <View style={styles.controlGroup}>
            <Button title="+" onPress={zoomIn} />
            <Button title="−" onPress={zoomOut} />
            <Button title="Reset" onPress={resetZoom} />
          </View>
          <Text style={styles.scaleText}>Scale: {scale.toFixed(1)}x</Text>
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

  if (Platform.OS !== 'web') {
    return (
      <View style={[styles.container, style]}>
        <View style={styles.webControls}>
          <View style={styles.controlGroup}>
            <Button title="Zoom In (+)" onPress={zoomInWeb} />
            <Button title="Zoom Out (-)" onPress={zoomOutWeb} />
            <Button title="Reset (1x)" onPress={resetZoomWeb} />
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
              isVertical ? styles.webContent : styles.webContent,
              contentContainerStyle,
              {
                transform: [
                  { translateX: translateX },
                  { translateY: translateY },
                  { scale: scale },
                ],
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

  // Mobile implementation with PanResponder and Animated views
    return (
      <View style={[styles.container, style]}>
        <View style={styles.mobileControls}>
          <View style={styles.controlGroup}>
            <Button title="+" onPress={zoomIn} />
            <Button title="−" onPress={zoomOut} />
            <Button title="Reset" onPress={resetZoom} />
          </View>
          <Text style={styles.scaleText}>Scale: {scale.toFixed(1)}x</Text>
        </View>      <View style={styles.mobileViewport}>
        <Animated.View
          style={[
            isVertical ? styles.mobileContentVertical : styles.mobileContent,
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
  mobileContentVertical: {
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