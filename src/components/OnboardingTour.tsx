'use client'

import { useEffect, useState } from 'react'
import { Joyride, EventData, STATUS, Step, TooltipRenderProps } from 'react-joyride'
import { useSettings } from '@/hooks/useSettings'
import { useTheme } from 'next-themes'
import { X } from 'lucide-react'

const CustomTooltip = ({
  index,
  step,
  backProps,
  closeProps,
  primaryProps,
  skipProps,
  tooltipProps,
  isLastStep,
}: TooltipRenderProps) => {
  return (
    <div
      {...tooltipProps}
      className="bg-white dark:bg-zinc-800 border-4 border-black rounded-xl p-6 shadow-[8px_8px_0_0_#000] w-[320px] sm:w-[350px] font-sans text-black dark:text-white"
    >
      <div className="flex justify-between items-start mb-4 border-b-2 border-black/10 pb-2">
        <h3 className="font-bold text-lg uppercase tracking-wider text-note-yellow [text-shadow:1px_1px_0_#000]">
          Step {index + 1}
        </h3>
        <button
          {...closeProps}
          className="text-gray-500 hover:text-black dark:hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="mb-6 text-base font-medium leading-relaxed">{step.content}</div>

      <div className="flex justify-between items-center mt-4">
        <button
          {...skipProps}
          className="font-bold opacity-50 hover:opacity-100 transition-opacity uppercase text-sm"
        >
          Skip
        </button>

        <div className="flex gap-2">
          {index > 0 && (
            <button
              {...backProps}
              className="border-2 border-black bg-gray-200 dark:bg-zinc-700 text-black dark:text-white font-bold py-1.5 px-4 shadow-[2px_2px_0_0_#000] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-none transition-all uppercase text-sm"
            >
              Back
            </button>
          )}
          <button
            {...primaryProps}
            className="border-2 border-black bg-note-yellow text-black font-bold py-1.5 px-4 shadow-[2px_2px_0_0_#000] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-none transition-all uppercase text-sm"
          >
            {isLastStep ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  )
}

export interface OnboardingTourProps {
  userName?: string
  isReturningUser?: boolean
}

export function OnboardingTour({ userName = 'User', isReturningUser = false }: OnboardingTourProps) {
  const { tourStatus, startTour, completeTour, isLoaded } = useSettings()
  const [run, setRun] = useState(false)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    const handleStartTour = () => {
      // Small delay to ensure the DOM is ready (like settings dialog closing or welcome dialog unmounting)
      setTimeout(() => {
        setRun(true)
      }, 500)
    }

    window.addEventListener('start-tour', handleStartTour)
    return () => window.removeEventListener('start-tour', handleStartTour)
  }, [])

  const steps: Step[] = [
    {
      target: 'body',
      content: 'Welcome to NOPEPADS! Let\'s take a quick tour of your new Neobrutalist notebook.',
      placement: 'center',
      skipBeacon: true,
    },
    {
      target: '.tour-title',
      content: 'This is your app title. You can customize this name in the settings!',
      placement: 'bottom',
    },
    {
      target: '.tour-new-note',
      content: 'Click here to create a new note and start writing.',
      placement: 'left',
    },
    {
      target: '.tour-theme',
      content: 'Switch between Light and Dark mode. Both look brutally awesome!',
      placement: 'left',
    },
    {
      target: '.tour-settings',
      content: 'Customize your app name and other preferences here.',
      placement: 'left',
    },
    {
      target: '.tour-grid',
      content: 'Your notes will appear here. Enjoy your customized, markdown-powered NOPEPADS!',
      placement: 'center',
    }
  ]

  const handleJoyrideCallback = (data: EventData) => {
    const { status } = data
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED]

    if (finishedStatuses.includes(status)) {
      setRun(false)
      completeTour()
    }
  }

  const isDark = resolvedTheme === 'dark'

  return (
    <>
      {tourStatus === 'UNSET' && isLoaded && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          style={{ zIndex: 9999 }}
        >
          <div className="bg-white dark:bg-zinc-800 border-4 border-black rounded-xl p-6 sm:p-8 shadow-[12px_12px_0_0_#000] w-full max-w-md font-sans text-black dark:text-white animate-in zoom-in-95 duration-200">
            <h2 className="font-black text-3xl uppercase tracking-widest text-note-yellow [text-shadow:2px_2px_0_#000] mb-4">
              {isReturningUser ? 'WELCOME BACK!' : 'WELCOME!'}
            </h2>
            <p className="text-lg font-medium mb-8">
              {isReturningUser
                ? `Welcome back to NOPEPADS, ${userName.toUpperCase()}! Do you still remember how to use the features here?`
                : 'Are you new to NOPEPADS? Would you like a quick tour to see how things work?'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => completeTour()}
                className="flex-1 font-bold opacity-70 hover:opacity-100 transition-opacity uppercase"
              >
                {isReturningUser ? "Yep, I got this!" : "No, I'm a pro"}
              </button>
              <button
                onClick={() => startTour()}
                className="flex-1 border-4 border-black bg-note-yellow text-black font-black text-lg py-3 px-6 shadow-[4px_4px_0_0_#000] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all uppercase"
              >
                {isReturningUser ? "Remind me!" : "Yes, show me!"}
              </button>
            </div>
          </div>
        </div>
      )}
      <Joyride
        steps={steps}
        run={run}
        continuous={true}
        scrollToFirstStep={true}
        callback={handleJoyrideCallback}
        tooltipComponent={CustomTooltip}
        options={{
          arrowColor: isDark ? '#27272a' : '#fff',
          overlayColor: 'rgba(0, 0, 0, 0.7)',
          zIndex: 1000,
        }}
      />
    </>
  )
}
