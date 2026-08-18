'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSettings } from '@/hooks/useSettings'

const getQuotes = (name: string) => [
  `"You got this, ${name}! One step at a time."`,
  `"Hey ${name}, great things never came from comfort zones."`,
  `"Keep pushing, ${name}. Your future self will thank you!"`,
  `"${name}, don't stop until you're proud."`,
  `"Dream big, work hard, stay focused, ${name}."`,
  `"Believe you can and you're halfway there, ${name}."`,
  `"Make today so awesome yesterday gets jealous, ${name}!"`,
  `"${name}, every master was once a beginner."`
]

export function MotivationalQuote({ userName }: { userName: string }) {
  const { appName, isLoaded } = useSettings()
  const [quoteIndex, setQuoteIndex] = useState(0)
  const [isClient, setIsClient] = useState(false)
  
  const displayName = (isLoaded && appName) ? appName : userName
  const quotes = getQuotes(displayName)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return
    const interval = setInterval(() => {
      setQuoteIndex(prev => (prev + 1) % quotes.length)
    }, 8000) // Change quote every 8 seconds

    return () => clearInterval(interval)
  }, [isClient, quotes.length])

  // Typewriter animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.3 }
    }
  }

  const charVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  }

  if (!isClient) return null

  const currentQuote = quotes[quoteIndex]

  return (
    <div className="text-black dark:text-white w-full font-black text-2xl md:text-3xl lg:text-4xl xl:text-6xl leading-tight uppercase flex items-center justify-end text-right [text-shadow:3px_3px_0_#fff] dark:[text-shadow:3px_3px_0_#000] px-4 md:px-6 lg:px-8 xl:px-20">
      <AnimatePresence mode="wait">
        <motion.div
          key={quoteIndex}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="max-w-2xl"
        >

          {currentQuote.split("\n").map((line, lineIndex) => (
            <div key={lineIndex} className="block mb-2">
              {line.split(" ").map((word, wordIndex) => (
                <span key={wordIndex} className="inline-block ml-[0.3em]">
                  {[...word].map((char, charIndex) => (
                    <motion.span
                      key={charIndex}
                      variants={charVariants}
                      className="inline-block"
                    >
                      {char}
                    </motion.span>
                  ))}
                </span>
              ))}
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
