import React, { useState } from 'react';
import { StyleSheet, TextInput, Button, FlatList, View, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { sendMessage } from '@/services/api';

export default function ChatScreen() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await sendMessage(newMessages);

      // Backend now returns AgentResponse: { intent, message, data }
      if (response && response.message) {
        setMessages(prev => [...prev, { role: 'assistant', content: response.message }]);
        // Optional: Handle intent here (e.g. navigation or tool trigger)
        console.log("Intent:", response.intent);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: "Received empty response." }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Error: Could not connect to backend. Make sure the FastAPI server is running." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          data={messages}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={[styles.messageBubble, item.role === 'user' ? styles.userBubble : styles.aiBubble]}>
              <ThemedText style={{ color: item.role === 'user' ? '#fff' : '#000' }}>
                {item.content}
              </ThemedText>
            </View>
          )}
          contentContainerStyle={styles.listContent}
          inverted={false}
        />

        {loading && <ActivityIndicator style={{ margin: 10 }} />}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Ask AI..."
            placeholderTextColor="#888"
          />
          <Button title="Send" onPress={handleSend} disabled={loading} />
        </View>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingTop: 60,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
    maxWidth: '85%',
    marginVertical: 4,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF', // Blue
    borderBottomRightRadius: 2,
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#E5E5EA', // Light gray
    borderBottomLeftRadius: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#333', // darker border for dark mode compatibility check
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)'
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    backgroundColor: '#fff',
    color: '#000',
  },
});
