// frontend/components/DatePicker.tsx
// Standardized date input component for H4 consistency

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Platform,
} from 'react-native';
import { DateConfig, Colors } from '../constants/design';

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  label?: string;
  error?: string;
  style?: any;
}

/**
 * Standardized DatePicker Component
 * 
 * Features:
 * - Consistent MM/DD/YYYY format across app
 * - Auto-formatting as user types
 * - Validation with helpful error messages
 * - Native date picker on mobile (future enhancement)
 * 
 * Usage:
 * <DatePicker 
 *   value={date} 
 *   onChange={setDate}
 *   label="Target Date"
 * />
 */
export default function DatePicker({ 
  value, 
  onChange, 
  label,
  error,
  style 
}: DatePickerProps) {
  const [focused, setFocused] = useState(false);

  // Auto-format date as user types
  const handleTextChange = (text: string) => {
    // Remove all non-numeric characters
    const cleaned = text.replace(/[^\d]/g, '');
    
    // Auto-insert slashes
    let formatted = cleaned;
    if (cleaned.length >= 2) {
      formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2);
    }
    if (cleaned.length >= 4) {
      formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4) + '/' + cleaned.slice(4, 8);
    }
    
    onChange(formatted);
  };

  // Validate on blur
  const handleBlur = () => {
    setFocused(false);
    
    // Only validate if there's a value
    if (value && !DateConfig.validate(value)) {
      // Value is invalid but we won't clear it - let parent handle error display
    }
  };

  const isValid = !value || DateConfig.validate(value);
  const showError = !focused && !isValid;

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={styles.label}>{label}</Text>
      )}
      
      <View style={styles.inputWrapper}>
        <TextInput
          style={[
            styles.input,
            focused && styles.inputFocused,
            showError && styles.inputError,
          ]}
          placeholder={DateConfig.placeholder}
          placeholderTextColor={Colors.textTertiary}
          value={value}
          onChangeText={handleTextChange}
          onFocus={() => setFocused(true)}
          onBlur={handleBlur}
          keyboardType="numeric"
          maxLength={10}
        />
        <View style={styles.iconContainer}>
          <Text style={styles.calendarIcon}>📅</Text>
        </View>
      </View>

      {showError && (
        <Text style={styles.errorText}>
          Please enter a valid date in MM/DD/YYYY format
        </Text>
      )}
      
      {error && !showError && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      <Text style={styles.helperText}>
        Format: {DateConfig.placeholder}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.borderMedium,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    paddingRight: 48,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  inputFocused: {
    borderColor: Colors.neutral,
    borderWidth: 2,
  },
  inputError: {
    borderColor: Colors.error,
    backgroundColor: '#FEF2F2',
  },
  iconContainer: {
    position: 'absolute',
    right: 16,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarIcon: {
    fontSize: 20,
    opacity: 0.5,
  },
  errorText: {
    fontSize: 12,
    color: Colors.error,
    marginTop: 4,
  },
  helperText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
});