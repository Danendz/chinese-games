import { ref, watch } from 'vue'

/**
 * Composable for infinite mode pool cycling.
 * Tracks used items, draws fresh batches without repeats,
 * and resets when pool is exhausted.
 *
 * @param {Ref<Array>} fullPool - All available items (each must have .id)
 * @param {number} batchSize - Items per round
 * @param {Ref<boolean>} isInfinite - Whether infinite mode is active
 */
export function useInfinitePool(fullPool, batchSize, isInfinite) {
  const usedIds = ref(new Set())
  const round = ref(0)
  const poolExhausted = ref(false)

  function shuffleArray(arr) {
    const a = [...arr]
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[a[i], a[j]] = [a[j], a[i]]
    }
    return a
  }

  function nextBatch() {
    const pool = fullPool.value || []
    if (pool.length === 0) return []

    // Filter to unused items
    let remaining = pool.filter(item => !usedIds.value.has(item.id))

    // If no remaining items, reset the pool
    if (remaining.length === 0) {
      poolExhausted.value = true
      usedIds.value = new Set()
      remaining = [...pool]
      setTimeout(() => { poolExhausted.value = false }, 2500)
    }

    // Take a batch
    const shuffled = shuffleArray(remaining)
    const batch = shuffled.slice(0, Math.min(batchSize, shuffled.length))

    // Mark as used
    const newUsed = new Set(usedIds.value)
    batch.forEach(item => newUsed.add(item.id))
    usedIds.value = newUsed

    round.value++
    return batch
  }

  function resetPool() {
    usedIds.value = new Set()
    round.value = 0
    poolExhausted.value = false
  }

  // Auto-reset when infinite mode is turned off
  watch(isInfinite, (val) => {
    if (!val) resetPool()
  })

  return { round, usedIds, poolExhausted, nextBatch, resetPool }
}
