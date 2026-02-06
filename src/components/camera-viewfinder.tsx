import * as AC from "@bacons/apple-colors";
import { Image } from "expo-image";
import { useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Haptics from "expo-haptics";

type Props = {
  onCapture: (uri: string) => void;
  isProcessing: boolean;
};

export default function CameraViewfinder({ onCapture, isProcessing }: Props) {
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<"front" | "back">("back");

  if (!permission) {
    return (
      <View style={{ flex: 1, backgroundColor: "black" }} />
    );
  }

  if (!permission.granted) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "black",
          justifyContent: "center",
          alignItems: "center",
          gap: 20,
          padding: 32,
        }}
      >
        <Image
          source="sf:camera.fill"
          style={{ fontSize: 48, color: AC.secondaryLabel as any }}
        />
        <Text
          style={{
            color: "white",
            fontSize: 22,
            fontWeight: "700",
            textAlign: "center",
          }}
        >
          Camera Access Needed
        </Text>
        <Text
          style={{
            color: AC.secondaryLabel as any,
            fontSize: 16,
            textAlign: "center",
            lineHeight: 22,
          }}
        >
          Point your camera at any drink and we'll find the nearest place to get
          it.
        </Text>
        <Pressable
          onPress={requestPermission}
          style={{
            backgroundColor: AC.systemBlue as any,
            paddingHorizontal: 32,
            paddingVertical: 14,
            borderRadius: 14,
            borderCurve: "continuous",
          }}
        >
          <Text style={{ color: "white", fontSize: 17, fontWeight: "600" }}>
            Enable Camera
          </Text>
        </Pressable>
      </View>
    );
  }

  const handleCapture = async () => {
    if (!cameraRef.current || isProcessing) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.7,
        skipProcessing: true,
      });
      if (photo?.uri) {
        onCapture(photo.uri);
      }
    } catch {
      // Fallback: use a placeholder if camera capture fails
      onCapture("placeholder");
    }
  };

  const toggleFacing = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFacing((prev) => (prev === "back" ? "front" : "back"));
  };

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <CameraView
        ref={cameraRef}
        style={{ flex: 1 }}
        facing={facing}
      >
        {/* Top bar */}
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            paddingTop: 60,
            paddingHorizontal: 20,
            paddingBottom: 16,
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 20,
              fontWeight: "700",
              textAlign: "center",
              textShadowColor: "rgba(0,0,0,0.5)",
              textShadowOffset: { width: 0, height: 1 },
              textShadowRadius: 4,
            }}
          >
            Snap a Drink
          </Text>
          <Text
            style={{
              color: "rgba(255,255,255,0.7)",
              fontSize: 14,
              textAlign: "center",
              marginTop: 4,
              textShadowColor: "rgba(0,0,0,0.5)",
              textShadowOffset: { width: 0, height: 1 },
              textShadowRadius: 4,
            }}
          >
            Point at any beverage to find it nearby
          </Text>
        </View>

        {/* Viewfinder frame */}
        <View
          style={{
            position: "absolute",
            top: "30%",
            left: "15%",
            right: "15%",
            aspectRatio: 1,
            borderRadius: 24,
            borderCurve: "continuous",
            borderWidth: 2,
            borderColor: "rgba(255,255,255,0.3)",
          }}
        >
          {/* Corner accents */}
          {[
            { top: -2, left: -2 },
            { top: -2, right: -2 },
            { bottom: -2, left: -2 },
            { bottom: -2, right: -2 },
          ].map((pos, i) => (
            <View
              key={i}
              style={{
                position: "absolute",
                width: 24,
                height: 24,
                ...pos,
                borderColor: "white",
                borderTopWidth: pos.top !== undefined ? 3 : 0,
                borderBottomWidth: pos.bottom !== undefined ? 3 : 0,
                borderLeftWidth: pos.left !== undefined ? 3 : 0,
                borderRightWidth: pos.right !== undefined ? 3 : 0,
                borderTopLeftRadius: pos.top !== undefined && pos.left !== undefined ? 12 : 0,
                borderTopRightRadius: pos.top !== undefined && pos.right !== undefined ? 12 : 0,
                borderBottomLeftRadius: pos.bottom !== undefined && pos.left !== undefined ? 12 : 0,
                borderBottomRightRadius: pos.bottom !== undefined && pos.right !== undefined ? 12 : 0,
              }}
            />
          ))}
        </View>

        {/* Bottom controls */}
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            paddingBottom: 50,
            paddingTop: 24,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 40,
          }}
        >
          {/* Flip button */}
          <Pressable
            onPress={toggleFacing}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: "rgba(255,255,255,0.2)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              source="sf:arrow.triangle.2.circlepath.camera"
              style={{ fontSize: 20, color: "white" }}
            />
          </Pressable>

          {/* Capture button */}
          <Pressable
            onPress={handleCapture}
            disabled={isProcessing}
            style={({ pressed }) => ({
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: pressed ? "rgba(255,255,255,0.8)" : "white",
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 4,
              borderColor: "rgba(255,255,255,0.4)",
              opacity: isProcessing ? 0.5 : 1,
              transform: [{ scale: pressed ? 0.92 : 1 }],
            })}
          >
            <Image
              source="sf:cup.and.saucer.fill"
              style={{
                fontSize: 28,
                color: AC.systemBlue as any,
              }}
            />
          </Pressable>

          {/* Spacer to balance layout */}
          <View style={{ width: 44, height: 44 }} />
        </View>
      </CameraView>
    </View>
  );
}
