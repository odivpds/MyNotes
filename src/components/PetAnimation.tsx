'use client'

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

const CAT_BASE = [
  "                                ",
  "          ##      ##            ",
  "         #..#    #..#           ",
  "        #....####....#          ",
  "       #..............#         ",
  "      #................#        ",
  "      #...WWWW..WWWW...#        ",
  "      #...WWWW..WWWW...#        ",
  "      #...WWWW..WWWW...#        ",
  "      #................#        ",
  "      #......P..P......#        ",
  "      #.......##.......#        ",
  "       #.....####.....#         ",
  "       #......S.......#         ",
  "       #.......S......#         ",
  "      #.......S........#        ",
  "     #......#CCC#.......#       ",
  "    #......#MMMMM#.......#   ## ",
  "    #.....W#MMMMM##W.....#  #WW#",
  "   #......W#MMMMM#.#W.....##WWW#",
  "   #.......#MMMM##W............#",
  "  #.........####...............#",
  "  #............................#",
  "   ############################ ",
  "                                "
]

const CAT_IDLE = [
  "                                ",
  "          ##      ##            ",
  "         #..#    #..#           ",
  "        #....####....#          ",
  "       #..............#         ",
  "      #................#        ",
  "      #...WWWW..WWWW...#        ",
  "      #...WWWW..WWWW...#        ",
  "      #...WWWW..WWWW...#        ",
  "      #................#        ",
  "      #......P..P......#        ",
  "      #.......##.......#        ",
  "       #.....####.....#         ",
  "       #.......S......#         ",
  "       #......S.......#         ",
  "      #........S.......#        ",
  "     #......#CCC#.......#       ",
  "    #......#MMMMM#.......#      ",
  "    #.....W#MMMMM##W.....#   ## ",
  "   #......W#MMMMM#.#W.....# #WW#",
  "   #.......#MMMM##W........#WWW#",
  "  #.........####...............#",
  "  #............................#",
  "   ############################ ",
  "                                "
]

const CAT_BLINK = [
  "                                ",
  "          ##      ##            ",
  "         #..#    #..#           ",
  "        #....####....#          ",
  "       #..............#         ",
  "      #................#        ",
  "      #................#        ",
  "      #...####..####...#        ",
  "      #................#        ",
  "      #................#        ",
  "      #......P..P......#        ",
  "      #.......##.......#        ",
  "       #.....####.....#         ",
  "       #......S.......#         ",
  "       #.......S......#         ",
  "      #.......S........#        ",
  "     #......#CCC#.......#       ",
  "    #......#MMMMM#.......#   ## ",
  "    #.....W#MMMMM##W.....#  #WW#",
  "   #......W#MMMMM#.#W.....##WWW#",
  "   #.......#MMMM##W............#",
  "  #.........####...............#",
  "  #............................#",
  "   ############################ ",
  "                                "
]

const CAT_WINK = [
  "                                ",
  "          ##      ##            ",
  "         #..#    #..#           ",
  "        #....####....#          ",
  "       #..............#         ",
  "      #................#        ",
  "      #...WWWW.........#        ",
  "      #...WWWW..####...#        ",
  "      #...WWWW.........#        ",
  "      #................#        ",
  "      #......P..P......#        ",
  "      #.......##.......#        ",
  "       #.....####.....#         ",
  "       #......S.......#         ",
  "       #.......S......#         ",
  "      #.......S........#        ",
  "     #......#CCC#.......#       ",
  "    #......#MMMMM#.......#   ## ",
  "    #.....W#MMMMM##W.....#  #WW#",
  "   #......W#MMMMM#.#W.....##WWW#",
  "   #.......#MMMM##W............#",
  "  #.........####...............#",
  "  #............................#",
  "   ############################ ",
  "                                "
]

const CAT_SLEEP_1 = [
  "                                ",
  "          ##      ##            ",
  "         #..#    #..#           ",
  "        #....####....#          ",
  "       #..............#         ",
  "      #................#        ",
  "      #................#        ",
  "      #...####..####...#        ",
  "      #................#        ",
  "      #................#        ",
  "      #.......##.......#        ",
  "       #.....####.....#         ",
  "       #......S.......#         ",
  "       #.......S......#         ",
  "      #.......S........#        ",
  "     #......#CCC#.......#       ",
  "    #......#MMMMM#.......#      ",
  "    #.....W#MMMMM##W.....####   ",
  "   #......W#MMMMM#.#W.....#WW#  ",
  "   #.......#MMMM##W........#WW# ",
  "  #.........####............#W# ",
  "  #..........................## ",
  "   ############################ ",
  "                                "
]

