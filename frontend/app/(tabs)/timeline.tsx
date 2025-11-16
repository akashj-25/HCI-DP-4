import React, { useState } from 'react';
import {
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    View
} from 'react-native';
import ZoomableScrollView from '../ZoomableScrollView';

// Define TypeScript interfaces
interface TimelineEvent {
  id: number;
  type: 'major' | 'medium' | 'small';
  amount: number;
  description: string;
  date: string;
  category: string;
  importance: number;
}

// Sample timeline data
const timelineData: TimelineEvent[] = [
  // Big events (always visible)
  {
    id: 1,
    type: 'major',
    amount: -1500,
    description: 'Monthly Rent',
    date: '2024-01-01',
    category: 'housing',
    importance: 10
  },
  {
    id: 2,
    type: 'major',
    amount: 3200,
    description: 'Salary Deposit',
    date: '2024-01-15',
    category: 'income',
    importance: 9
  },
  {
    id: 3,
    type: 'major', 
    amount: -450,
    description: 'Car Payment',
    date: '2024-01-05',
    category: 'transportation',
    importance: 8
  },
  // Medium events (visible when medium zoom or closer)
  {
    id: 4,
    type: 'medium',
    amount: -200,
    description: 'Groceries',
    date: '2024-01-08',
    category: 'food',
    importance: 5
  },
  {
    id: 5,
    type: 'medium',
    amount: -120,
    description: 'Utilities',
    date: '2024-01-12',
    category: 'bills',
    importance: 6
  },
  // Small events (only visible when zoomed in)
  {
    id: 6,
    type: 'small',
    amount: -45,
    description: 'Dinner Out',
    date: '2024-01-10',
    category: 'dining',
    importance: 2
  },
  {
    id: 7,
    type: 'small',
    amount: -8,
    description: 'Coffee Shop',
    date: '2024-01-11',
    category: 'dining',
    importance: 1
  },
  {
    id: 8,
    type: 'small',
    amount: -25,
    description: 'Streaming Service',
    date: '2024-01-03',
    category: 'entertainment',
    importance: 3
  }
];

const ZOOM_LEVELS = {
  FAR: 1.0,      // Only major events
  MEDIUM: 1.5,   // Major + medium events  
  CLOSE: 2.0     // All events
};

export default function TimelineScreen() {
  const [currentScale, setCurrentScale] = useState(ZOOM_LEVELS.CLOSE);

  // Get event size based on type
  const getEventSize = (eventType: 'major' | 'medium' | 'small'): number => {
    const baseSizes = {
      major: 140,
      medium: 100,
      small: 80
    };
    
    return baseSizes[eventType];
  };

  // Handle scale change from ZoomableScrollView
  const handleScaleChange = (scale: number) => {
    setCurrentScale(scale);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Financial Timeline</Text>
          <Text style={styles.subtitle}>
            All transactions
          </Text>
        </View>

        {/* Zoomable Timeline Container */}
        <ZoomableScrollView
          minScale={ZOOM_LEVELS.FAR}
          maxScale={ZOOM_LEVELS.CLOSE + 0.5} // Allow a bit more zoom than close level
          style={styles.zoomContainer}
          contentContainerStyle={styles.zoomContentContainer}
        >
          {/* Horizontal Timeline Container */}
          <View style={styles.timelineWrapper}>
            {/* Main Timeline Line */}
            <View style={styles.timelineLine} />
            
            <View style={styles.timelineContainer}>
              {timelineData.map((event) => (
                <View key={event.id} style={styles.timelineItem}>
                  {/* Event dot connected to timeline */}
                  <View style={[
                    styles.timelineDot,
                    { 
                      backgroundColor: event.amount > 0 ? '#10B981' : '#EF4444',
                      width: getEventSize(event.type) / 15,
                      height: getEventSize(event.type) / 15
                    }
                  ]} />
                  
                  {/* Event card */}
                  <View style={[
                    styles.eventCard,
                    { 
                      width: getEventSize(event.type),
                      borderTopColor: event.amount > 0 ? '#10B981' : '#EF4444'
                    }
                  ]}>
                    <View style={styles.eventHeader}>
                      <Text style={styles.eventDescription} numberOfLines={2}>
                        {event.description}
                      </Text>
                      <Text style={[
                        styles.eventAmount,
                        { color: event.amount > 0 ? '#10B981' : '#EF4444' }
                      ]}>
                        {event.amount > 0 ? '+' : ''}${Math.abs(event.amount)}
                      </Text>
                    </View>
                    
                    <View style={styles.eventDetails}>
                      <Text style={styles.eventDate}>{event.date}</Text>
                      <Text style={styles.eventCategory}>{event.category}</Text>
                    </View>
                    
                    {/* Size indicator */}
                    <View style={styles.eventSizeIndicator}>
                      <Text style={styles.eventSizeText}>
                        {event.type === 'major' && 'Major'}
                        {event.type === 'medium' && 'Medium'} 
                        {event.type === 'small' && 'Small'}
                      </Text>
                    </View>
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
    top: 12, // Positioned to align with dots
    height: 3,
    backgroundColor: '#D1D5DB',
    zIndex: 1,
  },
  timelineContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 30,
    paddingHorizontal: 20,
    minWidth: '100%', // Ensure container takes full width
  },
  timelineItem: {
    alignItems: 'center',
    marginRight: 25,
    position: 'relative',
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
});