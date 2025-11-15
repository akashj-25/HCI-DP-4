import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

// Add Goal interface at the top
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

declare global {
  var addNewGoal: ((goal: Goal) => void) | undefined;
}

export default function AddGoalModal() {
  const [title, setTitle] = useState('');
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');

  const handleSubmit = () => {
    // Validate inputs
    if (!title.trim() || !name.trim() || !amount.trim() || !targetDate.trim()) {
      alert('Please fill in all fields');
      return;
    }

    // Parse amount to number
    const targetAmount = parseFloat(amount.replace(/,/g, ''));
    if (isNaN(targetAmount) || targetAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    // Create new goal object
    const newGoal = {
      id: Date.now(), // Simple ID generation
      name: title,
      description: name,
      current: 0,
      target: targetAmount,
      color: '#3B82F6', // Default color
      icon: '🎯', // Default icon
      targetDate: targetDate,
    };

    // Navigate back with the new goal data
    router.back();
    
    // We'll handle adding to the list in the goals page
    // For now, we'll use a workaround with global state or event
    if (global.addNewGoal) {
      global.addNewGoal(newGoal);
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
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Create Goal</Text>
            <TouchableOpacity onPress={handleCancel}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
          </View>

          {/* Form Fields */}
          <View style={styles.form}>
            {/* Title Field */}
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

            {/* Name Field */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter name"
                placeholderTextColor="#9CA3AF"
                value={name}
                onChangeText={setName}
              />
            </View>

            {/* Amount Field */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Amount</Text>
              <TextInput
                style={styles.input}
                placeholder="$0.00"
                placeholderTextColor="#9CA3AF"
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
              />
            </View>

            {/* Target Date Field */}
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

            {/* Submit Button */}
            <TouchableOpacity 
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Submit</Text>
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