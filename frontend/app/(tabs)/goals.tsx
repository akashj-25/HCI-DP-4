import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

interface Goal {
  id: number;
  name: string;
  description: string;
  current: number;
  target: number;
  color: string;
  icon: string;
  targetDate?: string;
  subGoals?: string[];
  completedSubGoals?: number[];
  isPrimary?: boolean;
}

declare global {
  var goalsState: Goal[];
  var setGoalsState: React.Dispatch<React.SetStateAction<Goal[]>>;
  var addNewGoal: ((goal: Goal) => void) | undefined;
  var updateGoal: ((goal: Goal) => void) | undefined;
  var getPrimaryGoal: (() => Goal | undefined) | undefined;
}

export default function GoalsScreen() {
  // Use global state instead of local state
  const [goals, setGoals] = useState<Goal[]>(global.goalsState || []);
  const [expandedGoals, setExpandedGoals] = useState<Set<number>>(new Set());

  // Sync with global state
  useEffect(() => {
    const interval = setInterval(() => {
      if (global.goalsState) {
        setGoals(global.goalsState);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const toggleSubGoalCompletion = (goalId: number, subGoalIndex: number) => {
    if (global.setGoalsState) {
      global.setGoalsState(prevGoals => 
        prevGoals.map(goal => {
          if (goal.id === goalId) {
            const completedSubGoals = goal.completedSubGoals || [];
            const isCompleted = completedSubGoals.includes(subGoalIndex);
            
            return {
              ...goal,
              completedSubGoals: isCompleted
                ? completedSubGoals.filter(index => index !== subGoalIndex)
                : [...completedSubGoals, subGoalIndex]
            };
          }
          return goal;
        })
      );
    }
  };

  const toggleSubGoalsDropdown = (goalId: number) => {
    setExpandedGoals(prev => {
      const newSet = new Set(prev);
      if (newSet.has(goalId)) {
        newSet.delete(goalId);
      } else {
        newSet.add(goalId);
      }
      return newSet;
    });
  };

  const setPrimaryGoal = (goalId: number) => {
    if (global.setGoalsState) {
      global.setGoalsState(prevGoals => 
        prevGoals.map(goal => ({
          ...goal,
          isPrimary: goal.id === goalId
        }))
      );
    }
  };

  const handleAddGoal = () => {
    router.push('/(tabs)/add-goal-modal');
  };

  const handleEditGoal = (goal: Goal) => {
    router.push({
      pathname: '/(tabs)/edit-goal-modal',
      params: { goalData: JSON.stringify(goal) }
    });
  };

  const handleDeleteGoal = (goalId: number, goalName: string) => {
    Alert.alert(
      'Delete Goal',
      `Are you sure you want to delete "${goalName}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            if (global.setGoalsState) {
              global.setGoalsState(prevGoals => prevGoals.filter(goal => goal.id !== goalId));
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>My Goals</Text>
          <TouchableOpacity style={styles.addButton} onPress={handleAddGoal}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.goalsList}>
          {goals.map((goal) => (
            <TouchableOpacity 
              key={goal.id} 
              style={styles.goalCard}
              onPress={() => handleEditGoal(goal)}
              activeOpacity={0.7}
            >
              <View style={styles.goalHeader}>
                <View style={[styles.goalIcon, { backgroundColor: `${goal.color}20` }]}>
                  <Text style={styles.goalIconText}>{goal.icon}</Text>
                </View>
                <View style={styles.goalInfo}>
                  <View style={styles.goalNameRow}>
                    <Text style={styles.goalName}>{goal.name}</Text>
                    <TouchableOpacity
                      style={styles.primaryButton}
                      onPress={() => setPrimaryGoal(goal.id)}
                    >
                      <Text style={[
                        styles.primaryIcon,
                        goal.isPrimary && styles.primaryIconActive
                      ]}>
                        ❗
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.goalDescription}>{goal.description}</Text>
                </View>
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={() => handleDeleteGoal(goal.id, goal.name)}
                >
                  <Text style={styles.deleteButtonText}>🗑️</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.progressSection}>
                <View style={styles.progressLabelRow}>
                  <Text style={styles.progressLabel}>Progress</Text>
                  <Text style={styles.progressAmount}>
                    ${goal.current.toLocaleString()} / ${goal.target.toLocaleString()}
                  </Text>
                </View>
                <View style={styles.progressBarBg}>
                  <View 
                    style={[
                      styles.progressBarFill, 
                      { 
                        width: `${calculateProgress(goal.current, goal.target)}%`,
                        backgroundColor: goal.color 
                      }
                    ]} 
                  />
                </View>
              </View>

              {goal.subGoals && goal.subGoals.length > 0 && (
                <View style={styles.subGoalsSection}>
                  <TouchableOpacity 
                    style={styles.subGoalsDropdownHeader}
                    onPress={() => toggleSubGoalsDropdown(goal.id)}
                  >
                    <Text style={styles.subGoalsTitle}>
                      Tasks to Help You Succeed ({goal.subGoals.length})
                    </Text>
                    <Text style={styles.dropdownArrow}>
                      {expandedGoals.has(goal.id) ? '▲' : '▼'}
                    </Text>
                  </TouchableOpacity>
                  
                  {expandedGoals.has(goal.id) && (
                    <View style={styles.subGoalsDropdownContent}>
                      {goal.subGoals.map((subGoal, subIndex) => (
                        <TouchableOpacity 
                          key={subIndex}
                          style={styles.subGoalItem}
                          onPress={() => toggleSubGoalCompletion(goal.id, subIndex)}
                        >
                          <View style={styles.subGoalCheckbox}>
                            <Text style={styles.checkboxIcon}>
                              {goal.completedSubGoals && goal.completedSubGoals.includes(subIndex) ? '✅' : '⭕'}
                            </Text>
                          </View>
                          <Text style={[
                            styles.subGoalText,
                            goal.completedSubGoals && goal.completedSubGoals.includes(subIndex) && styles.completedSubGoalText
                          ]}>
                            {subGoal}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
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
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonText: {
    fontSize: 28,
    color: '#fff',
    fontWeight: '300',
    marginTop: -2,
  },
  goalsList: {
    gap: 16,
    paddingBottom: 20,
  },
  goalCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  goalIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  goalIconText: {
    fontSize: 24,
  },
  goalInfo: {
    flex: 1,
  },
  goalNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  goalName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  primaryButton: {
    padding: 4,
  },
  primaryIcon: {
    fontSize: 16,
    opacity: 0.3,
    color: '#6B7280',
  },
  primaryIconActive: {
    opacity: 1,
    color: '#DC2626',
  },
  goalDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  deleteButtonText: {
    fontSize: 18,
  },
  progressSection: {
    marginTop: 4,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  progressAmount: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '600',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  subGoalsSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  subGoalsDropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  subGoalsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    flex: 1,
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: 'bold',
  },
  subGoalsDropdownContent: {
    marginTop: 8,
    paddingTop: 8,
  },
  subGoalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  subGoalCheckbox: {
    marginRight: 12,
  },
  checkboxIcon: {
    fontSize: 18,
  },
  subGoalText: {
    fontSize: 13,
    color: '#6B7280',
    flex: 1,
    lineHeight: 18,
  },
  completedSubGoalText: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
});