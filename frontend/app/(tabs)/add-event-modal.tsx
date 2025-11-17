import { router } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Timeline Event interface matching the existing one
interface TimelineEvent {
  id: number;
  type: 'major' | 'medium' | 'small';
  amount: number;
  description: string;
  date: string;
  category: string;
  importance: number;
}

declare global {
  var addNewEvent: ((event: TimelineEvent) => void) | undefined;
}

export default function AddEventModal() {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');
  const [eventType, setEventType] = useState<'major' | 'medium' | 'small'>('medium');
  const [isPositive, setIsPositive] = useState(true);

  const handleSubmit = () => {
    // Validate inputs
    if (!description.trim() || !amount.trim() || !date.trim() || !category.trim()) {
      alert('Please fill in all fields');
      return;
    }

    // Parse amount to number and apply sign
    let amountValue = parseFloat(amount.replace(/,/g, ''));
    if (isNaN(amountValue)) {
      alert('Please enter a valid amount');
      return;
    }

    // Apply negative sign if needed
    if (!isPositive) {
      amountValue = -Math.abs(amountValue);
    } else {
      amountValue = Math.abs(amountValue);
    }

    // Validate date format (basic validation)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      alert('Please enter date in YYYY-MM-DD format');
      return;
    }

    // Calculate importance based on event type
    const importance = eventType === 'major' ? 10 : eventType === 'medium' ? 5 : 1;

    // Create new event object
    const newEvent: TimelineEvent = {
      id: Date.now(),
      type: eventType,
      amount: amountValue,
      description: description,
      date: date,
      category: category.toLowerCase(),
      importance: importance,
    };

    // Navigate back with the new event data
    router.back();
    
    // Use global function to add the event
    if (global.addNewEvent) {
      global.addNewEvent(newEvent);
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
            <Text style={styles.headerTitle}>Add Timeline Event</Text>
            <TouchableOpacity onPress={handleCancel}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
          </View>

          {/* Form Fields */}
          <View style={styles.form}>
            {/* Description Field */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter event description"
                placeholderTextColor="#9CA3AF"
                value={description}
                onChangeText={setDescription}
              />
            </View>

            {/* Amount Field - UPDATED */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Amount</Text>
              <View style={styles.amountContainer}>
                {/* Positive/Negative Toggle Buttons */}
                <View style={styles.signButtonsContainer}>
                  <TouchableOpacity 
                    style={[
                      styles.signButton,
                      styles.positiveButton,
                      isPositive && styles.signButtonActive
                    ]}
                    onPress={() => setIsPositive(true)}
                  >
                    <Text style={[
                      styles.signButtonText,
                      isPositive && styles.signButtonTextActive
                    ]}>
                      +
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[
                      styles.signButton,
                      styles.negativeButton,
                      !isPositive && styles.signButtonActive
                    ]}
                    onPress={() => setIsPositive(false)}
                  >
                    <Text style={[
                      styles.signButtonText,
                      !isPositive && styles.signButtonTextActive
                    ]}>
                      −
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Amount Input */}
                <TextInput
                  style={[
                    styles.input,
                    styles.amountInput,
                    isPositive ? styles.amountInputPositive : styles.amountInputNegative
                  ]}
                  placeholder="0.00"
                  placeholderTextColor="#9CA3AF"
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="decimal-pad"
                />
              </View>
              <Text style={styles.amountHint}>
                {isPositive ? '💰 Income or positive transaction' : '💸 Expense or negative transaction'}
              </Text>
            </View>

            {/* Date Field */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Date</Text>
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#9CA3AF"
                value={date}
                onChangeText={setDate}
              />
            </View>

            {/* Category Field */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Category</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., housing, food, income"
                placeholderTextColor="#9CA3AF"
                value={category}
                onChangeText={setCategory}
              />
            </View>

            {/* Event Type Selection */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Event Size</Text>
              <View style={styles.typeButtonsContainer}>
                <TouchableOpacity 
                  style={[
                    styles.typeButton,
                    eventType === 'major' && styles.typeButtonSelected,
                    { backgroundColor: eventType === 'major' ? '#EF4444' : '#F3F4F6' }
                  ]}
                  onPress={() => setEventType('major')}
                >
                  <Text style={[
                    styles.typeButtonText,
                    eventType === 'major' && styles.typeButtonTextSelected
                  ]}>
                    Major
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[
                    styles.typeButton,
                    eventType === 'medium' && styles.typeButtonSelected,
                    { backgroundColor: eventType === 'medium' ? '#F59E0B' : '#F3F4F6' }
                  ]}
                  onPress={() => setEventType('medium')}
                >
                  <Text style={[
                    styles.typeButtonText,
                    eventType === 'medium' && styles.typeButtonTextSelected
                  ]}>
                    Medium
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[
                    styles.typeButton,
                    eventType === 'small' && styles.typeButtonSelected,
                    { backgroundColor: eventType === 'small' ? '#10B981' : '#F3F4F6' }
                  ]}
                  onPress={() => setEventType('small')}
                >
                  <Text style={[
                    styles.typeButtonText,
                    eventType === 'small' && styles.typeButtonTextSelected
                  ]}>
                    Small
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity 
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Add Event</Text>
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
  // NEW STYLES FOR AMOUNT FIELD
  amountContainer: {
    gap: 12,
  },
  signButtonsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  signButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  positiveButton: {
    backgroundColor: '#D1FAE5',
  },
  negativeButton: {
    backgroundColor: '#FEE2E2',
  },
  signButtonActive: {
    borderColor: '#1F2937',
  },
  signButtonText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#9CA3AF',
  },
  signButtonTextActive: {
    color: '#1F2937',
  },
  amountInput: {
    fontSize: 18,
    fontWeight: '600',
  },
  amountInputPositive: {
    borderColor: '#10B981',
    backgroundColor: '#F0FDF4',
  },
  amountInputNegative: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  amountHint: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
    marginTop: -4,
  },
  // END NEW STYLES
  typeButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  typeButtonSelected: {
    borderColor: '#1F2937',
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  typeButtonTextSelected: {
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