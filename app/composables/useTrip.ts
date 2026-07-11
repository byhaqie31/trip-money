import { DEFAULT_DESTINATION, DESTINATIONS, destinationByCode, type Destination } from '~~/config/destinations'

/** UI state: which destination is selected and the trip budget (integer sen). */
export function useTrip() {
  const selectedCode = useState<string>('tm:selected', () => DEFAULT_DESTINATION)
  const budgetSen = useState<number>('tm:budget-sen', () => 500_000) // RM 5,000.00

  const destination = computed<Destination>(
    () => destinationByCode(selectedCode.value) ?? DESTINATIONS[0]!,
  )

  function select(code: string): void {
    if (destinationByCode(code)) selectedCode.value = code
  }

  /** Whole ringgit for the input field; sen stays the source of truth. */
  const budgetRm = computed(() => Math.floor(budgetSen.value / 100))

  function setBudgetRm(rm: number): void {
    const clamped = Math.max(0, Math.min(Math.trunc(rm), 99_999_999))
    budgetSen.value = clamped * 100
  }

  return { selectedCode, destination, budgetSen, budgetRm, select, setBudgetRm }
}
