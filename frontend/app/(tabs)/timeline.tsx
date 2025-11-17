import { router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Dimensions,
    Platform,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface TimelineEvent {
  id: number;
  type: 'major' | 'medium' | 'small';
  amount: number;
  description: string;
  date: string;
  category: string;
  importance: number;
  isWhatIf?: boolean;
  whatIfScenario?: string;
}

const timelineData: TimelineEvent[] = [
  {
    id: 1,
    type: 'major',
    amount: 3500,
    description: 'Salary Deposit',
    date: '2024-11-15',
    category: 'income',
    importance: 10
  },
  {
    id: 2,
    type: 'major', 
    amount: -1200,
    description: 'Rent Payment',
    date: '2024-12-01',
    category: 'housing',
    importance: 9
  },
  {
    id: 3,
    type: 'medium',
    amount: 300,
    description: 'Goal Contribution',
    date: '2024-11-28',
    category: 'savings',
    importance: 8
  },
  {
    id: 4,
    type: 'medium',
    amount: -450,
    description: 'Car Payment',
    date: '2024-12-15',
    category: 'transportation',
    importance: 7
  },
  {
    id: 5,
    type: 'medium',
    amount: -200,
    description: 'Groceries',
    date: '2024-11-20',
    category: 'food',
    importance: 6
  },
  // What-If Scenarios (hardcoded)
  {
    id: 101,
    type: 'major',
    amount: -3500,
    description: 'WHAT-IF: Missed Paycheck',
    date: '2024-12-15',
    category: 'what-if',
    importance: 10,
    isWhatIf: true,
    whatIfScenario: 'What if I miss one paycheck?'
  },
  {
    id: 102,
    type: 'small',
    amount: -50,
    description: 'WHAT-IF: Extra Weekend Spending',
    date: '2024-11-23',
    category: 'what-if',
    importance: 3,
    isWhatIf: true,
    whatIfScenario: 'What if I spend $50 more this weekend?'
  }
];

export default function TimelineScreen() {
  const [screenData, setScreenData] = useState(Dimensions.get('window'));
  const [events, setEvents] = useState<TimelineEvent[]>(
    timelineData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  );
  const [showWhatIf, setShowWhatIf] = useState(true);

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

    (global as any).updateEvent = (updatedEvent: TimelineEvent) => {
      setEvents(prevEvents => {
        const updatedEvents = prevEvents.map(event => 
          event.id === updatedEvent.id ? updatedEvent : event
        );
        return updatedEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      });
    };

    return () => {
      delete (global as any).addNewEvent;
      delete (global as any).updateEvent;
    };
  }, []);

  const handleAddEvent = () => {
    router.push('/add-event-modal' as any);
  };

  const handleEditEvent = (event: TimelineEvent) => {
    router.push({
      pathname: '/edit-event-modal',
      params: { eventData: JSON.stringify(event) }
    } as any);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const moveEventBack = (eventId: number) => {
    setEvents(prevEvents => {
      const updatedEvents = prevEvents.map(event => {
        if (event.id === eventId) {
          const currentDate = new Date(event.date);
          currentDate.setDate(currentDate.getDate() - 1);
          const newDate = currentDate.toISOString().split('T')[0];
          return { ...event, date: newDate };
        }
        return event;
      });
      return updatedEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    });
  };

  const moveEventForward = (eventId: number) => {
    setEvents(prevEvents => {
      const updatedEvents = prevEvents.map(event => {
        if (event.id === eventId) {
          const currentDate = new Date(event.date);
          currentDate.setDate(currentDate.getDate() + 1);
          const newDate = currentDate.toISOString().split('T')[0];
          return { ...event, date: newDate };
        }
        return event;
      });
      return updatedEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    });
  };

  const deleteEvent = (eventId: number) => {
    setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
  };

  const calculateRunningBalance = () => {
    let balance = 2450; // Starting balance from home page
    return events.map(event => {
      if (!event.isWhatIf || showWhatIf) {
        balance += event.amount;
        return { ...event, runningBalance: balance };
      }
      return { ...event, runningBalance: balance };
    });
  };

  const eventsWithBalance = calculateRunningBalance();
  const displayEvents = showWhatIf ? eventsWithBalance : eventsWithBalance.filter(e => !e.isWhatIf);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>Timeline</Text>
            <Text style={styles.subtitle}>
              Showing {displayEvents.length} events
            </Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity 
              style={[styles.whatIfToggle, showWhatIf && styles.whatIfToggleActive]}
              onPress={() => setShowWhatIf(!showWhatIf)}
            >
              <Text style={[styles.whatIfToggleText, showWhatIf && styles.whatIfToggleTextActive]}>
                {showWhatIf ? '🔮 What-If ON' : '🔮 What-If OFF'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleAddEvent} style={styles.addButton}>
              <Text style={styles.addButtonText}>+ Add</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* What-If Info Banner */}
        {showWhatIf && (
          <View style={styles.infoBanner}>
            <Text style={styles.infoBannerText}>
              💡 What-If scenarios are shown in purple. Use arrows to reschedule events day by day.
            </Text>
          </View>
        )}

        {/* Timeline */}
        <ScrollView 
          style={styles.timelineScroll}
          contentContainerStyle={styles.timelineContent}
          showsVerticalScrollIndicator={true}
        >
          <View style={styles.timelineWrapper}>
            <View style={styles.timelineLine} />
            
            {displayEvents.map((event) => (
              <View key={event.id} style={styles.timelineItem}>
                <View style={[
                  styles.timelineDot,
                  { backgroundColor: event.isWhatIf ? '#A855F7' : (event.amount > 0 ? '#10B981' : '#EF4444') }
                ]} />
                
                <View style={[
                  styles.eventCard,
                  event.isWhatIf && styles.whatIfCard,
                  { borderLeftColor: event.isWhatIf ? '#A855F7' : (event.amount > 0 ? '#10B981' : '#EF4444') }
                ]}>
                  {/* Event Header */}
                  <View style={styles.eventHeader}>
                    <View style={styles.eventHeaderLeft}>
                      <Text style={styles.eventDescription} numberOfLines={2}>
                        {event.description}
                      </Text>
                      {event.whatIfScenario && (
                        <Text style={styles.whatIfScenarioText}>{event.whatIfScenario}</Text>
                      )}
                    </View>
                    <Text style={[
                      styles.eventAmount,
                      { color: event.isWhatIf ? '#A855F7' : (event.amount > 0 ? '#10B981' : '#EF4444') }
                    ]}>
                      {event.amount > 0 ? '+' : ''}${Math.abs(event.amount)}
                    </Text>
                  </View>

                  {/* Event Details */}
                  <View style={styles.eventDetails}>
                    <Text style={styles.eventDate}>📅 {formatDate(event.date)}</Text>
                    <Text style={styles.eventCategory}>{event.category}</Text>
                  </View>

                  {/* Running Balance */}
                  {event.runningBalance !== undefined && (
                    <View style={styles.balanceContainer}>
                      <Text style={styles.balanceLabel}>Balance after: </Text>
                      <Text style={[
                        styles.balanceAmount,
                        { color: event.runningBalance < 0 ? '#EF4444' : '#10B981' }
                      ]}>
                        ${event.runningBalance.toLocaleString()}
                      </Text>
                    </View>
                  )}

                  {/* Action Buttons */}
                  <View style={styles.actionContainer}>
                    <View style={styles.actionRow}>
                      {/* Reschedule Arrows */}
                      <View style={styles.arrowContainer}>
                        <TouchableOpacity 
                          style={styles.arrowButton}
                          onPress={() => moveEventBack(event.id)}
                        >
                          <Text style={styles.arrowText}>◀ -1 day</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={styles.arrowButton}
                          onPress={() => moveEventForward(event.id)}
                        >
                          <Text style={styles.arrowText}>+1 day ▶</Text>
                        </TouchableOpacity>
                      </View>

                      {/* Edit and Delete Buttons */}
                      <View style={styles.iconButtonsContainer}>
                        <TouchableOpacity 
                          style={styles.iconButton}
                          onPress={() => handleEditEvent(event)}
                        >
                          <Text style={styles.iconButtonText}>✏️</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={[styles.iconButton, styles.deleteIconButton]}
                          onPress={() => deleteEvent(event.id)}
                        >
                          <Text style={styles.iconButtonText}>🗑️</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
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
  whatIfToggle: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  whatIfToggleActive: {
    backgroundColor: '#F3E8FF',
    borderColor: '#A855F7',
  },
  whatIfToggleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  whatIfToggleTextActive: {
    color: '#A855F7',
  },
  addButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#3B82F6',
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  infoBanner: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  infoBannerText: {
    fontSize: 13,
    color: '#92400E',
    lineHeight: 18,
  },
  timelineScroll: {
    flex: 1,
  },
  timelineContent: {
    paddingBottom: 100,
  },
  timelineWrapper: {
    position: 'relative',
    paddingLeft: 40,
  },
  timelineLine: {
    position: 'absolute',
    left: 16,
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: '#E5E7EB',
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
    position: 'relative',
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    position: 'absolute',
    left: -34,
    top: 8,
    zIndex: 2,
    borderWidth: 2,
    borderColor: '#fff',
  },
  eventCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  whatIfCard: {
    backgroundColor: '#FAF5FF',
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  eventHeaderLeft: {
    flex: 1,
    marginRight: 12,
  },
  eventDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  whatIfScenarioText: {
    fontSize: 12,
    color: '#A855F7',
    fontStyle: 'italic',
    marginTop: 2,
  },
  eventAmount: {
    fontSize: 20,
    fontWeight: '700',
  },
  eventDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventDate: {
    fontSize: 13,
    color: '#6B7280',
  },
  eventCategory: {
    fontSize: 12,
    color: '#9CA3AF',
    textTransform: 'capitalize',
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    marginBottom: 12,
  },
  balanceLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  balanceAmount: {
    fontSize: 15,
    fontWeight: '700',
  },
  actionContainer: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  arrowContainer: {
    flexDirection: 'row',
    gap: 8,
    flex: 1,
  },
  arrowButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    alignItems: 'center',
  },
  arrowText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3B82F6',
  },
  iconButtonsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteIconButton: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FECACA',
  },
  iconButtonText: {
    fontSize: 18,
  },
});