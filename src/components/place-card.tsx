import * as AC from "@bacons/apple-colors";
import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";
import { NearbyPlace } from "@/lib/drink-finder";

type Props = {
  place: NearbyPlace;
  index: number;
  onPress: () => void;
};

export default function PlaceCard({ place, index, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        backgroundColor: AC.secondarySystemGroupedBackground as any,
        borderRadius: 16,
        borderCurve: "continuous",
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        opacity: pressed ? 0.7 : 1,
        transform: [{ scale: pressed ? 0.98 : 1 }],
      })}
    >
      {/* Rank badge */}
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          borderCurve: "continuous",
          backgroundColor:
            index === 0 ? (AC.systemBlue as any) : (AC.tertiarySystemFill as any),
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: index === 0 ? "white" : (AC.label as any),
            fontSize: 16,
            fontWeight: "700",
          }}
        >
          {index + 1}
        </Text>
      </View>

      {/* Info */}
      <View style={{ flex: 1, gap: 2 }}>
        <Text
          selectable
          style={{
            color: AC.label as any,
            fontSize: 17,
            fontWeight: "600",
          }}
          numberOfLines={1}
        >
          {place.name}
        </Text>
        <Text
          selectable
          style={{
            color: AC.secondaryLabel as any,
            fontSize: 14,
          }}
          numberOfLines={1}
        >
          {place.address}
        </Text>
        {place.rating && (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 }}>
            <Image
              source="sf:star.fill"
              style={{ fontSize: 12, color: AC.systemYellow as any }}
            />
            <Text
              style={{
                color: AC.secondaryLabel as any,
                fontSize: 13,
                fontVariant: ["tabular-nums"],
              }}
            >
              {place.rating.toFixed(1)}
            </Text>
          </View>
        )}
      </View>

      {/* Distance + chevron */}
      <View style={{ alignItems: "flex-end", gap: 4 }}>
        <Text
          style={{
            color: AC.systemBlue as any,
            fontSize: 15,
            fontWeight: "600",
            fontVariant: ["tabular-nums"],
          }}
        >
          {place.distance}
        </Text>
        <Image
          source="sf:chevron.right"
          style={{ fontSize: 14, color: AC.tertiaryLabel as any }}
        />
      </View>
    </Pressable>
  );
}
