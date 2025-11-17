import { router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Dimensions,
    Platform
} from 'react-native';
import ZoomableScrollView from '../ZoomableScrollView';

interface TimelineEvent {
  id: number;
  type: 'major' | 'medium' | 'small';
  amount: number;
  description: string;
  date: string;
  category: string;
  importance: number;
}

const timelineData: TimelineEvent[] = [
  {
    id: 1,
    type: 'major',
    amount: 3500,
    description: 'Salary Deposit',
    date: 'Nov 15',
    category: 'income',
    importance: 10
  },
  {
    id: 2,
    type: 'major', 
    amount: -1200,
    description: 'Rent Payment',
    date: 'Nov 1',
    category: 'housing',
    importance: 9
  },
  {
    id: 3,
    type: 'medium',
    amount: 300,
    description: 'Goal Contribution',
    date: 'Oct 28',
    category: 'savings',
    importance: 8
  },
  {
    id: 4,
    type: 'medium',
    amount: -450,
    description: 'Car Payment',
    date: 'Oct 15',
    category: 'transportation',
    importance: 7
  },
  {
    id: 5,
    type: 'medium',
    amount: -200,
    description: 'Groceries',
    date: 'Oct 10',
    category: 'food',
    importance: 6
  },
  {
    id: 6,
    type: 'small',
    amount: -120,
    description: 'Utilities',
    date: 'Oct 5',
    category: 'bills',
    importance: 5
  },
  {
    id: 7,
    type: 'small',
    amount: -45,
    description: 'Dinner Out',
    date: 'Oct 1',
    category: 'dining',
    importance: 2
  },
  {
    id: 8,
    type: 'small',
    amount: -25,
    description: 'Streaming Service',
    date: 'Sep 28',
    category: 'entertainment',
    importance: 3
  }
];

const ZOOM_LEVELS = {
  FAR: 1.0,
  MEDIUM: 1.5,
  CLOSE: 2.0
};

