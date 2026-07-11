import { DEFAULT_DESTINATION, DESTINATIONS, destinationByCode, type Destination } from '~~/config/destinations'

export type TravelClass = 'economy' | 'business' | 'first'

/** Segmented control labels -> class, and the budget each one presets. */
export const TRAVEL_CLASSES: { key: TravelClass, label: string, presetRm: number }[] = [
  { key: 'economy', label: 'Backpacker', presetRm: 3_000 },
  { key: 'business', label: 'Traveller', presetRm: 8_000 },
  { key: 'first', label: 'Luxury', presetRm: 20_000 },
]

/** UI state: destination, trip budget (integer sen) and traveller class. */
export function useTrip() {
  const selectedCode = useState<string>('tm:selected', () => DEFAULT_DESTINATION)
  const budgetSen = useState<number>('tm:budget-sen', () => 500_000) // RM 5,000.00
  const travelClass = useState<TravelClass>('tm:class', () => 'economy')

  const destination = computed<Destination>(
    () => destinationByCode(selectedCode.value) ?? DESTINATIONS[0]!,
  )

  const { stopTour } = useTour()

  /** User-initiated selection; also permanently stops the hero auto-tour. */
  function select(code: string): void {
    if (!destinationByCode(code)) return
    stopTour()
    selectedCode.value = code
  }

  /** Whole ringgit for the input field; sen stays the source of truth. */
  const budgetRm = computed(() => Math.floor(budgetSen.value / 100))

  function setBudgetRm(rm: number): void {
    const clamped = Math.max(0, Math.min(Math.trunc(rm), 99_999_999))
    budgetSen.value = clamped * 100
  }

  /**
   * Picking a class presets the budget, but later budget edits never reset
   * the class. Counts as interaction, so it also stops the hero tour.
   */
  function setTravelClass(next: TravelClass): void {
    const entry = TRAVEL_CLASSES.find(c => c.key === next)
    if (!entry) return
    stopTour()
    travelClass.value = next
    setBudgetRm(entry.presetRm)
  }

  return { selectedCode, destination, budgetSen, budgetRm, travelClass, select, setBudgetRm, setTravelClass }
}
