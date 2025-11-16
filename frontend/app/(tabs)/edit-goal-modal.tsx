import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';

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
  var updateGoal: ((goal: Goal) => void) | undefined;
}

export default function EditGoalModal() {
  const params = useLocalSearchParams();
  const existingGoal = params.goalData ? JSON.parse(params.goalData as string) : null;

  const [title, setTitle] = useState(existingGoal?.name || '');
  const [name, setName] = useState(existingGoal?.description || '');
  const [currentAmount, setCurrentAmount] = useState(existingGoal?.current?.toString() || '0');
  const [targetAmount, setTargetAmount] = useState(existingGoal?.target?.toString() || '');
  const [targetDate, setTargetDate] = useState(existingGoal?.targetDate || '');

  const handleSubmit = () => {
    if (!title.trim() || !name.trim() || !targetAmount.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    const target = parseFloat(targetAmount.replace(/,/g, ''));
    const current = parseFloat(currentAmount.replace(/,/g, ''));
    
    if (isNaN(target) || target <= 0) {
      alert('Please enter a valid target amount');
      return;
    }

    if (isNaN(current) || current < 0) {
      alert('Please enter a valid current amount');
      return;
    }

    const updatedGoal = {
      ...existingGoal,
      name: title,
      description: name,
      current: current,
      target: target,
      targetDate: targetDate,
    };

    router.back();
    
    if (global.updateGoal) {
      global.updateGoal(updatedGoal);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Edit Goal</Text>
            <TouchableOpacity onPress={handleCancel}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Title</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter goal title"
                placeholderTextColor="#9CA3AF"
                value={title}
                onChangeText={setTitle}
              />
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter description"
                placeholderTextColor="#9CA3AF"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Current Amount</Text>
              <TextInput
                style={styles.input}
                placeholder="$0.00"
                placeholderTextColor="#9CA3AF"
                value={currentAmount}
                onChangeText={setCurrentAmount}
                keyboardType="decimal-pad"
              />
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Target Amount</Text>
              <TextInput
                style={styles.input}
                placeholder="$0.00"
                placeholderTextColor="#9CA3AF"
                value={targetAmount}
                onChangeText={setTargetAmount}
                keyboardType="decimal-pad"
              />
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Target Date</Text>
              <TextInput
                style={styles.input}
                placeholder="mm/dd/yyyy"
                placeholderTextColor="#9CA3AF"
                value={targetDate}
                onChangeText={setTargetDate}
              />
            </View>

            <TouchableOpacity 
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Update Goal</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
  },
  cancelButton: {
    fontSize: 16,
    color: '#6B7280',
  },
  form: {
    gap: 20,
  },
  fieldContainer: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1F2937',
  },
  submitButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 12,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});