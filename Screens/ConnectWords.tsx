import { View, Text, StyleSheet, Dimensions } from 'react-native'
import React, { useState, useEffect, useCallback } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { MainAppStackParamList } from '../Types/navigation'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring
} from "react-native-reanimated";
import { GestureHandlerRootView, GestureDetector, Gesture } from "react-native-gesture-handler";
import { getRandomSwedishWord } from '../Services/sanastoService'
import type { Sanasto } from '../Types/sanasto'

import { scheduleOnRN } from "react-native-worklets";
import { Item, Layout, DragProps } from '../Types/connectwordtypes';
import { usePlayAudioDing } from '../Services/audioService';


type Props = NativeStackScreenProps<MainAppStackParamList, 'ConnectWords'>

const { width } = Dimensions.get("window");



export default function ConnectWords(_: Props) {
  const [entry1, setEntry1] = useState<Sanasto>(getRandomSwedishWord());
  const [entry2, setEntry2] = useState<Sanasto>(getRandomSwedishWord());
  const [entry3, setEntry3] = useState<Sanasto>(getRandomSwedishWord());
  const [targets, setTargets] = useState<Record<number, Layout>>({});
  const [matched, setMatched] = useState<number[]>([]);
  const playDing = usePlayAudioDing();
  

  const handleMatch = useCallback((id: number) => {
    setMatched((prev) => [...prev, id]);
  }, []);

  function uudetSanat() {
    setEntry1(getRandomSwedishWord());
    setEntry2(getRandomSwedishWord());
    setEntry3(getRandomSwedishWord());
  };

  useEffect(() => {
    if (matched.length === 3) {
      setMatched([]);
      uudetSanat();
    }})
  

  const ITEMS: Item[] = [
    { id: 1, SWE_word: entry1.swedish, FIN_word: entry1.translations},
    { id: 2, SWE_word: entry2.swedish, FIN_word: entry2.translations},
    { id: 3, SWE_word: entry3.swedish, FIN_word: entry3.translations},
  ];
  const shuffleArray = (array) => {
    const newArray = [...array];
  
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
  
    return newArray;
  };
  
  const shuffledITEMS = shuffleArray(ITEMS);


  return (
    <>
    <View style={styles.container}>
      
      {/* FINWORD TARGETS */}
      <View style={styles.targets}>
        {ITEMS.map((item) => (
          <View
            key={item.id}
            onLayout={(e) => {
              const layout = e.nativeEvent.layout;

              setTargets((prev) => ({
                ...prev,
                [item.id]: {
                  x: layout.x + 60, // center adjust
                  y: layout.y + 180, // oli y: layout.y + 50 ,tää varmaan sopii näin
                },
              }));
            }}
            style={styles.SWEWordBox}
          >
            <Text>{item.SWE_word}</Text>
          </View>
        ))}
      </View>
      

      {/* WORDS */}
      <View style={styles.FINWordBackground}>
        {shuffledITEMS.map((item) => {
          if (matched.includes(item.id)) {
            playDing();
            return null;
          }

          const target = targets[item.id];

          return (
            <DraggableWord
              key={item.id}
              item={item}
              target={target}
              onMatch={handleMatch}
            />
          );
        })}
      </View>
      
    </View>
    
    </>
  );
}




function DraggableWord({ item, target, onMatch }: DragProps) {
  console.log("Rendering DraggableWord for item:", item);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);

  const gesture = Gesture.Pan()
    .onStart(() => {
      startX.value = translateX.value;
      startY.value = translateY.value;
    })
    .onUpdate((e) => {
      translateX.value = startX.value + e.translationX;
      translateY.value = startY.value + e.translationY;
    })
    .onEnd((e) => {
      if (!target) {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        return;
      }

      // Distance check
      const dx = e.absoluteX - target.x;
      const dy = e.absoluteY - target.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      const SNAP_DISTANCE = 50;

      if (distance < SNAP_DISTANCE) {
        // snap animation
        translateX.value = withSpring(
          translateX.value + (target.x - e.absoluteX)
        );

        translateY.value = withSpring(
          translateY.value + (target.y - e.absoluteY)
        );

        scheduleOnRN(onMatch, item.id);
      } else {
        // return to origin
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    });

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));


  return (
    
    <GestureHandlerRootView>
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.FINWordBox, style]}>
        <Text style={styles.FINWordText}>{item.FIN_word}</Text>
      </Animated.View>
    </GestureDetector>
    </GestureHandlerRootView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 4,
    paddingTop: 80,
    backgroundColor: "green",
    alignItems: "center",
  },

  targets: {
    flexDirection: "row",
    justifyContent: "space-around",
    width,
    marginBottom: 100,
  },

  SWEWordBox: {
    width: 100,
    height: 100,
    borderRadius: 16,
    backgroundColor: "#9e0",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },
  FINWordBackground: {
    backgroundColor: "green",
    paddingVertical: 1,
    borderRadius: 1,
    width: "100%",
    height: "50%",
    justifyContent: "center",
    alignItems: "center",
  },

  FINWordBox: {
    flex: 0,
    maxHeight: "60%",

    backgroundColor: "#4CAF50",
    
    paddingVertical: 14,
    borderRadius: 14,
    elevation: 5,
    
    flexDirection: "column",
    flexWrap: "wrap",
    justifyContent: "center",
    alignContent: "stretch",


    paddingHorizontal: 12,
    gap: 16,
  },

  FINWordText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});