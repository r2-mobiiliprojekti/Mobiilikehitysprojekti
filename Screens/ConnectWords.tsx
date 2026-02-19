import { View, Text, StyleSheet, Dimensions } from 'react-native'
import React, { useState, useEffect, useCallback } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { MainAppStackParamList } from '../Types/navigation'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring
} from "react-native-reanimated"
import { GestureHandlerRootView, GestureDetector, Gesture } from "react-native-gesture-handler"
import { getRandomSwedishWord } from '../Services/sanastoService'
import type { Sanasto } from '../Types/sanasto'
import { scheduleOnRN } from "react-native-worklets"
import { Item, Layout, DragProps } from '../Types/connectwordtypes'
import { usePlayAudioDing, usePlayAudioWrongBeep } from '../Services/audioService'
import { useTheme } from '../Contexts/ThemeContext'

type Props = NativeStackScreenProps<MainAppStackParamList, 'ConnectWords'>
const { width } = Dimensions.get("window")

export default function ConnectWords(_: Props) {
  const { isDark } = useTheme()
  const [entry1, setEntry1] = useState<Sanasto>(getRandomSwedishWord())
  const [entry2, setEntry2] = useState<Sanasto>(getRandomSwedishWord())
  const [entry3, setEntry3] = useState<Sanasto>(getRandomSwedishWord())
  const [targets, setTargets] = useState<Record<number, Layout>>({})
  const [matched, setMatched] = useState<number[]>([])
  const playDing = usePlayAudioDing()
  
  const styles = createStyles(isDark)

  const handleMatch = useCallback((id: number) => {
    setMatched((prev) => [...prev, id])
  }, [])

  function uudetSanat() {
    setEntry1(getRandomSwedishWord())
    setEntry2(getRandomSwedishWord())
    setEntry3(getRandomSwedishWord())
  }

  useEffect(() => {
    if (matched.length === 3) {
      setMatched([])
      uudetSanat()
    }})
  
  const ITEMS: Item[] = [
    { id: 1, SWE_word: entry1.swedish, FIN_word: entry1.translations},
    { id: 2, SWE_word: entry2.swedish, FIN_word: entry2.translations},
    { id: 3, SWE_word: entry3.swedish, FIN_word: entry3.translations},
  ]
  
  const shuffleArray = (array: Item[]): Item[] => {
    const newArray = [...array]
  
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      const temp = newArray[i]
      newArray[i] = newArray[j]
      newArray[j] = temp
    }
  
    return newArray
  }
  
  const shuffledITEMS = shuffleArray(ITEMS)

  return (
    <>
    <View style={styles.container}>
      
      {/* FINWORD TARGETS */}
      <View style={styles.targets}>
        {ITEMS.map((item) => (
          <View
            key={item.id}
            onLayout={(e) => {
              const layout = e.nativeEvent.layout
              setTargets((prev) => ({
                ...prev,
                [item.id]: {
                  x: layout.x + 60,
                  y: layout.y + 180,
                },
              }))
            }}
            style={styles.SWEWordBox}
          >
            <Text style={styles.SWEWordText}>{item.SWE_word}</Text>
          </View>
        ))}
      </View>
      
      {/* WORDS */}
      <View style={styles.FINWordBackground}>
        {shuffledITEMS.map((item) => {
          if (matched.includes(item.id)) {
            playDing()
            return null
          }
          
          const target = targets[item.id]

          return (
            <DraggableWord
              key={item.id}
              item={item}
              target={target}
              onMatch={handleMatch}
              isDark={isDark}
            />
          )
        })}
      </View>
    </View>
    </>
  )
}

function DraggableWord({ item, target, onMatch, isDark }: DragProps & { isDark: boolean }) {
  console.log("Rendering DraggableWord for item:", item)
  const translateX = useSharedValue(0)
  const translateY = useSharedValue(0)
  const startX = useSharedValue(0)
  const startY = useSharedValue(0)
  const playWrongBeep = usePlayAudioWrongBeep()
  
  const styles = createStyles(isDark)

  const gesture = Gesture.Pan()
    .onStart(() => {
      startX.value = translateX.value
      startY.value = translateY.value
    })
    .onUpdate((e) => {
      translateX.value = startX.value + e.translationX
      translateY.value = startY.value + e.translationY
      
    })
    .onEnd((e) => {
      if (!target) {
        translateX.value = withSpring(0)
        translateY.value = withSpring(0)
        
        return
      }

      // Distance check
      const dx = e.absoluteX - target.x
      const dy = e.absoluteY - target.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      const SNAP_DISTANCE = 55
      
      // measure distance and play wrong beep if close but wrong
      if (distance > SNAP_DISTANCE && e.absoluteY < 300) {
        try {
          if (playWrongBeep) {
            scheduleOnRN(playWrongBeep);
          } else {
            console.error('playWrongBeep is not ready');
          }
        } catch (error) {
          console.error('Error playing wrong beep:', error);
        }
      
      }

      if (distance < SNAP_DISTANCE) {
        // snap animation
        translateX.value = withSpring(
          translateX.value + (target.x - e.absoluteX)
        )
        translateY.value = withSpring(
          translateY.value + (target.y - e.absoluteY)
        )
        console.log("y and x position on success:", target.y, target.x)
        
        scheduleOnRN(onMatch, item.id)
      } else {
        // return to origin
        translateX.value = withSpring(0)
        translateY.value = withSpring(0)
      }
    })

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }))

  return (
    <GestureHandlerRootView>
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.FINWordBox, style]}>
        <Text style={styles.FINWordText}>{item.FIN_word}</Text>
      </Animated.View>
    </GestureDetector>
    </GestureHandlerRootView>
  )
}

const createStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flex: 4,
    paddingTop: 80,
    backgroundColor: isDark ? '#1a2a1a' : "green",
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
    borderRadius: 6,
    backgroundColor: isDark ? '#4a6a2a' : "#9e0",
    justifyContent: "center",
    alignItems: "center",
    elevation: 1,
  },
  SWEWordText: {
    color: isDark ? '#FFFFFF' : '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
  FINWordBackground: {
    backgroundColor: isDark ? '#1a2a1a' : "green",
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
    backgroundColor: isDark ? '#2a6a2a' : "#4CAF50",
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
})