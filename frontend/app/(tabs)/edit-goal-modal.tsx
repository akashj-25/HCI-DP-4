// frontend/app/(tabs)/edit-goal-modal.tsx
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
import { router, useLocalSearchParams } from 'expo-router';
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
  var updateGoal: ((goal: Goal) => void) | undefined;
}

export default function EditGoalModal() {
  const params = useLocalSearchParams();
  const existingGoal = params.goalData ? JSON.parse(params.goalData as string) : null;

  // Convert storage date to display format
  const displayDate = existingGoal?.targetDate ? DateConfig.toDisplay(existingGoal.targetDate) : '';

  const [name, setName] = useState(existingGoal?.name || '');
  const [description, setDescription] = useState(existingGoal?.description || '');
  const [currentAmount, setCurrentAmount] = useState(existingGoal?.current?.toString() || '0');
  const [targetAmount, setTargetAmount] = useState(existingGoal?.target?.toString() || '');
  const [targetDate, setTargetDate] = useState(displayDate);

  const handleSubmit = () => {
    if (!name.trim() || !targetAmount.trim()) {
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

    // Validate date if provided
    let storageDate = existingGoal?.targetDate || '';
    if (targetDate.trim()) {
      if (!DateConfig.validate(targetDate)) {
        alert(`Please enter a valid date in ${DateConfig.placeholder} format`);
        return;
      }
      storageDate = DateConfig.toStorage(targetDate);
    }

    const updatedGoal = {
      ...existingGoal,
      name: name,
      description: description || '',
      current: current,
      target: target,
      targetDate: storageDate,
    };

    if (global.updateGoal) {
      global.updateGoal(updatedGoal);
    }
    router.push(NavigationPaths.goals);
  };

  const handleCancel = () => {
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
              <Text style={styles.headerTitle}>Edit Goal</Text>
            </View>
          </View>

          <View style={styles.form}>
            {/* Goal Name */}
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

            {/* Description (Optional) */}
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
            </View>

            {/* Current Amount */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>
                {Labels.currentAmount}
                <Text style={styles.required}> *</Text>
              </Text>
              <View style={styles.amountInputWrapper}>
                <Text style={styles.currencySymbol}>$</Text>
                <TextInput
                  style={[styles.input, styles.amountInput]}
                  placeholder="0.00"
                  placeholderTextColor={Colors.textTertiary}
                  value={currentAmount}
                  onChangeText={setCurrentAmount}
                  keyboardType="decimal-pad"
                />
              </View>
              <Text style={styles.helperText}>
                How much have you saved so far?
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
                  value={targetAmount}
                  onChangeText={setTargetAmount}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>

            {/* Target Date */}
            <View style={styles.fieldContainer}>
              <DatePicker
                value={targetDate}
                onChange={setTargetDate}
                label={Labels.targetDate}
              />
            </View>

            {/* Progress Indicator */}
            {parseFloat(currentAmount) > 0 && parseFloat(targetAmount) > 0 && (
              <View style={styles.progressPreview}>
                <Text style={styles.progressPreviewLabel}>Current Progress</Text>
                <View style={styles.progressBarBg}>
                  <View 
                    style={[
                      styles.progressBarFill,
                      { 
                        width: `${Math.min((parseFloat(currentAmount) / parseFloat(targetAmount)) * 100, 100)}%`
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.progressPreviewText}>
                  {Math.round((parseFloat(currentAmount) / parseFloat(targetAmount)) * 100)}% complete
                </Text>
              </View>
            )}

            {/* Submit Button */}
            <TouchableOpacity 
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Update Goal</Text>
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
  progressPreview: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.borderMedium,
  },
  progressPreviewLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: Colors.borderMedium,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.success,
    borderRadius: 4,
  },
  progressPreviewText: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'right',
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