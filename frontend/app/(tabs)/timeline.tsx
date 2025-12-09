// frontend/app/(tabs)/timeline.tsx
// FIXED VERSION - Better date display, What-If badges, consistent colors

import { router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Dimensions,
    ScrollView,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, DateConfig, NavigationPaths } from '../../constants/design';

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
    description: 'Missed Paycheck',
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
    description: 'Extra Weekend Spending',
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
    router.push(NavigationPaths.addEvent);
  };

  const handleEditEvent = (event: TimelineEvent) => {
    router.push({
      pathname: NavigationPaths.editEvent,
      params: { eventData: JSON.stringify(event) }
    });
  };

  // FIXED: Format date consistently
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
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

  const deleteEvent = (eventId: number, eventDescription: string) => {
    Alert.alert(
      'Delete Event',
      `Are you sure you want to delete "${eventDescription}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
          },
        },
      ]
    );
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

  // FIXED: Get color for event type
  const getEventColor = (event: TimelineEvent) => {
    if (event.isWhatIf) return Colors.whatIf;
    return event.amount > 0 ? Colors.income : Colors.expense;
  };

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
              <Feather 
                name="help-circle" 
                size={16} 
                color={showWhatIf ? Colors.whatIf : Colors.textSecondary}
              />
              <Text style={[styles.whatIfToggleText, showWhatIf && styles.whatIfToggleTextActive]}>
                What-If
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleAddEvent} style={styles.addButton}>
              <Feather name="plus" size={18} color="#fff" />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* What-If Info Banner */}
        {showWhatIf && (
          <View style={styles.infoBanner}>
            <Feather name="info" size={16} color="#92400E" />
            <Text style={styles.infoBannerText}>
              What-If scenarios help you explore financial outcomes. Use arrows to adjust dates.
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
            
            {displayEvents.map((event) => {
              const eventColor = getEventColor(event);
              
              return (
                <View key={event.id} style={styles.timelineItem}>
                  <View style={[
                    styles.timelineDot,
                    { backgroundColor: eventColor }
                  ]} />
                  
                  <View style={[
                    styles.eventCard,
                    event.isWhatIf && styles.whatIfCard,
                    { borderLeftColor: eventColor }
                  ]}>
                    {/* FIXED: What-If Badge */}
                    {event.isWhatIf && (
                      <View style={styles.whatIfBadge}>
                        <Feather name="help-circle" size={12} color={Colors.whatIf} />
                        <Text style={styles.whatIfBadgeText}>What-If Scenario</Text>
                      </View>
                    )}

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
                      <View style={styles.amountContainer}>
                        <Text style={[
                          styles.eventAmount,
                          { color: eventColor }
                        ]}>
                          {event.amount > 0 ? '+' : '−'}${Math.abs(event.amount).toLocaleString()}
                        </Text>
                        <Feather 
                          name={event.amount > 0 ? "trending-up" : "trending-down"} 
                          size={16} 
                          color={eventColor}
                        />
                      </View>
                    </View>

                    {/* Event Details */}
                    <View style={styles.eventDetails}>
                      <View style={styles.dateContainer}>
                        <Feather name="calendar" size={14} color={Colors.textSecondary} />
                        <Text style={styles.eventDate}>{formatDate(event.date)}</Text>
                      </View>
                      <View style={styles.categoryBadge}>
                        <Text style={styles.eventCategory}>{event.category}</Text>
                      </View>
                    </View>

                    {/* Running Balance */}
                    {event.runningBalance !== undefined && (
                      <View style={styles.balanceContainer}>
                        <Text style={styles.balanceLabel}>Balance after: </Text>
                        <Text style={[
                          styles.balanceAmount,
                          { color: event.runningBalance < 0 ? Colors.error : Colors.success }
                        ]}>
                          {event.runningBalance < 0 ? '−' : ''}${Math.abs(event.runningBalance).toLocaleString()}
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
                            <Feather name="arrow-left" size={14} color={Colors.neutral} />
                            <Text style={styles.arrowText}>-1 day</Text>
                          </TouchableOpacity>
                          <TouchableOpacity 
                            style={styles.arrowButton}
                            onPress={() => moveEventForward(event.id)}
                          >
                            <Text style={styles.arrowText}>+1 day</Text>
                            <Feather name="arrow-right" size={14} color={Colors.neutral} />
                          </TouchableOpacity>
                        </View>

                        {/* Edit and Delete Buttons */}
                        <View style={styles.iconButtonsContainer}>
                          <TouchableOpacity 
                            style={styles.iconButton}
                            onPress={() => handleEditEvent(event)}
                          >
                            <Feather name="edit-2" size={16} color={Colors.textSecondary} />
                          </TouchableOpacity>
                          <TouchableOpacity 
                            style={[styles.iconButton, styles.deleteIconButton]}
                            onPress={() => deleteEvent(event.id, event.description)}
                          >
                            <Feather name="trash-2" size={16} color={Colors.error} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundMedium,
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
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  whatIfToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: Colors.backgroundMedium,
    borderWidth: 2,
    borderColor: Colors.borderMedium,
  },
  whatIfToggleActive: {
    backgroundColor: Colors.whatIf + '20',
    borderColor: Colors.whatIf,
  },
  whatIfToggleText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  whatIfToggleTextActive: {
    color: Colors.whatIf,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: Colors.neutral,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.warning,
  },
  infoBannerText: {
    flex: 1,
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
    backgroundColor: Colors.borderMedium,
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
    backgroundColor: Colors.cardBackground,
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
  whatIfBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: Colors.whatIf + '20',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  whatIfBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.whatIf,
    textTransform: 'uppercase',
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
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  whatIfScenarioText: {
    fontSize: 12,
    color: Colors.whatIf,
    fontStyle: 'italic',
    marginTop: 2,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  eventAmount: {
    fontSize: 18,
    fontWeight: '700',
  },
  eventDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  eventDate: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  categoryBadge: {
    backgroundColor: Colors.backgroundLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  eventCategory: {
    fontSize: 11,
    color: Colors.textSecondary,
    textTransform: 'capitalize',
    fontWeight: '500',
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    marginBottom: 12,
  },
  balanceLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  balanceAmount: {
    fontSize: 15,
    fontWeight: '700',
  },
  actionContainer: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.borderMedium,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  arrowText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.neutral,
  },
  iconButtonsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: Colors.backgroundLight,
    borderWidth: 1,
    borderColor: Colors.borderMedium,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteIconButton: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FECACA',
  },
});