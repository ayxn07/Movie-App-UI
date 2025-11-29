import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useRef, useState, useEffect } from "react";
import {
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
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
} from "react-native-reanimated";
import EmojiPicker from "rn-emoji-keyboard";

import { Colors } from "@/constants/data";
import { ChatMessage, useApp, useTheme } from "@/context";

const { width, height } = Dimensions.get("window");

// Message Bubble Component
const MessageBubble = ({
  message,
  isMe,
  index,
}: {
  message: ChatMessage;
  isMe: boolean;
  index: number;
}) => {
  const { theme, isDark } = useTheme();

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <Animated.View
      entering={FadeInUp.delay(index * 50).springify()}
      style={{
        alignSelf: isMe ? "flex-end" : "flex-start",
        maxWidth: "80%",
        marginBottom: 12,
      }}
    >
      {message.type === "image" && message.imageUri ? (
        <View style={{
          borderRadius: 20,
          overflow: "hidden",
          marginBottom: 4,
        }}>
          <Image
            source={{ uri: message.imageUri }}
            style={{ width: 200, height: 200 }}
            contentFit="cover"
          />
        </View>
      ) : (
        <View style={{
          backgroundColor: isMe
            ? theme.primary
            : isDark ? "rgba(30, 41, 59, 0.8)" : theme.card,
          borderRadius: 20,
          borderBottomRightRadius: isMe ? 4 : 20,
          borderBottomLeftRadius: isMe ? 20 : 4,
          paddingHorizontal: 16,
          paddingVertical: 12,
        }}>
          <Text style={{
            color: isMe ? "white" : theme.text,
            fontSize: 15,
            lineHeight: 22,
          }}>
            {message.content}
          </Text>
        </View>
      )}
      <Text style={{
        color: theme.textMuted,
        fontSize: 11,
        marginTop: 4,
        alignSelf: isMe ? "flex-end" : "flex-start",
      }}>
        {formatTime(message.createdAt)}
        {isMe && (
          <Text> • {message.isRead ? "Read" : "Sent"}</Text>
        )}
      </Text>
    </Animated.View>
  );
};

