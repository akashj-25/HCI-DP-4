// frontend/constants/design.ts
// Centralized design system for H4 consistency

// ============================================================================
// COLOR SYSTEM - Consistent meanings across the app
// ============================================================================
export const Colors = {
  // Transaction Types
  income: '#10B981',        // Green - always represents income/positive
  expense: '#EF4444',       // Red - always represents expense/negative
  whatIf: '#A855F7',        // Purple - always represents what-if scenarios
  neutral: '#3B82F6',       // Blue - progress, general actions
  
  // UI States
  success: '#10B981',
  warning: '#F59E0B',
  error: '#DC2626',
  
  // Backgrounds
  backgroundLight: '#F9FAFB',
  backgroundMedium: '#F3F4F6',
  cardBackground: '#FFFFFF',
  
  // Text
  textPrimary: '#1F2937',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  
  // Borders
  borderLight: '#F3F4F6',
  borderMedium: '#E5E7EB',
  borderDark: '#D1D5DB',
} as const;

// ============================================================================
// ICON SYSTEM - Standard icons replacing emojis
// ============================================================================
export const IconNames = {
  // Navigation (for tab bar)
  home: 'home',
  goals: 'target',
  timeline: 'calendar',
  profile: 'user',
  
  // Actions
  add: 'plus',
  edit: 'edit-2',
  delete: 'trash-2',
  back: 'arrow-left',
  forward: 'arrow-right',
  expand: 'chevron-down',
  collapse: 'chevron-up',
  
  // Financial
  income: 'trending-up',
  expense: 'trending-down',
  savings: 'piggy-bank',
  
  // Goal Priority
  primary: 'star',          // Star icon for primary goal (replaces ❗)
  
  // Status
  success: 'check-circle',
  warning: 'alert-triangle',
  info: 'info',
  
  // Categories
  housing: 'home',
  food: 'shopping-bag',
  transportation: 'truck',
  entertainment: 'smile',
  health: 'heart',
  education: 'book',
} as const;

// ============================================================================
// DATE SYSTEM - Single format across app
// ============================================================================
export const DateFormats = {
  // Use MM/DD/YYYY for US locale consistency
  input: 'MM/DD/YYYY',
  display: 'MMM DD, YYYY',
  storage: 'YYYY-MM-DD',    // ISO format for storage
} as const;

export const DateConfig = {
  placeholder: 'MM/DD/YYYY',
  format: DateFormats.input,
  
  // Helper to convert display format to storage format
  toStorage: (dateString: string): string => {
    // Converts MM/DD/YYYY to YYYY-MM-DD
    const [month, day, year] = dateString.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  },
  
  // Helper to convert storage format to display format
  toDisplay: (dateString: string): string => {
    // Converts YYYY-MM-DD to MM/DD/YYYY
    const [year, month, day] = dateString.split('-');
    return `${month}/${day}/${year}`;
  },
  
  // Validate MM/DD/YYYY format
  validate: (dateString: string): boolean => {
    const regex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
    if (!regex.test(dateString)) return false;
    
    const [month, day, year] = dateString.split('/').map(Number);
    const date = new Date(year, month - 1, day);
    return date.getMonth() === month - 1 && date.getDate() === day;
  }
} as const;

// ============================================================================
// TERMINOLOGY - Standardized labels
// ============================================================================
export const Labels = {
  // Goals
  goalName: 'Goal Name',
  goalDescription: 'Description (Optional)',
  targetAmount: 'Target Amount',
  currentAmount: 'Current Amount',
  targetDate: 'Target Date',
  
  // Timeline Events
  eventDescription: 'Event Description',
  eventAmount: 'Amount',
  eventDate: 'Date',
  eventCategory: 'Category',
  
  // Impact Levels (replaces "Event Size")
  impactLevel: 'Impact Level',
  impactLevels: {
    high: 'High Impact',
    medium: 'Medium Impact', 
    low: 'Low Impact',
  },
  impactDescriptions: {
    high: 'Major financial event (rent, salary, large purchase)',
    medium: 'Moderate expense or income (utilities, subscriptions)',
    low: 'Small daily transaction (coffee, snacks)',
  },
  
  // Transaction Types
  transactionType: 'Transaction Type',
  transactionTypes: {
    income: 'Income',
    expense: 'Expense',
  },
  transactionDescriptions: {
    income: 'Money coming in (salary, gift, refund)',
    expense: 'Money going out (bills, purchases, fees)',
  },
} as const;

// ============================================================================
// NAVIGATION - Consistent return destinations
// ============================================================================
export const NavigationPaths = {
  home: '/(tabs)/',
  goals: '/(tabs)/goals',
  timeline: '/(tabs)/timeline',
  profile: '/(tabs)/profile',
  
  // Modals
  addGoal: '/(tabs)/add-goal-modal',
  editGoal: '/(tabs)/edit-goal-modal',
  addEvent: '/(tabs)/add-event-modal',
  editEvent: '/(tabs)/edit-event-modal',
} as const;

// ============================================================================
// BUTTON STYLES - Consistent interaction patterns
// ============================================================================
export const ButtonStyles = {
  primary: {
    backgroundColor: Colors.neutral,
    color: '#FFFFFF',
  },
  secondary: {
    backgroundColor: Colors.backgroundMedium,
    color: Colors.textPrimary,
  },
  danger: {
    backgroundColor: '#FEE2E2',
    color: Colors.error,
  },
  success: {
    backgroundColor: '#D1FAE5',
    color: Colors.income,
  },
} as const;

// ============================================================================
// IMPACT LEVEL MAPPINGS (replaces Event Size/Type)
// ============================================================================
export type ImpactLevel = 'high' | 'medium' | 'low';

export const ImpactLevelConfig = {
  high: {
    color: Colors.error,
    backgroundColor: '#FEE2E2',
    importance: 10,
    label: Labels.impactLevels.high,
    description: Labels.impactDescriptions.high,
  },
  medium: {
    color: Colors.warning,
    backgroundColor: '#FEF3C7',
    importance: 5,
    label: Labels.impactLevels.medium,
    description: Labels.impactDescriptions.medium,
  },
  low: {
    color: Colors.income,
    backgroundColor: '#D1FAE5',
    importance: 1,
    label: Labels.impactLevels.low,
    description: Labels.impactDescriptions.low,
  },
} as const;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

// Format currency consistently
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

// Get color for amount (income vs expense)
export const getAmountColor = (amount: number): string => {
  return amount >= 0 ? Colors.income : Colors.expense;
};

// Format amount with sign
export const formatAmount = (amount: number): string => {
  const sign = amount >= 0 ? '+' : '';
  return `${sign}${formatCurrency(Math.abs(amount))}`;
};