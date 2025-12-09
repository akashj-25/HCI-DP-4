// frontend/app/(tabs)/add-goal-modal.tsx
// FIXED VERSION - H4 Compliant

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import DatePicker from '../../components/DatePicker';
import { Colors, Labels, DateConfig, NavigationPaths } from '../../constants/design';

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
  var addNewGoal: ((goal: Goal) => void) | undefined;
}

export default function AddGoalModal() {
  // FIXED: Removed redundant "title" field, only using "name"
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');

  const handleSubmit = () => {
    // Validate required fields (description is optional)
    if (!name.trim() || !amount.trim() || !targetDate.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    const targetAmount = parseFloat(amount.replace(/,/g, ''));
    if (isNaN(targetAmount) || targetAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    // FIXED: Validate date using standardized format
    if (!DateConfig.validate(targetDate)) {
      alert('Please enter a valid date in MM/DD/YYYY format');
      return;
    }

    // Convert display format to storage format
    const storageDate = DateConfig.toStorage(targetDate);

    const newGoal = {
      id: Date.now(),
      name: name,
      description: description || '', // Optional field
      current: 0,
      target: targetAmount,
      color: Colors.neutral,
      icon: '🎯',
      targetDate: storageDate,
      subGoals: [],
      completedSubGoals: [],
      isPrimary: false,
    };

    // FIXED: Navigate to Goals page after creation (not Home)
    if (global.addNewGoal) {
      global.addNewGoal(newGoal);
    }
    router.push(NavigationPaths.goals);
  };

  const handleCancel = () => {
    // router.back();
    router.push(NavigationPaths.goals);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Header with Back Button */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <TouchableOpacity onPress={handleCancel} style={styles.backButton}>
                <Text style={styles.backButtonText}>‹ Back</Text>
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Create New Goal</Text>
            </View>
          </View>

          <View style={styles.form}>
            {/* FIXED: Single "Goal Name" field with clear label */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>
                {Labels.goalName}
                <Text style={styles.required}> *</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Emergency Fund"
                placeholderTextColor={Colors.textTertiary}
                value={name}
                onChangeText={setName}
              />
            </View>

            {/* FIXED: Clearly labeled as optional */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>{Labels.goalDescription}</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Add details about your goal (optional)"
                placeholderTextColor={Colors.textTertiary}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
              />
              <Text style={styles.helperText}>
                Example: "Save for 3-6 months of expenses"
              </Text>
            </View>

            {/* Target Amount */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>
                {Labels.targetAmount}
                <Text style={styles.required}> *</Text>
              </Text>
              <View style={styles.amountInputWrapper}>
                <Text style={styles.currencySymbol}>$</Text>
                <TextInput
                  style={[styles.input, styles.amountInput]}
                  placeholder="0.00"
                  placeholderTextColor={Colors.textTertiary}
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>

            {/* FIXED: Standardized DatePicker component */}
            <View style={styles.fieldContainer}>
              <DatePicker
                value={targetDate}
                onChange={setTargetDate}
                label={`${Labels.targetDate} *`}
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity 
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Create Goal</Text>
            </TouchableOpacity>

            <Text style={styles.footerNote}>
              * Required fields
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    paddingVertical: 20,
  },
  headerLeft: {
    gap: 12,
  },
  backButton: {
    alignSelf: 'flex-start',
  },
  backButtonText: {
    fontSize: 16,
    color: Colors.neutral,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
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
    color: Colors.textPrimary,
  },
  required: {
    color: Colors.error,
  },
  input: {
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.borderMedium,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
    paddingTop: 14,
  },
  helperText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  amountInputWrapper: {
    position: 'relative',
  },
  currencySymbol: {
    position: 'absolute',
    left: 16,
    top: 14,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
    zIndex: 1,
  },
  amountInput: {
    paddingLeft: 32,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: Colors.neutral,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 12,
    shadowColor: Colors.neutral,
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
  footerNote: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: -8,
    marginBottom: 20,
  },
});