const CAT_SLEEP_2 = [
  "                                ",
  "          ##      ##            ",
  "         #..#    #..#           ",
  "        #....####....#          ",
  "       #..............#         ",
  "      #................#        ",
  "      #................#        ",
  "      #...####..####...#        ",
  "      #................#        ",
  "      #................#        ",
  "      #.......##.......#        ",
  "       #.....####.....#         ",
  "       #.......S......#         ",
  "       #......S.......#         ",
  "      #........S.......#        ",
  "     #......#CCC#.......#       ",
  "    #......#MMMMM#.......#      ",
  "    #.....W#MMMMM##W.....####   ",
  "   #......W#MMMMM#.#W.....#WW#  ",
  "   #.......#MMMM##W........#WW# ",
  "  #.........####............#W# ",
  "  #..........................## ",
  "   ############################ ",
  "                                "
]

const CAT_DRINK = [
  "                                ",
  "          ##      ##            ",
  "         #..#    #..#           ",
  "        #....####....#          ",
  "       #..............#         ",
  "      #................#        ",
  "      #...WWWW..WWWW...#        ",
  "      #...WWWW..WWWW...#        ",
  "      #...WWWW..WWWW...#        ",
  "      #......P##P......#        ",
  "      #.....#CCC#......#        ",
  "       #...W#MMMMM#W..#         ",
  "       #...W#MMMMM#W..#         ",
  "       #....#MMMM##...#         ",
  "       #.....####.....#         ",
  "      #................#        ",
  "     #..................#       ",
  "    #....................#   ## ",
  "    #....................#  #WW#",
  "   #......................##WWW#",
  "   #...........................#",
  "  #............................#",
  "  #............................#",
  "   ############################ ",
  "                                "
]

const CAT_HAPPY = [
  "                                ",
  "          ##      ##            ",
  "         #..#    #..#           ",
  "        #....####....#          ",
  "       #..............#         ",
  "      #................#        ",
  "      #...##......##...#        ",
  "      #..#..#....#..#..#        ",
  "      #................#        ",
  "      #................#        ",
  "      #......P..P......#        ",
  "      #.......##.......#        ",
  "       #.....####.....#         ",
  "       #......S.......#         ",
  "       #.......S......#         ",
  "      #.......S........#        ",
  "     #......#CCC#.......#       ",
  "    #......#MMMMM#.......#   ## ",
  "    #.....W#MMMMM##W.....#  #WW#",
  "   #......W#MMMMM#.#W.....##WWW#",
  "   #.......#MMMM##W............#",
  "  #.........####...............#",
  "  #............................#",
  "   ############################ ",
  "                                "
]


const colors: Record<string, string> = {
  " ": "transparent",
  "#": "#000000",
  ".": "#FF9F43",
  "W": "#FFFFFF",
  "P": "#FFB3C6",
  "M": "#60A5FA",
  "C": "#78350F",
  "S": "#D1D5DB"
}

const getMessages = (name: string) => [
  `Halo ${name}! Semangat hari ini! 🚀`,
  `Fokus ya ${name}! 🔥`,
  `Jangan lupa istirahat ${name}! ☕`,
  `Wah, catatan ${name} rapi banget! 😽`,
  `Aku selalu nemenin ${name} nulis~ 🐾`,
  `Ada ide bagus hari ini, ${name}? ✨`,
  `pspspsps... 🐱`
]

