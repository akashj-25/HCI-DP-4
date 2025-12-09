// frontend/app/(tabs)/index.tsx
// FIXED VERSION - Star icon for primary goal, consistent styling

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../../constants/design';

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
  var getPrimaryGoal: (() => Goal | undefined) | undefined;
}

export default function HomeScreen() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [primaryGoal, setPrimaryGoal] = useState<Goal | undefined>(undefined);

  useEffect(() => {
    const updatePrimaryGoal = () => {
      if (global.getPrimaryGoal) {
        setPrimaryGoal(global.getPrimaryGoal());
      }
    };

    updatePrimaryGoal();
    const interval = setInterval(updatePrimaryGoal, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Budget Status</Text>
          <Text style={styles.subtitle}>Your financial overview</Text>
        </View>

        {/* On Track Card with Dropdown */}
        <TouchableOpacity 
          style={styles.statusCard} 
          onPress={() => setIsExpanded(!isExpanded)}
          activeOpacity={0.8}
        >
          <View style={styles.iconCircle}>
            <Feather name="check" size={24} color="#fff" />
          </View>
          <View style={styles.statusTextContainer}>
            <Text style={styles.statusTitle}>On Track</Text>
            <Text style={styles.statusSubtitle}>You are meeting your goals</Text>
          </View>
          <Feather 
            name={isExpanded ? "chevron-up" : "chevron-down"} 
            size={20} 
            color="#047857"
          />
        </TouchableOpacity>

        {/* Expanded Dropdown Content */}
        {isExpanded && (
          <View style={styles.dropdownContent}>
            {/* Irregular Income Section */}
            <View style={styles.dropdownSection}>
              <Text style={styles.dropdownSectionTitle}>Irregular Income</Text>
              <View style={styles.dropdownItem}>
                <View style={styles.dropdownItemLeft}>
                  <Text style={styles.dropdownItemAmount}>+$1,000</Text>
                  <Text style={styles.dropdownItemDescription}>Birthday present from parents</Text>
                </View>
                <View style={styles.irregularBadge}>
                  <Text style={styles.irregularBadgeText}>NEW</Text>
                </View>
              </View>
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Safe To Spend Section */}
            <View style={styles.dropdownSection}>
              <Text style={styles.dropdownSectionTitle}>Safe To Spend</Text>
              <View style={styles.dropdownItem}>
                <View style={styles.dropdownItemLeft}>
                  <Text style={styles.safeToSpendAmount}>$100</Text>
                  <Text style={styles.dropdownItemDescription}>Available for eating out this week</Text>
                </View>
                <View style={styles.safeToSpendBadge}>
                  <Feather name="coffee" size={20} color={Colors.neutral} />
                </View>
              </View>
              <Text style={styles.safeToSpendNote}>
                Spending this amount keeps you on track with your goals
              </Text>
            </View>
          </View>
        )}

        {/* Quick Stats Section */}
        <Text style={styles.sectionTitle}>Quick Stats</Text>
        
        <View style={styles.statsRow}>
          {/* Current Balance Card */}
          <View style={[styles.statCard, styles.balanceCard]}>
            <Text style={[styles.statValue, {color: Colors.neutral}]}>$2,450</Text>
            <Text style={styles.statLabel}>Current Balance</Text>
          </View>

          {/* Active Goals Card */}
          <View style={[styles.statCard, styles.goalsCard]}>
            <Text style={[styles.statValue, {color: '#8B5CF6'}]}>3</Text>
            <Text style={styles.statLabel}>Active Goals</Text>
          </View>
        </View>

        {/* Monthly Progress */}
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Monthly Progress</Text>
            <Text style={styles.progressPercentage}>68%</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: '68%' }]} />
          </View>
        </View>

        {/* FIXED: Primary Goal with Star Icon */}
        {primaryGoal && (
          <View style={styles.primaryGoalContainer}>
            <View style={styles.primaryGoalHeader}>
              <View style={styles.primaryGoalTitleRow}>
                <Feather name="star" size={20} color={Colors.warning} fill={Colors.warning} />
                <Text style={styles.primaryGoalTitle}>Primary Goal</Text>
              </View>
              <TouchableOpacity style={styles.viewGoalsButton}>
                <Text style={styles.viewGoalsText}>View All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.primaryGoalCard}>
              <View style={styles.primaryGoalInfo}>
                <View style={styles.primaryGoalIconContainer}>
                  <View style={[styles.primaryGoalIcon, { backgroundColor: `${primaryGoal.color}20` }]}>
                    <Text style={styles.primaryGoalIconText}>{primaryGoal.icon}</Text>
                  </View>
                  <View style={styles.primaryGoalTextContainer}>
                    <Text style={styles.primaryGoalName}>{primaryGoal.name}</Text>
                    <Text style={styles.primaryGoalDescription}>{primaryGoal.description}</Text>
                  </View>
                </View>
                <View style={styles.primaryGoalProgress}>
                  <Text style={styles.primaryGoalAmount}>
                    ${primaryGoal.current.toLocaleString()} / ${primaryGoal.target.toLocaleString()}
                  </Text>
                  <View style={styles.primaryGoalProgressBar}>
                    <View 
                      style={[
                        styles.primaryGoalProgressFill, 
                        { 
                          width: `${Math.min((primaryGoal.current / primaryGoal.target) * 100, 100)}%`,
                          backgroundColor: primaryGoal.color 
                        }
                      ]} 
                    />
                  </View>
                  <Text style={styles.primaryGoalPercentage}>
                    {Math.round((primaryGoal.current / primaryGoal.target) * 100)}% complete
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}
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
    paddingBottom: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  statusCard: {
    backgroundColor: '#D1FAE5',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  statusTextContainer: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#065F46',
    marginBottom: 2,
  },
  statusSubtitle: {
    fontSize: 14,
    color: '#047857',
  },
  dropdownContent: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    marginBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dropdownSection: {
    marginBottom: 0,
  },
  dropdownSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownItemLeft: {
    flex: 1,
  },
  dropdownItemAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.success,
    marginBottom: 4,
  },
  dropdownItemDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  irregularBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  irregularBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400E',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderMedium,
    marginVertical: 20,
  },
  safeToSpendAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.neutral,
    marginBottom: 4,
  },
  safeToSpendBadge: {
    backgroundColor: '#DBEAFE',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  safeToSpendNote: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 8,
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 28,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    padding: 20,
  },
  balanceCard: {
    backgroundColor: '#EFF6FF',
  },
  goalsCard: {
    backgroundColor: '#F5F3FF',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  progressContainer: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  progressPercentage: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: Colors.borderMedium,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.neutral,
    borderRadius: 4,
  },
  primaryGoalContainer: {
    marginBottom: 20,
  },
  primaryGoalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryGoalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  primaryGoalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  viewGoalsButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: Colors.backgroundMedium,
  },
  viewGoalsText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  primaryGoalCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  primaryGoalInfo: {
    gap: 16,
  },
  primaryGoalIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  primaryGoalIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryGoalIconText: {
    fontSize: 24,
  },
  primaryGoalTextContainer: {
    flex: 1,
  },
  primaryGoalName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  primaryGoalDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  primaryGoalProgress: {
    gap: 8,
  },
  primaryGoalAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  primaryGoalProgressBar: {
    height: 12,
    backgroundColor: Colors.borderMedium,
    borderRadius: 6,
    overflow: 'hidden',
  },
  primaryGoalProgressFill: {
    height: '100%',
    borderRadius: 6,
  },
  primaryGoalPercentage: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});