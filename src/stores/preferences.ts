import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'

export type ReviewOrder = 'random' | 'chronological' | 'chronological-desc'
export type AlbumFilter = 'all' | 'in-albums' | 'not-in-albums' | 'specific-album'

interface StoredPreferences {
  reviewOrder: ReviewOrder
  albumHotkeys: Record<string, string>
  lastUsedAlbumId: string | null
  albumFilter: AlbumFilter
  specificAlbumId: string | null
}

const STORAGE_PREFIX = 'immich-swipe-preferences'

export const usePreferencesStore = defineStore('preferences', () => {
  const authStore = useAuthStore()

  const reviewOrder = ref<ReviewOrder>('random')
  const albumHotkeys = ref<Record<string, string>>({})
  const lastUsedAlbumId = ref<string | null>(null)
  const albumFilter = ref<AlbumFilter>('all')
  const specificAlbumId = ref<string | null>(null)

  const initialized = ref(false)

  const storageKey = computed(() => {
    const server = authStore.serverUrl || 'unknown-server'
    const user = authStore.currentUserName || 'default-user'
    return `${STORAGE_PREFIX}:${server}:${user}`
  })

  function loadFromStorage() {
    initialized.value = false
    const raw = localStorage.getItem(storageKey.value)
    if (!raw) {
      reviewOrder.value = 'random'
      albumHotkeys.value = {}
      lastUsedAlbumId.value = null
      albumFilter.value = 'all'
      specificAlbumId.value = null
      initialized.value = true
      return
    }

    try {
      const parsed = JSON.parse(raw) as Partial<StoredPreferences>
      reviewOrder.value = parsed.reviewOrder ?? 'random'
      albumHotkeys.value = parsed.albumHotkeys ?? {}
      lastUsedAlbumId.value = parsed.lastUsedAlbumId ?? null
      albumFilter.value = parsed.albumFilter ?? 'all'
      specificAlbumId.value = parsed.specificAlbumId ?? null
    } catch (e) {
      console.error('Failed to parse preferences from localStorage', e)
    } finally {
      initialized.value = true
    }
  }

  function persist() {
    if (!initialized.value) return
    const payload: StoredPreferences = {
      reviewOrder: reviewOrder.value,
      albumHotkeys: albumHotkeys.value,
      lastUsedAlbumId: lastUsedAlbumId.value,
      albumFilter: albumFilter.value,
      specificAlbumId: specificAlbumId.value,
    }
    localStorage.setItem(storageKey.value, JSON.stringify(payload))
  }

  function setReviewOrder(order: ReviewOrder) {
    reviewOrder.value = order
  }

  function setHotkey(key: string, albumId: string) {
    albumHotkeys.value = {
      ...albumHotkeys.value,
      [key]: albumId,
    }
  }

  function clearHotkey(key: string) {
    const { [key]: _, ...rest } = albumHotkeys.value
    albumHotkeys.value = rest
  }

  function setLastUsedAlbumId(albumId: string | null) {
    lastUsedAlbumId.value = albumId
  }

  function setAlbumFilter(filter: AlbumFilter) {
    albumFilter.value = filter
  }

  function setSpecificAlbumId(albumId: string | null) {
    specificAlbumId.value = albumId
  }

  // Load on init and whenever user/server changes
  watch(storageKey, () => loadFromStorage(), { immediate: true })

  // Persist on changes
  watch(
    [reviewOrder, albumHotkeys, lastUsedAlbumId, albumFilter, specificAlbumId, storageKey],
    () => persist(),
    { deep: true }
  )

  return {
    reviewOrder,
    albumHotkeys,
    lastUsedAlbumId,
    albumFilter,
    specificAlbumId,
    setReviewOrder,
    setHotkey,
    clearHotkey,
    setLastUsedAlbumId,
    setAlbumFilter,
    setSpecificAlbumId,
  }
})
