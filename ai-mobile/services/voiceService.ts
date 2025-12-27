/**
 * Voice Service - On-Device Only
 * 
 * This service handles voice command parsing using on-device inference only.
 * No backend server required.
 */

import { getFunctionGemmaEngine, FunctionCall } from './llamaEngine';

export type { FunctionCall };

export enum InferenceMode {
    ON_DEVICE = 'on_device',
    AUTO = 'auto', // Same as ON_DEVICE (kept for compatibility)
}

let currentMode: InferenceMode = InferenceMode.ON_DEVICE;
let onDeviceAvailable = false;
let autoInitAttempted = false;

/**
 * Auto-initialize on-device inference with bundled model
 * Call this on app startup
 */
export async function autoInitializeOnDevice(): Promise<boolean> {
    if (autoInitAttempted) {
        return onDeviceAvailable;
    }

    autoInitAttempted = true;
    console.log('[VoiceService] Auto-initializing on-device inference...');

    try {
        const engine = getFunctionGemmaEngine();
        const success = await engine.tryLoadBundledModel();

        if (success) {
            onDeviceAvailable = true;
            console.log('[VoiceService] Bundled model loaded successfully!');
            return true;
        } else {
            console.log('[VoiceService] No bundled model found or failed to load');
            return false;
        }
    } catch (error) {
        console.warn('[VoiceService] Auto-init failed:', error);
        return false;
    }
}

/**
 * Initialize on-device inference with custom model path
 * @param modelPath Path to the .gguf model file
 * @returns true if successful
 */
export async function initializeOnDeviceInference(modelPath: string): Promise<boolean> {
    try {
        const engine = getFunctionGemmaEngine();
        const success = await engine.loadModel(modelPath);

        if (success) {
            onDeviceAvailable = true;
            console.log('[VoiceService] On-device inference initialized');
            return true;
        } else {
            console.warn('[VoiceService] On-device inference failed:', engine.getLoadError());
            return false;
        }
    } catch (error) {
        console.error('[VoiceService] Failed to initialize on-device inference:', error);
        return false;
    }
}

/**
 * Set the inference mode (kept for compatibility)
 */
export function setInferenceMode(mode: InferenceMode): void {
    currentMode = mode;
    console.log('[VoiceService] Inference mode set to:', mode);
}

/**
 * Get current inference mode
 */
export function getInferenceMode(): InferenceMode {
    return currentMode;
}

/**
 * Check if on-device inference is available
 */
export function isOnDeviceAvailable(): boolean {
    return onDeviceAvailable;
}

/**
 * Parse voice command using on-device inference
 */
async function parseCommandOnDevice(command: string): Promise<FunctionCall> {
    const engine = getFunctionGemmaEngine();

    if (!engine.isModelLoaded()) {
        throw new Error('On-device model not loaded. Please load a model first.');
    }

    return await engine.parseCommand(command);
}

/**
 * Parse voice command (on-device only)
 * 
 * @param command Natural language command
 * @returns Parsed function call
 * @throws Error if model not loaded
 */
export async function parseVoiceCommand(command: string): Promise<FunctionCall> {
    console.log(`[VoiceService] Parsing command (on-device):`, command);

    try {
        const result = await parseCommandOnDevice(command);
        console.log('[VoiceService] Parsed successfully:', result);
        return result;
    } catch (error: any) {
        console.error('[VoiceService] Parsing failed:', error);

        // Fallback: treat as search query
        console.log('[VoiceService] Falling back to search');
        return {
            name: 'search_web',
            parameters: { query: command },
        };
    }
}

/**
 * Get inference statistics
 */
export function getInferenceStats(): {
    mode: InferenceMode;
    onDeviceAvailable: boolean;
} {
    return {
        mode: currentMode,
        onDeviceAvailable,
    };
}
