import React, { useState } from 'react';
import { View, Text, StyleSheet, StatusBar, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const [isExpanded, setIsExpanded] = useState(false);

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
            <Text style={styles.checkIcon}>✓</Text>
          </View>
          <View style={styles.statusTextContainer}>
            <Text style={styles.statusTitle}>On Track</Text>
            <Text style={styles.statusSubtitle}>You are meeting your goals</Text>
          </View>
          <Text style={styles.dropdownIcon}>{isExpanded ? '▲' : '▼'}</Text>
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
                  <Text style={styles.safeToSpendBadgeText}>🍽️</Text>
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
            <Text style={[styles.statValue, {color: '#3B82F6'}]}>$2,450</Text>
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
    paddingBottom: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
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
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  checkIcon: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
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
  dropdownIcon: {
    fontSize: 16,
    color: '#047857',
    fontWeight: '600',
    marginLeft: 8,
  },
  dropdownContent: {
    backgroundColor: '#fff',
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
    color: '#1F2937',
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
    color: '#10B981',
    marginBottom: 4,
  },
  dropdownItemDescription: {
    fontSize: 14,
    color: '#6B7280',
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
    backgroundColor: '#E5E7EB',
    marginVertical: 20,
  },
  safeToSpendAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#3B82F6',
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
  safeToSpendBadgeText: {
    fontSize: 20,
  },
  safeToSpendNote: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 8,
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
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
    color: '#6B7280',
  },
  progressContainer: {
    backgroundColor: '#fff',
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
    color: '#374151',
  },
  progressPercentage: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 4,
  },
});