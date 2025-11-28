import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInRight,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { Colors, FRIENDS, SAMPLE_CHATS } from "@/constants/data";
import { useTheme } from "@/context";
import { ChatMessage as ChatMessageType } from "@/types";

const { width } = Dimensions.get("window");

// Message Bubble Component
const MessageBubble = ({
  message,
  isMe,
  theme,
  isDark,
  index,
}: {
  message: ChatMessageType;
  isMe: boolean;
  theme: any;
  isDark: boolean;
  index: number;
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      entering={FadeInUp.delay(index * 50).springify()}
      style={[
        animatedStyle,
        {
          alignSelf: isMe ? "flex-end" : "flex-start",
          maxWidth: "80%",
          marginBottom: 8,
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPressIn={() => { scale.value = withSpring(0.98); }}
        onPressOut={() => { scale.value = withSpring(1); }}
        onLongPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
      >
        {message.image ? (
          <View style={{
            borderRadius: 20,
            overflow: "hidden",
            borderBottomRightRadius: isMe ? 4 : 20,
            borderBottomLeftRadius: isMe ? 20 : 4,
          }}>
            <Image
              source={{ uri: message.image }}
              style={{ width: 200, height: 200 }}
              contentFit="cover"
            />
          </View>
        ) : (
          <View style={{
            backgroundColor: isMe
              ? Colors.primary
              : isDark ? "rgba(30, 41, 59, 0.8)" : theme.card,
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderRadius: 20,
            borderBottomRightRadius: isMe ? 4 : 20,
            borderBottomLeftRadius: isMe ? 20 : 4,
          }}>
            <Text style={{
              color: isMe ? "white" : theme.text,
              fontSize: 15,
              lineHeight: 22,
            }}>
              {message.text}
            </Text>
          </View>
        )}
        <Text style={{
          color: theme.textMuted,
          fontSize: 10,
          marginTop: 4,
          alignSelf: isMe ? "flex-end" : "flex-start",
        }}>
          {message.timestamp}
          {isMe && (
            <Text style={{ marginLeft: 4 }}>
              {message.isRead ? " ✓✓" : " ✓"}
            </Text>
          )}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function ChatScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const friendId = params.id as string;

  const friend = FRIENDS.find((f) => f.id === friendId);
  const existingChat = SAMPLE_CHATS.find((c) => c.friendId === friendId);

  const [messages, setMessages] = useState<ChatMessageType[]>(
    existingChat?.messages || []
  );
  const [inputText, setInputText] = useState("");
  const flatListRef = useRef<FlatList>(null);

  const sendMessage = (text?: string, image?: string) => {
    if (!text?.trim() && !image) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const newMessage: ChatMessageType = {
      id: `msg_${Date.now()}`,
      senderId: "me",
      text: text?.trim(),
      image,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isRead: false,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText("");

    // Scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // Simulate reply after 2 seconds
    setTimeout(() => {
      const replies = [
        "That sounds great! 🎬",
        "I loved that movie!",
        "We should watch it together!",
        "Have you seen the trailer?",
        "That's one of my favorites!",
      ];
      const replyMessage: ChatMessageType = {
        id: `msg_${Date.now()}_reply`,
        senderId: friendId,
        text: replies[Math.floor(Math.random() * replies.length)],
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isRead: false,
      };
      setMessages((prev) => [...prev, replyMessage]);
      
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 2000);
  };

  const pickImage = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      sendMessage(undefined, result.assets[0].uri);
    }
  };

  const openCamera = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      sendMessage(undefined, result.assets[0].uri);
    }
  };

  if (!friend) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.background, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ color: theme.text }}>Friend not found</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={0}
    >
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Background Gradient */}
      <LinearGradient
        colors={isDark ? ["#1e1b4b", "#0f172a", "#020617"] : ["#f8fafc", "#f1f5f9", "#e2e8f0"]}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      />

      {/* Header */}
      <Animated.View
        entering={FadeInDown.springify()}
        style={{
          paddingHorizontal: 20,
          paddingTop: 56,
          paddingBottom: 16,
          backgroundColor: isDark ? "rgba(2, 6, 23, 0.9)" : "rgba(255, 255, 255, 0.9)",
          borderBottomWidth: 1,
          borderBottomColor: theme.border,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.back();
            }}
            style={{
              width: 44, height: 44, borderRadius: 22,
              backgroundColor: isDark ? "rgba(30, 41, 59, 0.8)" : "rgba(226, 232, 240, 0.8)",
              alignItems: "center", justifyContent: "center", marginRight: 12,
            }}
          >
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>

          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
          >
            <View style={{ position: "relative" }}>
              <Image
                source={{ uri: friend.avatar }}
                style={{ width: 44, height: 44, borderRadius: 22 }}
                contentFit="cover"
              />
              {friend.isOnline && (
                <View style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: Colors.success,
                  borderWidth: 2,
                  borderColor: isDark ? "#020617" : "#ffffff",
                }} />
              )}
            </View>
            <View style={{ marginLeft: 12 }}>
              <Text style={{ color: theme.text, fontWeight: "700", fontSize: 17 }}>
                {friend.name}
              </Text>
              <Text style={{ color: friend.isOnline ? Colors.success : theme.textMuted, fontSize: 12 }}>
                {friend.isOnline ? "Online" : friend.lastActive}
              </Text>
            </View>
          </TouchableOpacity>

          <View style={{ flexDirection: "row", gap: 8 }}>
            <TouchableOpacity
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              style={{
                width: 40, height: 40, borderRadius: 20,
                backgroundColor: isDark ? "rgba(30, 41, 59, 0.8)" : "rgba(226, 232, 240, 0.8)",
                alignItems: "center", justifyContent: "center",
              }}
            >
              <Ionicons name="call" size={20} color={theme.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              style={{
                width: 40, height: 40, borderRadius: 20,
                backgroundColor: isDark ? "rgba(30, 41, 59, 0.8)" : "rgba(226, 232, 240, 0.8)",
                alignItems: "center", justifyContent: "center",
              }}
            >
              <Ionicons name="videocam" size={20} color={theme.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        renderItem={({ item, index }) => (
          <MessageBubble
            message={item}
            isMe={item.senderId === "me"}
            theme={theme}
            isDark={isDark}
            index={index}
          />
        )}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Animated.View
            entering={FadeIn}
            style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: 100 }}
          >
            <Image
              source={{ uri: friend.avatar }}
              style={{ width: 80, height: 80, borderRadius: 40, marginBottom: 16 }}
              contentFit="cover"
            />
            <Text style={{ color: theme.text, fontSize: 18, fontWeight: "700", marginBottom: 8 }}>
              {friend.name}
            </Text>
            <Text style={{ color: theme.textSecondary, fontSize: 14, textAlign: "center", paddingHorizontal: 40 }}>
              Send a message to start chatting about movies!
            </Text>
          </Animated.View>
        }
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
      />

      {/* Input */}
      <Animated.View
        entering={FadeInUp.springify()}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          paddingHorizontal: 16,
          paddingVertical: 12,
          paddingBottom: 32,
          backgroundColor: isDark ? "rgba(2, 6, 23, 0.95)" : "rgba(255, 255, 255, 0.95)",
          borderTopWidth: 1,
          borderTopColor: theme.border,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <TouchableOpacity
            onPress={openCamera}
            style={{
              width: 44, height: 44, borderRadius: 22,
              backgroundColor: isDark ? "rgba(30, 41, 59, 0.8)" : theme.card,
              alignItems: "center", justifyContent: "center",
            }}
          >
            <Ionicons name="camera" size={22} color={theme.primary} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={pickImage}
            style={{
              width: 44, height: 44, borderRadius: 22,
              backgroundColor: isDark ? "rgba(30, 41, 59, 0.8)" : theme.card,
              alignItems: "center", justifyContent: "center",
            }}
          >
            <Ionicons name="image" size={22} color={theme.primary} />
          </TouchableOpacity>

          <View style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: isDark ? "rgba(30, 41, 59, 0.8)" : theme.card,
            borderRadius: 24,
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderWidth: isDark ? 0 : 1,
            borderColor: theme.border,
          }}>
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type a message..."
              placeholderTextColor={theme.textMuted}
              style={{
                flex: 1,
                fontSize: 15,
                color: theme.text,
                maxHeight: 100,
              }}
              multiline
              onSubmitEditing={() => sendMessage(inputText)}
            />
            <TouchableOpacity onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
              <Ionicons name="happy-outline" size={22} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => sendMessage(inputText)}
            disabled={!inputText.trim()}
            style={{ opacity: inputText.trim() ? 1 : 0.5 }}
          >
            <LinearGradient
              colors={[Colors.primary, Colors.primaryDark]}
              style={{
                width: 44, height: 44, borderRadius: 22,
                alignItems: "center", justifyContent: "center",
              }}
            >
              <Ionicons name="send" size={20} color="white" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}
