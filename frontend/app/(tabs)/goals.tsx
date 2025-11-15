import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

// Add this interface
interface Goal {
  id: number;
  name: string;
  description: string;
  current: number;
  target: number;
  color: string;
  icon: string;
  targetDate?: string;
}

// Declare global types
declare global {
  var addNewGoal: ((goal: Goal) => void) | undefined;
  var updateGoal: ((goal: Goal) => void) | undefined;
}

export default function GoalsScreen() {
  const [goals, setGoals] = useState([
    {
      id: 1,
      name: 'Emergency Fund',
      description: 'Save for emergencies',
      current: 1500,
      target: 5000,
      color: '#3B82F6',
      icon: '🛡️',
    },
    {
      id: 2,
      name: 'Vacation Fund',
      description: 'Summer trip 2025',
      current: 800,
      target: 3000,
      color: '#10B981',
      icon: '✈️',
    },
  ]);

  // Set up global function to add new goals
  useEffect(() => {
  global.addNewGoal = (newGoal: Goal) => {
    setGoals(prevGoals => [...prevGoals, newGoal]);
  };

  global.updateGoal = (updatedGoal: Goal) => {
    setGoals(prevGoals => 
      prevGoals.map(goal => 
        goal.id === updatedGoal.id ? updatedGoal : goal
      )
    );
  };

  return () => {
    delete global.addNewGoal;
    delete global.updateGoal;
  };
}, []);

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
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
            setGoals(prevGoals => prevGoals.filter(goal => goal.id !== goalId));
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>My Goals</Text>
          <TouchableOpacity style={styles.addButton} onPress={handleAddGoal}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Goals List */}
        <View style={styles.goalsList}>
          {goals.map((goal) => (
            <TouchableOpacity 
              key={goal.id} 
              style={styles.goalCard}
              onPress={() => handleEditGoal(goal)}
              activeOpacity={0.7}
            >
              {/* Goal Header */}
              <View style={styles.goalHeader}>
                <View style={[styles.goalIcon, { backgroundColor: `${goal.color}20` }]}>
                  <Text style={styles.goalIconText}>{goal.icon}</Text>
                </View>
                <View style={styles.goalInfo}>
                  <Text style={styles.goalName}>{goal.name}</Text>
                  <Text style={styles.goalDescription}>{goal.description}</Text>
                </View>
                {/* Delete Button */}
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={() => handleDeleteGoal(goal.id, goal.name)}
                >
                  <Text style={styles.deleteButtonText}>🗑️</Text>
                </TouchableOpacity>
              </View>

              {/* Progress Section */}
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
  goalName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
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
});