// Image Preview Modal
const ImagePreviewModal = ({
  visible,
  imageUri,
  onClose,
  onSend,
}: {
  visible: boolean;
  imageUri: string | null;
  onClose: () => void;
  onSend: () => void;
}) => {
  const { theme, isDark } = useTheme();

  if (!imageUri) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.9)", justifyContent: "center", alignItems: "center" }}>
        <TouchableOpacity
          onPress={onClose}
          style={{ position: "absolute", top: 50, right: 20, zIndex: 10, padding: 10 }}
        >
          <Ionicons name="close" size={28} color="white" />
        </TouchableOpacity>
        
        <Image
          source={{ uri: imageUri }}
          style={{ width: width - 40, height: height * 0.5, borderRadius: 16 }}
          contentFit="contain"
        />

        <View style={{ flexDirection: "row", gap: 20, marginTop: 30 }}>
          <TouchableOpacity
            onPress={onClose}
            style={{
              paddingHorizontal: 32,
              paddingVertical: 14,
              borderRadius: 16,
              backgroundColor: "rgba(255,255,255,0.2)",
            }}
          >
            <Text style={{ color: "white", fontWeight: "600", fontSize: 16 }}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onSend}>
            <LinearGradient
              colors={[Colors.primary, Colors.primaryDark]}
              style={{
                paddingHorizontal: 32,
                paddingVertical: 14,
                borderRadius: 16,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Ionicons name="send" size={18} color="white" />
              <Text style={{ color: "white", fontWeight: "700", fontSize: 16, marginLeft: 8 }}>Send</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default function ChatScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const friendId = params.id as string;
  const { friends, getMessagesForFriend, sendMessage, showToast } = useApp();
  const scrollViewRef = useRef<ScrollView>(null);

  const [inputText, setInputText] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Handle keyboard events
  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      () => {
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    );

    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        // Keyboard hidden - no action needed
      }
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  const handleEmojiSelected = (emoji: { emoji: string }) => {
    setInputText((prev) => prev + emoji.emoji);
  };

  const friend = friends.find((f) => f.id === friendId);
  const messages = getMessagesForFriend(friendId);

  const handleSend = () => {
    if (!inputText.trim()) return;
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    sendMessage(friendId, inputText.trim(), "text");
    setInputText("");
    
    // Scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handlePickImage = async (source: "camera" | "gallery") => {
    setShowAttachMenu(false);

    let result;
    
    if (source === "camera") {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        showToast("Camera permission is required", "error");
        return;
      }
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
    } else {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        showToast("Gallery permission is required", "error");
        return;
      }
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
    }

    if (!result.canceled && result.assets[0]) {
      setPreviewImage(result.assets[0].uri);
      setShowImagePreview(true);
    }
  };

  const handleSendImage = () => {
    if (!previewImage) return;
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    sendMessage(friendId, "Photo", "image", previewImage);
    setPreviewImage(null);
    setShowImagePreview(false);
    showToast("Image sent!", "success");
    
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  if (!friend) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.background, alignItems: "center", justifyContent: "center" }}>
        <StatusBar style={isDark ? "light" : "dark"} />
        <Ionicons name="person-outline" size={64} color={theme.textMuted} />
        <Text style={{ color: theme.text, fontSize: 20, fontWeight: "700", marginTop: 16 }}>Friend Not Found</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginTop: 24, backgroundColor: theme.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 }}
        >
          <Text style={{ color: "white", fontWeight: "600" }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 25}
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
          
          <View style={{ position: "relative" }}>
            <Image
              source={{ uri: friend.avatar }}
              style={{ width: 44, height: 44, borderRadius: 22 }}
              contentFit="cover"
            />
            <View style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              width: 12,
              height: 12,
              borderRadius: 6,
              backgroundColor: friend.isOnline ? Colors.success : theme.textMuted,
              borderWidth: 2,
              borderColor: isDark ? theme.background : "white",
            }} />
          </View>
          
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={{ color: theme.text, fontWeight: "700", fontSize: 17 }}>{friend.name}</Text>
            <Text style={{ color: theme.textSecondary, fontSize: 13 }}>
              {friend.isOnline ? "Online" : friend.lastSeen}
            </Text>
          </View>

          <TouchableOpacity 
            style={{ padding: 8 }}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push(`/videocall/${friendId}`);
            }}
          >
            <Ionicons name="videocam-outline" size={24} color={theme.primary} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={{ padding: 8 }}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push(`/voicecall/${friendId}`);
            }}
          >
            <Ionicons name="call-outline" size={22} color={theme.primary} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={{ flex: 1, paddingHorizontal: 20 }}
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: false })}
        keyboardShouldPersistTaps="handled"
      >
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageBubble
              key={message.id}
              message={message}
              isMe={message.senderId === "me"}
              index={index}
            />
          ))
        ) : (
          <Animated.View
            entering={FadeIn.delay(200)}
            style={{ alignItems: "center", paddingTop: 60 }}
          >
            <View style={{
              width: 80, height: 80, borderRadius: 40,
              backgroundColor: isDark ? "rgba(30, 41, 59, 0.6)" : theme.card,
              alignItems: "center", justifyContent: "center", marginBottom: 16,
            }}>
              <Ionicons name="chatbubbles-outline" size={40} color={theme.textMuted} />
            </View>
            <Text style={{ color: theme.text, fontSize: 18, fontWeight: "700", marginBottom: 4 }}>
              No messages yet
            </Text>
            <Text style={{ color: theme.textSecondary, fontSize: 14, textAlign: "center", paddingHorizontal: 40 }}>
              Start a conversation with {friend.name}!
            </Text>
          </Animated.View>
        )}
      </ScrollView>

      {/* Input Area */}
      <Animated.View
        entering={FadeInUp.delay(100)}
        style={{
          paddingHorizontal: 20,
          paddingVertical: 12,
          paddingBottom: Platform.OS === "ios" ? 32 : 16,
          backgroundColor: isDark ? "rgba(2, 6, 23, 0.95)" : "rgba(255, 255, 255, 0.95)",
          borderTopWidth: 1,
          borderTopColor: theme.border,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 12 }}>
          {/* Attachment Button */}
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setShowAttachMenu(!showAttachMenu);
              setShowEmojiPicker(false);
            }}
            style={{
              width: 44, height: 44, borderRadius: 22,
              backgroundColor: isDark ? "rgba(30, 41, 59, 0.8)" : theme.card,
              alignItems: "center", justifyContent: "center",
            }}
          >
            <Ionicons name="add" size={24} color={theme.primary} />
          </TouchableOpacity>

          {/* Text Input */}
          <View style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "flex-end",
            backgroundColor: isDark ? "rgba(30, 41, 59, 0.8)" : theme.card,
            borderRadius: 24,
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderWidth: isDark ? 0 : 1,
            borderColor: theme.border,
            minHeight: 44,
            maxHeight: 120,
          }}>
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type a message..."
              placeholderTextColor={theme.textMuted}
              multiline
              style={{
                flex: 1,
                fontSize: 15,
                color: theme.text,
                maxHeight: 100,
                paddingVertical: 4,
              }}
            />
            <TouchableOpacity 
              style={{ padding: 4 }}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                Keyboard.dismiss();
                setShowEmojiPicker(true);
                setShowAttachMenu(false);
              }}
            >
              <Ionicons name="happy-outline" size={22} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Send Button */}
          <TouchableOpacity
            onPress={handleSend}
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
              <Ionicons name="send" size={20} color="white" style={{ marginLeft: 2 }} />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Attachment Menu */}
        {showAttachMenu && (
          <Animated.View
            entering={FadeInRight.springify()}
            style={{
              flexDirection: "row",
              gap: 16,
              marginTop: 16,
              paddingTop: 16,
              borderTopWidth: 1,
              borderTopColor: theme.border,
            }}
          >
            <TouchableOpacity
              onPress={() => handlePickImage("camera")}
              style={{ alignItems: "center" }}
            >
              <View style={{
                width: 56, height: 56, borderRadius: 16,
                backgroundColor: `${Colors.primary}20`,
                alignItems: "center", justifyContent: "center", marginBottom: 8,
              }}>
                <Ionicons name="camera" size={28} color={theme.primary} />
              </View>
              <Text style={{ color: theme.textSecondary, fontSize: 12 }}>Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handlePickImage("gallery")}
              style={{ alignItems: "center" }}
            >
              <View style={{
                width: 56, height: 56, borderRadius: 16,
                backgroundColor: `${Colors.secondary}20`,
                alignItems: "center", justifyContent: "center", marginBottom: 8,
              }}>
                <Ionicons name="images" size={28} color={theme.secondary} />
              </View>
              <Text style={{ color: theme.textSecondary, fontSize: 12 }}>Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ alignItems: "center" }}>
              <View style={{
                width: 56, height: 56, borderRadius: 16,
                backgroundColor: `${Colors.accent}20`,
                alignItems: "center", justifyContent: "center", marginBottom: 8,
              }}>
                <Ionicons name="film" size={28} color={theme.accent} />
              </View>
              <Text style={{ color: theme.textSecondary, fontSize: 12 }}>Movie</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </Animated.View>

      {/* Image Preview Modal */}
      <ImagePreviewModal
        visible={showImagePreview}
        imageUri={previewImage}
        onClose={() => {
          setShowImagePreview(false);
          setPreviewImage(null);
        }}
        onSend={handleSendImage}
      />

      {/* Emoji Picker */}
      <EmojiPicker
        onEmojiSelected={handleEmojiSelected}
        open={showEmojiPicker}
        onClose={() => setShowEmojiPicker(false)}
        theme={{
          backdrop: isDark ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0.5)",
          knob: isDark ? "#475569" : "#cbd5e1",
          container: isDark ? "#1e293b" : "#ffffff",
          header: isDark ? "#f1f5f9" : "#1e293b",
          category: {
            icon: isDark ? "#94a3b8" : "#64748b",
            iconActive: theme.primary,
            container: isDark ? "#1e293b" : "#ffffff",
            containerActive: `${theme.primary}20`,
          },
          search: {
            text: isDark ? "#f1f5f9" : "#1e293b",
            placeholder: isDark ? "#64748b" : "#94a3b8",
            icon: isDark ? "#94a3b8" : "#64748b",
            background: isDark ? "#334155" : "#f1f5f9",
          },
        }}
      />
    </KeyboardAvoidingView>
  );
}
