// frontend/app/(tabs)/edit-event-modal.tsx
// FIXED VERSION - H4 Compliant

import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView, 
  StyleSheet, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import DatePicker from '../../components/DatePicker';
import { 
  Colors, 
  Labels, 
  DateConfig, 
  NavigationPaths,
  ImpactLevel,
  ImpactLevelConfig
} from '../../constants/design';

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

declare global {
  var updateEvent: ((event: TimelineEvent) => void) | undefined;
}

export default function EditEventModal() {
  const params = useLocalSearchParams();
  const existingEvent = params.eventData ? JSON.parse(params.eventData as string) : null;

  // Convert storage date to display format
  const displayDate = existingEvent?.date ? DateConfig.toDisplay(existingEvent.date) : '';

  const [description, setDescription] = useState(existingEvent?.description || '');
  const [amount, setAmount] = useState(Math.abs(existingEvent?.amount || 0).toString());
  const [date, setDate] = useState(displayDate);
  const [category, setCategory] = useState(existingEvent?.category || '');
  
  // Convert type to impact level
  const getImpactLevel = (type: string): ImpactLevel => {
    if (type === 'major') return 'high';
    if (type === 'small') return 'low';
    return 'medium';
  };
  
  const [impactLevel, setImpactLevel] = useState<ImpactLevel>(
    getImpactLevel(existingEvent?.type || 'medium')
  );
  const [isIncome, setIsIncome] = useState((existingEvent?.amount || 0) >= 0);

  const handleSubmit = () => {
    if (!description.trim() || !amount.trim() || !date.trim() || !category.trim()) {
      alert('Please fill in all fields');
      return;
    }

    let amountValue = parseFloat(amount.replace(/,/g, ''));
    if (isNaN(amountValue)) {
      alert('Please enter a valid amount');
      return;
    }

    amountValue = isIncome ? Math.abs(amountValue) : -Math.abs(amountValue);

    if (!DateConfig.validate(date)) {
      alert(`Please enter date in ${DateConfig.placeholder} format`);
      return;
    }
    const storageDate = DateConfig.toStorage(date);

    const importance = ImpactLevelConfig[impactLevel].importance;

    const updatedEvent: TimelineEvent = {
      ...existingEvent,
      type: impactLevel === 'high' ? 'major' : impactLevel === 'medium' ? 'medium' : 'small',
      amount: amountValue,
      description: description,
      date: storageDate,
      category: category.toLowerCase(),
      importance: importance,
    };

    if (global.updateEvent) {
      global.updateEvent(updatedEvent);
    }
    router.push(NavigationPaths.timeline);
  };

  const handleCancel = () => {
    // router.back();
    router.push(NavigationPaths.timeline);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <TouchableOpacity onPress={handleCancel} style={styles.backButton}>
                <Text style={styles.backButtonText}>‹ Back</Text>
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Edit Timeline Event</Text>
            </View>
          </View>

          <View style={styles.form}>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>
                {Labels.eventDescription}
                <Text style={styles.required}> *</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Rent payment, Salary deposit"
                placeholderTextColor={Colors.textTertiary}
                value={description}
                onChangeText={setDescription}
              />
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>
                {Labels.transactionType}
                <Text style={styles.required}> *</Text>
              </Text>
              <View style={styles.typeToggleContainer}>
                <TouchableOpacity 
                  style={[
                    styles.typeToggleButton,
                    isIncome && styles.typeToggleButtonActive,
                    { backgroundColor: isIncome ? Colors.income + '20' : Colors.backgroundMedium }
                  ]}
                  onPress={() => setIsIncome(true)}
                >
                  <Feather 
                    name="trending-up" 
                    size={20} 
                    color={isIncome ? Colors.income : Colors.textSecondary}
                  />
                  <Text style={[
                    styles.typeToggleText,
                    isIncome && { color: Colors.income, fontWeight: '600' }
                  ]}>
                    {Labels.transactionTypes.income}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[
                    styles.typeToggleButton,
                    !isIncome && styles.typeToggleButtonActive,
                    { backgroundColor: !isIncome ? Colors.expense + '20' : Colors.backgroundMedium }
                  ]}
                  onPress={() => setIsIncome(false)}
                >
                  <Feather 
                    name="trending-down" 
                    size={20} 
                    color={!isIncome ? Colors.expense : Colors.textSecondary}
                  />
                  <Text style={[
                    styles.typeToggleText,
                    !isIncome && { color: Colors.expense, fontWeight: '600' }
                  ]}>
                    {Labels.transactionTypes.expense}
                  </Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.helperText}>
                {isIncome ? Labels.transactionDescriptions.income : Labels.transactionDescriptions.expense}
              </Text>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>
                {Labels.eventAmount}
                <Text style={styles.required}> *</Text>
              </Text>
              <View style={styles.amountInputWrapper}>
                <Text style={styles.currencySymbol}>$</Text>
                <TextInput
                  style={[
                    styles.input,
                    styles.amountInput,
                    { 
                      borderColor: isIncome ? Colors.income : Colors.expense,
                      backgroundColor: isIncome ? Colors.income + '10' : Colors.expense + '10'
                    }
                  ]}
                  placeholder="0.00"
                  placeholderTextColor={Colors.textTertiary}
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>

            <View style={styles.fieldContainer}>
              <DatePicker
                value={date}
                onChange={setDate}
                label={`${Labels.eventDate} *`}
              />
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>
                {Labels.eventCategory}
                <Text style={styles.required}> *</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., housing, food, income"
                placeholderTextColor={Colors.textTertiary}
                value={category}
                onChangeText={setCategory}
              />
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>
                {Labels.impactLevel}
                <Text style={styles.required}> *</Text>
              </Text>
              <View style={styles.impactButtonsContainer}>
                {(['high', 'medium', 'low'] as ImpactLevel[]).map((level) => {
                  const config = ImpactLevelConfig[level];
                  const isSelected = impactLevel === level;
                  
                  return (
                    <TouchableOpacity 
                      key={level}
                      style={[
                        styles.impactButton,
                        isSelected && styles.impactButtonSelected,
                        { 
                          backgroundColor: isSelected ? config.backgroundColor : Colors.backgroundMedium,
                          borderColor: isSelected ? config.color : 'transparent'
                        }
                      ]}
                      onPress={() => setImpactLevel(level)}
                    >
                      <Text style={[
                        styles.impactButtonText,
                        isSelected && { color: config.color, fontWeight: '600' }
                      ]}>
                        {config.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              <Text style={styles.helperText}>
                {ImpactLevelConfig[impactLevel].description}
              </Text>
            </View>

            <TouchableOpacity 
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Update Event</Text>
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
  helperText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  typeToggleContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  typeToggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  typeToggleButtonActive: {
    borderColor: Colors.textPrimary,
  },
  typeToggleText: {
    fontSize: 15,
    color: Colors.textSecondary,
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
    fontSize: 18,
  },
  impactButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  impactButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
  },
  impactButtonSelected: {
    // Border color set dynamically
  },
  impactButtonText: {
    fontSize: 14,
    color: Colors.textSecondary,
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