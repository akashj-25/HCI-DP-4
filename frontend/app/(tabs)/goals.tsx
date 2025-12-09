// frontend/app/(tabs)/goals.tsx
// FIXED VERSION - Star icon for primary, better UI

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  StatusBar, 
  ScrollView, 
  TouchableOpacity, 
  Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Colors, NavigationPaths } from '../../constants/design';

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
  const [goals, setGoals] = useState<Goal[]>(global.goalsState || []);
  const [expandedGoals, setExpandedGoals] = useState<Set<number>>(new Set());

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
          isPrimary: goal.id === goalId ? !goal.isPrimary : false
        }))
      );
    }
  };

  const handleAddGoal = () => {
    router.push(NavigationPaths.addGoal);
  };

  const handleEditGoal = (goal: Goal) => {
    router.push({
      pathname: NavigationPaths.editGoal,
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
            <Feather name="plus" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.goalsList}>
          {goals.map((goal) => (
            <View key={goal.id} style={styles.goalCard}>
              <View style={styles.goalHeader}>
                <View style={[styles.goalIcon, { backgroundColor: `${goal.color}20` }]}>
                  <Text style={styles.goalIconText}>{goal.icon}</Text>
                </View>
                <View style={styles.goalInfo}>
                  <View style={styles.goalNameRow}>
                    <Text style={styles.goalName}>{goal.name}</Text>
                    {/* FIXED: Star icon for primary goal */}
                    <TouchableOpacity
                      style={styles.primaryButton}
                      onPress={() => setPrimaryGoal(goal.id)}
                    >
                      <Feather 
                        name="star" 
                        size={18} 
                        color={goal.isPrimary ? Colors.warning : Colors.textTertiary}
                        fill={goal.isPrimary ? Colors.warning : 'transparent'}
                      />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.goalDescription}>{goal.description}</Text>
                </View>
                
                {/* FIXED: Action buttons in a more subtle style */}
                <View style={styles.actionButtons}>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => handleEditGoal(goal)}
                  >
                    <Feather name="edit-2" size={18} color={Colors.textSecondary} />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => handleDeleteGoal(goal.id, goal.name)}
                  >
                    <Feather name="trash-2" size={18} color={Colors.error} />
                  </TouchableOpacity>
                </View>
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
                <Text style={styles.progressPercentage}>
                  {Math.round(calculateProgress(goal.current, goal.target))}% complete
                </Text>
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
                    <Feather 
                      name={expandedGoals.has(goal.id) ? "chevron-up" : "chevron-down"} 
                      size={18} 
                      color={Colors.textSecondary}
                    />
                  </TouchableOpacity>
                  
                  {expandedGoals.has(goal.id) && (
                    <View style={styles.subGoalsDropdownContent}>
                      {goal.subGoals.map((subGoal, subIndex) => {
                        const isCompleted = goal.completedSubGoals?.includes(subIndex);
                        return (
                          <TouchableOpacity 
                            key={subIndex}
                            style={styles.subGoalItem}
                            onPress={() => toggleSubGoalCompletion(goal.id, subIndex)}
                          >
                            <View style={[
                              styles.subGoalCheckbox,
                              isCompleted && styles.subGoalCheckboxCompleted
                            ]}>
                              {isCompleted && (
                                <Feather name="check" size={14} color="#fff" />
                              )}
                            </View>
                            <Text style={[
                              styles.subGoalText,
                              isCompleted && styles.completedSubGoalText
                            ]}>
                              {subGoal}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  )}
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
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
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.neutral,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.neutral,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  goalsList: {
    gap: 16,
    paddingBottom: 20,
  },
  goalCard: {
    backgroundColor: Colors.cardBackground,
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
    marginBottom: 4,
  },
  goalName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  primaryButton: {
    padding: 4,
  },
  goalDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    marginLeft: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: Colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressSection: {
    marginTop: 4,
    gap: 8,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  progressAmount: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: Colors.borderMedium,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressPercentage: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'right',
  },
  subGoalsSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  subGoalsDropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  subGoalsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    flex: 1,
  },
  subGoalsDropdownContent: {
    marginTop: 8,
    paddingTop: 8,
    gap: 8,
  },
  subGoalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  subGoalCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.borderDark,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subGoalCheckboxCompleted: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  subGoalText: {
    fontSize: 13,
    color: Colors.textSecondary,
    flex: 1,
    lineHeight: 18,
  },
  completedSubGoalText: {
    textDecorationLine: 'line-through',
    color: Colors.textTertiary,
  },
});