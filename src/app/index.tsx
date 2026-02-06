import { useState, useCallback } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import { useRouter } from "expo-router";
import CameraViewfinder from "@/components/camera-viewfinder";
import { identifyDrink, findNearbyPlaces, getCurrentLocation } from "@/lib/drink-finder";
import * as AC from "@bacons/apple-colors";

export default function IndexRoute() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCapture = useCallback(
    async (photoUri: string) => {
      setIsProcessing(true);

      try {
        // Step 1: Identify the drink
        const drink = identifyDrink(photoUri);

        // Step 2: Get user location
        const location = await getCurrentLocation();
        const lat = location?.latitude ?? 37.7749;
        const lon = location?.longitude ?? -122.4194;

        // Step 3: Find nearby places
        const places = findNearbyPlaces(drink.name, lat, lon);

        // Navigate to results
        router.push({
          pathname: "/result",
          params: {
            drinkName: drink.name,
            drinkCategory: drink.category,
            confidence: String(Math.round(drink.confidence * 100)),
            places: JSON.stringify(places),
            photoUri,
            userLat: String(lat),
            userLon: String(lon),
          },
        });
      } catch (error) {
        console.error("Error processing drink:", error);
      } finally {
        setIsProcessing(false);
      }
    },
    [router]
  );

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <CameraViewfinder onCapture={handleCapture} isProcessing={isProcessing} />

      {/* Processing overlay */}
      {isProcessing && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            justifyContent: "center",
            alignItems: "center",
            gap: 16,
          }}
        >
          <ActivityIndicator size="large" color="white" />
          <Text
            style={{
              color: "white",
              fontSize: 18,
              fontWeight: "600",
            }}
          >
            Identifying drink...
          </Text>
          <Text
            style={{
              color: "rgba(255,255,255,0.6)",
              fontSize: 14,
            }}
          >
            Finding nearby places
          </Text>
        </View>
      )}
    </View>
  );
}
