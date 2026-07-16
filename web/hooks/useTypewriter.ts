'use client'

import { useEffect, useState } from 'react'

interface TypewriterResult {
  displayed: string
  done: boolean
}

/**
 * Reveals `text` one character at a time after `startDelay`, at `speed` ms/char.
 * Returns the currently displayed substring and whether typing has finished.
 */
export function useTypewriter(
  text: string,
  speed = 38,
  startDelay = 600
): TypewriterResult {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    let index = 0
    let interval: ReturnType<typeof setInterval> | undefined

    const startTimer = setTimeout(() => {
      interval = setInterval(() => {
        index += 1
        setDisplayed(text.slice(0, index))
        if (index >= text.length) {
          if (interval) clearInterval(interval)
          setDone(true)
        }
      }, speed)
    }, startDelay)

    return () => {
      clearTimeout(startTimer)
      if (interval) clearInterval(interval)
    }
  }, [text, speed, startDelay])

  return { displayed, done }
}
