import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>

        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="sparkles" size={48} color="#007AFF" />
          <ThemedText style={styles.title}>Welcome to Nova</ThemedText>
          <ThemedText style={styles.subtitle}>
            Voice-Controlled AI Browser
          </ThemedText>
        </View>

        {/* Features */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Features</ThemedText>

          <View style={styles.featureCard}>
            <Ionicons name="mic" size={24} color="#007AFF" />
            <View style={styles.featureText}>
              <ThemedText style={styles.featureTitle}>Voice Commands</ThemedText>
              <ThemedText style={styles.featureDescription}>
                Control your browser using natural language
              </ThemedText>
            </View>
          </View>

          <View style={styles.featureCard}>
            <Ionicons name="phone-portrait" size={24} color="#34C759" />
            <View style={styles.featureText}>
              <ThemedText style={styles.featureTitle}>On-Device AI</ThemedText>
              <ThemedText style={styles.featureDescription}>
                All processing happens locally on your device
              </ThemedText>
            </View>
          </View>

          <View style={styles.featureCard}>
            <Ionicons name="lock-closed" size={24} color="#FF9500" />
            <View style={styles.featureText}>
              <ThemedText style={styles.featureTitle}>Privacy First</ThemedText>
              <ThemedText style={styles.featureDescription}>
                Your data never leaves your device
              </ThemedText>
            </View>
          </View>

          <View style={styles.featureCard}>
            <Ionicons name="cloud-offline" size={24} color="#666" />
            <View style={styles.featureText}>
              <ThemedText style={styles.featureTitle}>Works Offline</ThemedText>
              <ThemedText style={styles.featureDescription}>
                No internet required for AI processing
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Quick Start */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Quick Start</ThemedText>
          <View style={styles.instructionsCard}>
            <ThemedText style={styles.instructionStep}>
              1. Go to Settings tab and load the AI model
            </ThemedText>
            <ThemedText style={styles.instructionStep}>
              2. Navigate to the Browser tab
            </ThemedText>
            <ThemedText style={styles.instructionStep}>
              3. Tap the microphone icon
            </ThemedText>
            <ThemedText style={styles.instructionStep}>
              4. Say a command like "open google" or "search for cats"
            </ThemedText>
          </View>
        </View>

        {/* Voice Commands */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Voice Commands</ThemedText>
          <View style={styles.commandsCard}>
            <View style={styles.commandRow}>
              <ThemedText style={styles.commandText}>"open google"</ThemedText>
              <ThemedText style={styles.commandDescription}>Navigate to website</ThemedText>
            </View>
            <View style={styles.commandRow}>
              <ThemedText style={styles.commandText}>"search for AI"</ThemedText>
              <ThemedText style={styles.commandDescription}>Google search</ThemedText>
            </View>
            <View style={styles.commandRow}>
              <ThemedText style={styles.commandText}>"go back"</ThemedText>
              <ThemedText style={styles.commandDescription}>Browser back</ThemedText>
            </View>
            <View style={styles.commandRow}>
              <ThemedText style={styles.commandText}>"refresh page"</ThemedText>
              <ThemedText style={styles.commandDescription}>Reload page</ThemedText>
            </View>
          </View>
        </View>

      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  featureText: {
    marginLeft: 16,
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
  },
  instructionsCard: {
    backgroundColor: '#E6F4FE',
    borderRadius: 12,
    padding: 16,
  },
  instructionStep: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    lineHeight: 20,
  },
  commandsCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 16,
  },
  commandRow: {
    marginBottom: 12,
  },
  commandText: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
    color: '#007AFF',
  },
  commandDescription: {
    fontSize: 13,
    color: '#666',
  },
});