export function PetAnimation({ userName = 'User' }: { userName?: string }) {
  const [isHovered, setIsHovered] = useState(false)
  const [isBlinking, setIsBlinking] = useState(false)
  const [isWinking, setIsWinking] = useState(false)
  const [isSleeping, setIsSleeping] = useState(false)
  const [isDrinking, setIsDrinking] = useState(false)
  const [isHappy, setIsHappy] = useState(false)
  
  const [clickCount, setClickCount] = useState(0)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [messageIndex, setMessageIndex] = useState(0)
  
  const [frameIndex, setFrameIndex] = useState(0)

  const containerRef = useRef<HTMLDivElement>(null)

  /*
   * -----------------------------------------
   * FRAME ANIMATION TIMER
   * -----------------------------------------
   */
  useEffect(() => {
    const interval = setInterval(() => {
      setFrameIndex(prev => prev + 1)
    }, 700)
    return () => clearInterval(interval)
  }, [])


  /*
   * -----------------------------------------
   * AUTO TALKING
   * -----------------------------------------
   */

  useEffect(() => {
    const messages = getMessages(userName)
    const interval = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % messages.length)
    }, 6000)

    return () => clearInterval(interval)
  }, [userName])

  /*
   * -----------------------------------------
   * RANDOM BLINK
   * -----------------------------------------
   */

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>

    const blink = () => {
      const delay = 2500 + Math.random() * 4500

      timeout = setTimeout(() => {
        setIsBlinking(true)

        setTimeout(() => {
          setIsBlinking(false)
          blink()
        }, 140)
      }, delay)
    }

    blink()

    return () => clearTimeout(timeout)
  }, [])

  /*
   * -----------------------------------------
   * RANDOM WINK
   * -----------------------------------------
   */

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>

    const wink = () => {
      timeout = setTimeout(() => {
        if (!isBlinking) {
          setIsWinking(true)

          setTimeout(() => {
            setIsWinking(false)
            wink()
          }, 220)
        } else {
          wink()
        }
      }, 8000 + Math.random() * 10000)
    }

    wink()

    return () => clearTimeout(timeout)
  }, [isBlinking])

  /*
   * -----------------------------------------
   * OCCASIONAL SLEEP
   * -----------------------------------------
   */

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>

    const sleepCycle = () => {
      timeout = setTimeout(() => {
        setIsSleeping(true)

        setTimeout(() => {
          setIsSleeping(false)
          sleepCycle()
        }, 5500)
      }, 20000 + Math.random() * 15000)
    }

    sleepCycle()

    return () => clearTimeout(timeout)
  }, [])

  /*
   * -----------------------------------------
   * RANDOM DRINK
   * -----------------------------------------
   */

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>
    const drinkCycle = () => {
      timeout = setTimeout(() => {
        if (!isSleeping && !isHappy) {
          setIsDrinking(true)
          setTimeout(() => setIsDrinking(false), 2000)
        }
        drinkCycle()
      }, 15000 + Math.random() * 12000)
    }
    drinkCycle()
    return () => clearTimeout(timeout)
  }, [isSleeping, isHappy])


  /*
   * -----------------------------------------
   * MOUSE TRACKING
   * -----------------------------------------
   */

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()

      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const dx = e.clientX - centerX
      const dy = e.clientY - centerY

      const maxDistance = 500

      setMousePos({
        x: Math.max(-1, Math.min(1, dx / maxDistance)),
        y: Math.max(-1, Math.min(1, dy / maxDistance))
      })
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  const offsetX = Math.round(mousePos.x)
  const offsetY = mousePos.y > 0.2 ? 1 : 0

  let currentFrame = CAT_BASE

  if (isSleeping) {
    currentFrame = frameIndex % 2 === 0 ? CAT_SLEEP_1 : CAT_SLEEP_2
  } else if (isDrinking) {
    currentFrame = CAT_DRINK
  } else if (isHappy) {
    currentFrame = CAT_HAPPY
  } else if (isBlinking) {
    currentFrame = CAT_BLINK
  } else if (isWinking) {
    currentFrame = CAT_WINK
  } else {
    currentFrame = frameIndex % 2 === 0 ? CAT_BASE : CAT_IDLE
  }

  /*
   * -----------------------------------------
   * CLICK
   * -----------------------------------------
   */

  const handleClick = () => {
    const messages = getMessages(userName)
    setClickCount(prev => prev + 1)
    setMessageIndex(prev => (prev + 1) % messages.length)
    
    setIsHappy(true)
    setTimeout(() => setIsHappy(false), 1500)
  }

  return (
    <div
      ref={containerRef}
      className="
        hidden lg:flex
        flex-col
        items-center
        justify-center
        fixed
        top-1/2
        -translate-y-1/2
        right-1/4
        translate-x-1/2
        cursor-pointer
        z-20
      "
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >

      {/* =====================================
          FLOATING HEARTS
      ====================================== */}

      <AnimatePresence>
        {isHappy && (
          <>
            {[0, 1, 2].map(i => (
              <motion.div
                key={`heart-${i}-${clickCount}`}
                initial={{
                  opacity: 0,
                  y: 30,
                  x: (i - 1) * 35,
                  scale: 0.4
                }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  y: -120,
                  x: (i - 1) * 50
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.25,
                  ease: "easeOut"
                }}
                className="absolute text-2xl pointer-events-none"
              >
                {i === 1 ? "💖" : "💕"}
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>

      {/* =====================================
          SPARKLES
      ====================================== */}

      <AnimatePresence>
        {isHovered && (
          <>
            {[
              { x: -140, y: -100, delay: 0 },
              { x: 130, y: -80, delay: 0.4 },
              { x: -120, y: 50, delay: 0.8 },
              { x: 140, y: 70, delay: 1.1 }
            ].map((spark, i) => (
              <motion.div
                key={`spark-${i}`}
                initial={{
                  opacity: 0,
                  scale: 0,
                  x: spark.x,
                  y: spark.y
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1.3, 0],
                  rotate: [0, 90, 180]
                }}
                transition={{
                  duration: 1.6,
                  delay: spark.delay,
                  repeat: Infinity,
                  repeatDelay: 0.5
                }}
                className="absolute text-xl pointer-events-none"
              >
                ✦
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>

      {/* =====================================
          SPEECH BUBBLE
      ====================================== */}

      <AnimatePresence mode="wait">
        <motion.div
          key={messageIndex}
          initial={{
            opacity: 0,
            y: 15,
            scale: 0.75
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1
          }}
          exit={{
            opacity: 0,
            y: -15,
            scale: 0.75
          }}
          transition={{
            duration: 0.3,
            type: "spring",
            stiffness: 400,
            damping: 20
          }}
          className="
            absolute
            -top-20
            bg-white
            border-4
            border-black
            px-4
            py-2
            rounded-2xl
            shadow-[5px_5px_0_0_#000]
            text-sm
            font-bold
            whitespace-nowrap
            text-black
            z-30
          "
        >
          {isSleeping ? (
            "Zzz... 😴"
          ) : (
            <span className="inline-flex">
              {[...getMessages(userName)[messageIndex]].map((char, i) => (
                <motion.span
                  key={`${messageIndex}-${i}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: i * 0.05,
                    type: "spring",
                    stiffness: 300,
                    damping: 10,
                  }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              ))}
            </span>
          )}

          {/* Bubble pointer */}
          <div
            className="
              absolute
              -bottom-3
              left-1/2
              -translate-x-1/2
              w-0
              h-0
              border-l-[9px]
              border-l-transparent
              border-r-[9px]
              border-r-transparent
              border-t-[13px]
              border-t-black
            "
          />

          <div
            className="
              absolute
              -bottom-1.5
              left-1/2
              -translate-x-1/2
              w-0
              h-0
              border-l-[7px]
              border-l-transparent
              border-r-[7px]
              border-r-transparent
              border-t-[10px]
              border-t-white
            "
          />
        </motion.div>
      </AnimatePresence>

      {/* =====================================
          CAT
      ====================================== */}

      <motion.div
        animate={{
          y: isSleeping
            ? [0, 2, 0]
            : [0, -7, 0]
        }}
        transition={{
          duration: isSleeping ? 3 : 2.2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >

        <motion.div
          animate={{
            rotate: isHovered
              ? [-1.5, 1.5, -1.5]
              : [-0.8, 0.8, -0.8]
          }}
          transition={{
            duration: isHovered ? 0.8 : 2.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >

          <motion.div
            whileHover={{
              scale: 1.08
            }}
            whileTap={{
              scale: 0.9,
              y: -35,
              rotate: -3
            }}
            transition={{
              type: "spring",
              stiffness: 450,
              damping: 12
            }}
            className="
              relative
              w-72
              h-72
              xl:w-96
              xl:h-96
              2xl:w-[32rem]
              2xl:h-[32rem]
              drop-shadow-[8px_8px_0_rgba(0,0,0,1)]
              hover:drop-shadow-[12px_12px_0_rgba(0,0,0,1)]
            "
          >

            <svg
              viewBox="0 0 32 25"
              className="w-full h-full"
              style={{
                shapeRendering: "crispEdges"
              }}
            >

              {/* ===============================
                  CAT BODY
              ================================ */}

              {currentFrame.map((row, y) =>
                row.split("").map((char, x) => {
                  if (char === " ") return null

                  return (
                    <rect
                      key={`${x}-${y}`}
                      x={x}
                      y={y}
                      width={1.05}
                      height={1.05}
                      fill={colors[char]}
                    />
                  )
                })
              )}

              {/* ===============================
                  EARS
              ================================ */}

              <motion.g
                animate={{
                  rotate: isHovered && !isSleeping
                    ? [0, -4, 3, 0]
                    : 0
                }}
                transition={{
                  duration: 0.7
                }}
                style={{
                  transformOrigin: "11px 4px"
                }}
              >
                <rect
                  x="10"
                  y="2"
                  width="3"
                  height="1"
                  fill="#FF9F43"
                />
              </motion.g>

              <motion.g
                animate={{
                  rotate: isHovered && !isSleeping
                    ? [0, 4, -3, 0]
                    : 0
                }}
                transition={{
                  duration: 0.7
                }}
                style={{
                  transformOrigin: "19px 4px"
                }}
              >
                <rect
                  x="19"
                  y="2"
                  width="3"
                  height="1"
                  fill="#FF9F43"
                />
              </motion.g>

              {/* ===============================
                  PUPILS
              ================================ */}

              {/* Left pupil */}
              {!isBlinking && !isSleeping && !isHappy && (
                <motion.rect
                  animate={{
                    x: 11 + offsetX,
                    y: 7 + offsetY
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30
                  }}
                  width={2}
                  height={2}
                  fill="#000"
                />
              )}

              {/* Right pupil */}
              {!isBlinking && !isSleeping && !isHappy && !isWinking && (
                <motion.rect
                  animate={{
                    x: 17 + offsetX,
                    y: 7 + offsetY
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30
                  }}
                  width={2}
                  height={2}
                  fill="#000"
                />
              )}
            </svg>

            {/* ===============================
                COFFEE STEAM
            ================================ */}

            <AnimatePresence>
              {isHovered && !isSleeping && (
                <>
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 10
                    }}
                    animate={{
                      opacity: [0, 1, 0],
                      y: -35,
                      x: [0, 5, -4, 0]
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      delay: 0
                    }}
                    className="
                      absolute
                      left-[48%]
                      bottom-[28%]
                      text-lg
                      pointer-events-none
                    "
                  >
                    ☁️
                  </motion.div>

                  <motion.div
                    initial={{
                      opacity: 0
                    }}
                    animate={{
                      opacity: [0, 1, 0],
                      y: -30,
                      x: [0, -4, 5, 0]
                    }}
                    transition={{
                      duration: 2.2,
                      repeat: Infinity,
                      delay: 0.8
                    }}
                    className="
                      absolute
                      left-[54%]
                      bottom-[28%]
                      text-sm
                      pointer-events-none
                    "
                  >
                    ☁️
                  </motion.div>
                </>
              )}
            </AnimatePresence>

          </motion.div>
        </motion.div>
      </motion.div>

      {/* =====================================
          PURR EFFECT
      ====================================== */}

      <AnimatePresence>
        {isHovered && !isSleeping && (
          <motion.div
            initial={{
              opacity: 0,
              scaleX: 0
            }}
            animate={{
              opacity: [0, 0.5, 0],
              scaleX: [0.6, 1.2, 0.6]
            }}
            exit={{
              opacity: 0
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity
            }}
            className="
              absolute
              bottom-[-15px]
              w-48
              h-3
              border-b-4
              border-black
              rounded-full
              pointer-events-none
            "
          />
        )}
      </AnimatePresence>

      {/* =====================================
          CLICK COUNTER
      ====================================== */}

      {clickCount > 2 && (
        <motion.div
          initial={{
            opacity: 0,
            y: 10,
            scale: 0.5
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1
          }}
          className="
            absolute
            -bottom-10
            text-xs
            font-bold
            bg-black
            text-white
            px-3
            py-1
            rounded-full
          "
        >
          {clickCount} pats 🐾
        </motion.div>
      )}

    </div>
  )
}