export default function TimelineScreen() {
  const [currentScale, setCurrentScale] = useState(ZOOM_LEVELS.CLOSE);
  const [screenData, setScreenData] = useState(Dimensions.get('window'));
  const [events, setEvents] = useState<TimelineEvent[]>(timelineData);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenData(window);
    });
    return () => subscription?.remove();
  }, []);

  useEffect(() => {
    (global as any).addNewEvent = (newEvent: TimelineEvent) => {
      setEvents(prevEvents => {
        const updatedEvents = [...prevEvents, newEvent];
        return updatedEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      });
    };

    return () => {
      delete (global as any).addNewEvent;
    };
  }, []);

  const handleAddEvent = () => {
    router.push('/add-event-modal' as any);
  };

  const isMobile = Platform.OS !== 'web' || screenData.width < 768;
  const isVerticalLayout = isMobile;

  const getVisibleEvents = (scale: number): TimelineEvent[] => {
    if (scale <= ZOOM_LEVELS.FAR) {
      return events.filter(event => event.type === 'major');
    } else if (scale <= ZOOM_LEVELS.MEDIUM) {
      return events.filter(event => event.type === 'major' || event.type === 'medium');
    } else {
      return events;
    }
  };

  const getEventSize = (eventType: 'major' | 'medium' | 'small', scale: number): number => {
    const baseSizes = {
      major: isMobile ? 120 : 140,
      medium: isMobile ? 90 : 100,
      small: isMobile ? 70 : 80
    };
    
    const scaleFactor = Math.max(0.8, Math.min(1.2, scale / ZOOM_LEVELS.MEDIUM));
    return Math.round(baseSizes[eventType] * scaleFactor);
  };

  const visibleEvents = getVisibleEvents(currentScale);

  const handleScaleChange = (scale: number) => {
    setCurrentScale(scale);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.content}>
        {/* Header */}
        <View style={isVerticalLayout ? styles.headerVertical : styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>Timeline</Text>
            {!isVerticalLayout && (
              <Text style={styles.subtitle}>
                {currentScale <= ZOOM_LEVELS.FAR && 'Showing major transactions only'}
                {currentScale > ZOOM_LEVELS.FAR && currentScale <= ZOOM_LEVELS.MEDIUM && 'Showing major & medium transactions'}
                {currentScale > ZOOM_LEVELS.MEDIUM && 'Showing all transactions'}
                {' '}({visibleEvents.length} events)
              </Text>
            )}
          </View>
          {isVerticalLayout && (
            <TouchableOpacity onPress={handleAddEvent}>
              <Text style={styles.addEventButton}>Add Event</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Zoomable Timeline Container */}
        <ZoomableScrollView
          minScale={ZOOM_LEVELS.FAR}
          maxScale={ZOOM_LEVELS.CLOSE + 0.5}
          style={styles.zoomContainer}
          contentContainerStyle={[
            styles.zoomContentContainer,
            isVerticalLayout && { minHeight: visibleEvents.length * 150 + 200 }
          ]}
          onScaleChange={handleScaleChange}
          isVertical={isVerticalLayout}
        >
          <View style={isVerticalLayout ? styles.timelineWrapperVertical : styles.timelineWrapper}>
            <View style={isVerticalLayout ? styles.timelineLineVertical : styles.timelineLine} />
            
            <View style={isVerticalLayout ? styles.timelineContainerVertical : styles.timelineContainer}>
              {visibleEvents.map((event) => (
                <View key={event.id} style={isVerticalLayout ? styles.timelineItemVertical : styles.timelineItem}>
                  <View style={[
                    styles.timelineDot,
                    isVerticalLayout && {
                      position: 'absolute',
                      left: -28,
                      top: 8,
                      backgroundColor: event.amount > 0 ? '#10B981' : '#EF4444',
                      width: 12,
                      height: 12,
                      zIndex: 2,
                    },
                    !isVerticalLayout && { 
                      backgroundColor: event.amount > 0 ? '#10B981' : '#EF4444',
                      width: getEventSize(event.type, currentScale) / 15,
                      height: getEventSize(event.type, currentScale) / 15
                    }
                  ]} />
                  
                  <View style={[
                    styles.eventCard,
                    isVerticalLayout && styles.eventCardVertical,
                    { 
                      width: isVerticalLayout ? screenData.width * 0.8 : getEventSize(event.type, currentScale),
                      borderTopColor: event.amount > 0 ? '#10B981' : '#EF4444'
                    }
                  ]}>
                    <View style={styles.eventHeader}>
                      <Text style={[
                        styles.eventDescription,
                        isVerticalLayout && { fontSize: 16, fontWeight: '600' }
                      ]} numberOfLines={isVerticalLayout ? 1 : 2}>
                        {event.description}
                      </Text>
                      <Text style={[
                        styles.eventAmount,
                        isVerticalLayout && { fontSize: 18, fontWeight: '700' },
                        { color: event.amount > 0 ? '#10B981' : '#EF4444' }
                      ]}>
                        {event.amount > 0 ? '+' : ''}${Math.abs(event.amount)}
                      </Text>
                    </View>
                    
                    {isVerticalLayout && (
                      <Text style={styles.eventDescriptionSubtitle}>
                        Monthly {event.amount > 0 ? 'income received' : event.category + ' expense'}
                      </Text>
                    )}
                    
                    <View style={[
                      styles.eventDetails,
                      isVerticalLayout && { justifyContent: 'flex-end', marginTop: 8 }
                    ]}>
                      <Text style={[
                        styles.eventDate,
                        isVerticalLayout && { fontSize: 14, color: '#9CA3AF' }
                      ]}>{event.date}</Text>
                      {!isVerticalLayout && (
                        <Text style={styles.eventCategory}>{event.category}</Text>
                      )}
                    </View>
                    
                    {!isVerticalLayout && (
                      <View style={styles.eventSizeIndicator}>
                        <Text style={styles.eventSizeText}>
                          {event.type === 'major' && 'Major'}
                          {event.type === 'medium' && 'Medium'} 
                          {event.type === 'small' && 'Small'}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              ))}
            </View>
          </View>
        </ZoomableScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  zoomContainer: {
    flex: 1,
    borderWidth: 0,
  },
  zoomContentContainer: {
    flexGrow: 1,
  },
  timelineWrapper: {
    flex: 1,
    position: 'relative',
    marginTop: 40,
    minHeight: 300, 
  },
  timelineLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 12,
    height: 3,
    backgroundColor: '#D1D5DB',
    zIndex: 1,
  },
  timelineContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 30,
    paddingHorizontal: 20,
    minWidth: '200%',
  },
  timelineItem: {
    alignItems: 'center',
    marginRight: 25,
    position: 'relative',
    minWidth: 100,
  },
  timelineDot: {
    borderRadius: 50,
    zIndex: 2,
    marginBottom: 10,
  },
  eventCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderTopWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 100,
  },
  eventHeader: {
    marginBottom: 6,
  },
  eventDescription: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  eventAmount: {
    fontSize: 16,
    fontWeight: '700',
  },
  eventDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  eventDate: {
    fontSize: 9,
    color: '#6B7280',
  },
  eventCategory: {
    fontSize: 11,
    color: '#6B7280',
    textTransform: 'capitalize',
  },
  eventSizeIndicator: {
    alignSelf: 'flex-start',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  eventSizeText: {
    fontSize: 9,
    fontWeight: '500',
    color: '#6B7280',
  },
  timelineWrapperVertical: {
    flex: 1,
    position: 'relative',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  timelineLineVertical: {
    position: 'absolute',
    left: 50,
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: '#E5E7EB',
    zIndex: 1,
  },
  timelineContainerVertical: {
    flexDirection: 'column',
    paddingLeft: 20,
    paddingTop: 20,
    paddingBottom: 100,
  },
  timelineItemVertical: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 30,
    position: 'relative',
    paddingLeft: 40,
  },
  eventCardVertical: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginLeft: 15,
    flex: 1,
  },
  eventDescriptionSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
    marginBottom: 4,
  },
  headerVertical: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 0,
  },
  headerLeft: {
    flex: 1,
  },
  addEventButton: {
    fontSize: 16,
    color: '#3B82F6',
    fontWeight: '500',
  },
});