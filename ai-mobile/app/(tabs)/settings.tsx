import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Alert,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import {
    initializeOnDeviceInference,
    isOnDeviceAvailable,
    getInferenceStats,
} from '../../services/voiceService';
import * as DocumentPicker from 'expo-document-picker';

export default function SettingsScreen() {
    const [onDeviceReady, setOnDeviceReady] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [modelPath, setModelPath] = useState<string | null>(null);

    useEffect(() => {
        refreshStats();
    }, []);

    const refreshStats = () => {
        const currentStats = getInferenceStats();
        setOnDeviceReady(currentStats.onDeviceAvailable);
    };

    const handleLoadModel = async () => {
        try {
            // Pick a .gguf file
            const result = await DocumentPicker.getDocumentAsync({
                type: '*/*', // Accept all files (we'll filter by extension)
                copyToCacheDirectory: false,
            });

            if (result.canceled) {
                return;
            }

            const file = result.assets[0];

            if (!file.name.endsWith('.gguf')) {
                Alert.alert('Invalid File', 'Please select a .gguf model file');
                return;
            }

            setIsLoading(true);
            setModelPath(file.uri);

            // Initialize on-device inference
            const success = await initializeOnDeviceInference(file.uri);

            if (success) {
                Alert.alert(
                    'Success',
                    'Model loaded successfully! On-device inference is now available.',
                    [{ text: 'OK', onPress: refreshStats }]
                );
            } else {
                Alert.alert(
                    'Error',
                    'Failed to load model. Make sure you selected a valid FunctionGemma .gguf file.',
                    [{ text: 'OK' }]
                );
            }

        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ThemedView style={styles.container}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>

                {/* Header */}
                <View style={styles.header}>
                    <ThemedText style={styles.title}>AI Settings</ThemedText>
                    <ThemedText style={styles.subtitle}>
                        Configure on-device AI inference
                    </ThemedText>
                </View>

                {/* Model Status */}
                <View style={styles.section}>
                    <ThemedText style={styles.sectionTitle}>Model Status</ThemedText>

                    <View style={styles.statusCard}>
                        <View style={styles.statusRow}>
                            <Ionicons
                                name={onDeviceReady ? 'checkmark-circle' : 'close-circle'}
                                size={24}
                                color={onDeviceReady ? '#34C759' : '#FF3B30'}
                            />
                            <View style={styles.statusText}>
                                <ThemedText style={styles.statusLabel}>On-Device Inference</ThemedText>
                                <ThemedText style={styles.statusValue}>
                                    {onDeviceReady ? 'Ready' : 'Not Available'}
                                </ThemedText>
                            </View>
                        </View>

                        {modelPath && (
                            <ThemedText style={styles.modelPath} numberOfLines={1}>
                                {modelPath}
                            </ThemedText>
                        )}

                        <TouchableOpacity
                            style={[styles.button, isLoading && styles.buttonDisabled]}
                            onPress={handleLoadModel}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <>
                                    <Ionicons name="download" size={20} color="#fff" />
                                    <ThemedText style={styles.buttonText}>
                                        {onDeviceReady ? 'Reload Model' : 'Load Model'}
                                    </ThemedText>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Info Card */}
                <View style={styles.section}>
                    <ThemedText style={styles.sectionTitle}>About</ThemedText>
                    <View style={styles.infoCard}>
                        <View style={styles.infoRow}>
                            <Ionicons name="phone-portrait" size={20} color="#007AFF" />
                            <ThemedText style={styles.infoText}>
                                All AI processing happens on your device
                            </ThemedText>
                        </View>
                        <View style={styles.infoRow}>
                            <Ionicons name="lock-closed" size={20} color="#34C759" />
                            <ThemedText style={styles.infoText}>
                                Your data never leaves your device
                            </ThemedText>
                        </View>
                        <View style={styles.infoRow}>
                            <Ionicons name="flash" size={20} color="#FF9500" />
                            <ThemedText style={styles.infoText}>
                                Fast inference with GPU acceleration
                            </ThemedText>
                        </View>
                        <View style={styles.infoRow}>
                            <Ionicons name="cloud-offline" size={20} color="#666" />
                            <ThemedText style={styles.infoText}>
                                Works completely offline
                            </ThemedText>
                        </View>
                    </View>
                </View>

                {/* Instructions */}
                <View style={styles.section}>
                    <ThemedText style={styles.sectionTitle}>How to Load Model</ThemedText>
                    <View style={styles.instructionsCard}>
                        <ThemedText style={styles.instructionStep}>
                            1. Download FunctionGemma-270M-IT GGUF model
                        </ThemedText>
                        <ThemedText style={styles.instructionStep}>
                            2. Transfer the .gguf file to your device
                        </ThemedText>
                        <ThemedText style={styles.instructionStep}>
                            3. Tap "Load Model" and select the file
                        </ThemedText>
                        <ThemedText style={styles.instructionStep}>
                            4. Wait for model to load (may take 10-30 seconds)
                        </ThemedText>
                        <ThemedText style={styles.instructionStep}>
                            5. Start using voice commands!
                        </ThemedText>
                    </View>
                </View>

                {/* Model Info */}
                {onDeviceReady && (
                    <View style={styles.section}>
                        <ThemedText style={styles.sectionTitle}>Model Information</ThemedText>
                        <View style={styles.infoCard}>
                            <View style={styles.modelInfoRow}>
                                <ThemedText style={styles.modelInfoLabel}>Model:</ThemedText>
                                <ThemedText style={styles.modelInfoValue}>FunctionGemma-270M-IT</ThemedText>
                            </View>
                            <View style={styles.modelInfoRow}>
                                <ThemedText style={styles.modelInfoLabel}>Quantization:</ThemedText>
                                <ThemedText style={styles.modelInfoValue}>Q4_K_M</ThemedText>
                            </View>
                            <View style={styles.modelInfoRow}>
                                <ThemedText style={styles.modelInfoLabel}>Size:</ThemedText>
                                <ThemedText style={styles.modelInfoValue}>~150MB</ThemedText>
                            </View>
                            <View style={styles.modelInfoRow}>
                                <ThemedText style={styles.modelInfoLabel}>Status:</ThemedText>
                                <ThemedText style={[styles.modelInfoValue, styles.statusReady]}>
                                    Ready
                                </ThemedText>
                            </View>
                        </View>
                    </View>
                )}

            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 16,
    },
    header: {
        marginBottom: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
    },
    statusCard: {
        backgroundColor: '#f8f8f8',
        borderRadius: 12,
        padding: 16,
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    statusText: {
        marginLeft: 12,
        flex: 1,
    },
    statusLabel: {
        fontSize: 16,
        fontWeight: '600',
    },
    statusValue: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    modelPath: {
        fontSize: 12,
        color: '#999',
        marginBottom: 12,
    },
    button: {
        backgroundColor: '#007AFF',
        borderRadius: 8,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    infoCard: {
        backgroundColor: '#f8f8f8',
        borderRadius: 12,
        padding: 16,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    infoText: {
        fontSize: 14,
        color: '#333',
        marginLeft: 12,
        flex: 1,
    },
    instructionsCard: {
        backgroundColor: '#FFF9E6',
        borderRadius: 12,
        padding: 16,
    },
    instructionStep: {
        fontSize: 14,
        color: '#333',
        marginBottom: 8,
        lineHeight: 20,
    },
    modelInfoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    modelInfoLabel: {
        fontSize: 14,
        color: '#666',
    },
    modelInfoValue: {
        fontSize: 14,
        fontWeight: '600',
    },
    statusReady: {
        color: '#34C759',
    },
});
