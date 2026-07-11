/**
 * The hero auto-tour: cycles the selected destination until the user does
 * anything at all. Stopping is permanent for the session; nothing restarts it.
 */
export const TOUR_ORDER = ['jpy', 'krw', 'thb', 'idr', 'sgd', 'gbp'] as const

export function useTour() {
  const stopped = useState('tm:tour-stopped', () => false)

  function stopTour(): void {
    stopped.value = true
  }

  return { stopped, stopTour }
}
