<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useUiStore } from '@/stores/ui'
import { usePreferencesStore } from '@/stores/preferences'
import type { ImmichAlbum } from '@/types/immich'

const props = defineProps<{
  open: boolean
  albums: ImmichAlbum[]
}>()

const emit = defineEmits<{
  close: []
  applySettings: []
}>()

const uiStore = useUiStore()
const preferencesStore = usePreferencesStore()

// Local state for settings
const skipVideos = ref(uiStore.skipVideos)
const albumFilter = ref(preferencesStore.albumFilter)
const specificAlbumId = ref(preferencesStore.specificAlbumId)

// Watch for changes from props/store
watch(() => props.open, (isOpen) => {
  if (isOpen) {
    skipVideos.value = uiStore.skipVideos
    albumFilter.value = preferencesStore.albumFilter
    specificAlbumId.value = preferencesStore.specificAlbumId
  }
})

const selectedAlbum = computed(() => {
  if (!specificAlbumId.value) return null
  return props.albums.find(a => a.id === specificAlbumId.value) || null
})

function handleClose() {
  emit('close')
}

function handleApply() {
  // Apply settings
  if (skipVideos.value !== uiStore.skipVideos) {
    uiStore.toggleSkipVideos()
  }

  if (albumFilter.value !== preferencesStore.albumFilter) {
    preferencesStore.setAlbumFilter(albumFilter.value)
  }

  if (specificAlbumId.value !== preferencesStore.specificAlbumId) {
    preferencesStore.setSpecificAlbumId(specificAlbumId.value)
  }

  emit('applySettings')
  emit('close')
}

function handleFilterChange(value: string) {
  albumFilter.value = value as typeof albumFilter.value
  if (value !== 'specific-album') {
    specificAlbumId.value = null
  }
}
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
    @click="handleClose"
  >
    <div
      class="w-full max-w-lg rounded-2xl shadow-2xl border p-6"
      :class="uiStore.isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'"
      @click.stop
    >
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h2
          class="text-xl font-semibold"
          :class="uiStore.isDarkMode ? 'text-gray-100' : 'text-gray-900'"
        >
          Settings
        </h2>
        <button
          @click="handleClose"
          class="p-1 rounded-full transition-colors"
          :class="uiStore.isDarkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'"
          aria-label="Close settings"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Settings Content -->
      <div class="space-y-6">
        <!-- Skip Videos Toggle -->
        <div class="flex items-center justify-between">
          <div>
            <h3
              class="text-sm font-medium"
              :class="uiStore.isDarkMode ? 'text-gray-200' : 'text-gray-800'"
            >
              Skip Videos
            </h3>
            <p
              class="text-xs mt-1"
              :class="uiStore.isDarkMode ? 'text-gray-400' : 'text-gray-600'"
            >
              Only show photos, skip video files
            </p>
          </div>
          <button
            @click="skipVideos = !skipVideos"
            class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
            :class="skipVideos ? 'bg-green-600' : uiStore.isDarkMode ? 'bg-gray-700' : 'bg-gray-300'"
            role="switch"
            :aria-checked="skipVideos"
          >
            <span
              class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
              :class="skipVideos ? 'translate-x-6' : 'translate-x-1'"
            />
          </button>
        </div>

        <!-- Album Filter Section -->
        <div class="border-t pt-6"
          :class="uiStore.isDarkMode ? 'border-gray-700' : 'border-gray-200'"
        >
          <h3
            class="text-sm font-medium mb-3"
            :class="uiStore.isDarkMode ? 'text-gray-200' : 'text-gray-800'"
          >
            Album Filter
          </h3>

          <div class="space-y-2">
            <!-- All Assets -->
            <label
              class="flex items-center p-3 rounded-lg cursor-pointer transition-colors"
              :class="albumFilter === 'all'
                ? uiStore.isDarkMode ? 'bg-blue-900/30 border-blue-600' : 'bg-blue-50 border-blue-500'
                : uiStore.isDarkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'"
              style="border-width: 2px;"
            >
              <input
                type="radio"
                name="albumFilter"
                value="all"
                :checked="albumFilter === 'all'"
                @change="handleFilterChange('all')"
                class="mr-3"
              />
              <div>
                <div
                  class="text-sm font-medium"
                  :class="uiStore.isDarkMode ? 'text-gray-200' : 'text-gray-800'"
                >
                  All Assets
                </div>
                <div
                  class="text-xs"
                  :class="uiStore.isDarkMode ? 'text-gray-400' : 'text-gray-600'"
                >
                  Show all photos and videos
                </div>
              </div>
            </label>

            <!-- Only In Albums -->
            <label
              class="flex items-center p-3 rounded-lg cursor-pointer transition-colors"
              :class="albumFilter === 'in-albums'
                ? uiStore.isDarkMode ? 'bg-blue-900/30 border-blue-600' : 'bg-blue-50 border-blue-500'
                : uiStore.isDarkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'"
              style="border-width: 2px;"
            >
              <input
                type="radio"
                name="albumFilter"
                value="in-albums"
                :checked="albumFilter === 'in-albums'"
                @change="handleFilterChange('in-albums')"
                class="mr-3"
              />
              <div>
                <div
                  class="text-sm font-medium"
                  :class="uiStore.isDarkMode ? 'text-gray-200' : 'text-gray-800'"
                >
                  Only In Albums
                </div>
                <div
                  class="text-xs"
                  :class="uiStore.isDarkMode ? 'text-gray-400' : 'text-gray-600'"
                >
                  Show only assets that are in at least one album
                </div>
              </div>
            </label>

            <!-- Not In Albums -->
            <label
              class="flex items-center p-3 rounded-lg cursor-pointer transition-colors"
              :class="albumFilter === 'not-in-albums'
                ? uiStore.isDarkMode ? 'bg-blue-900/30 border-blue-600' : 'bg-blue-50 border-blue-500'
                : uiStore.isDarkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'"
              style="border-width: 2px;"
            >
              <input
                type="radio"
                name="albumFilter"
                value="not-in-albums"
                :checked="albumFilter === 'not-in-albums'"
                @change="handleFilterChange('not-in-albums')"
                class="mr-3"
              />
              <div>
                <div
                  class="text-sm font-medium"
                  :class="uiStore.isDarkMode ? 'text-gray-200' : 'text-gray-800'"
                >
                  Not In Albums
                </div>
                <div
                  class="text-xs"
                  :class="uiStore.isDarkMode ? 'text-gray-400' : 'text-gray-600'"
                >
                  Show only assets not in any album
                </div>
              </div>
            </label>

            <!-- Specific Album -->
            <label
              class="flex items-center p-3 rounded-lg cursor-pointer transition-colors"
              :class="albumFilter === 'specific-album'
                ? uiStore.isDarkMode ? 'bg-blue-900/30 border-blue-600' : 'bg-blue-50 border-blue-500'
                : uiStore.isDarkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'"
              style="border-width: 2px;"
            >
              <input
                type="radio"
                name="albumFilter"
                value="specific-album"
                :checked="albumFilter === 'specific-album'"
                @change="handleFilterChange('specific-album')"
                class="mr-3"
              />
              <div class="flex-1">
                <div
                  class="text-sm font-medium"
                  :class="uiStore.isDarkMode ? 'text-gray-200' : 'text-gray-800'"
                >
                  Specific Album
                </div>
                <div
                  class="text-xs mb-2"
                  :class="uiStore.isDarkMode ? 'text-gray-400' : 'text-gray-600'"
                >
                  Show only assets from a selected album
                </div>

                <!-- Album Selector -->
                <select
                  v-if="albumFilter === 'specific-album'"
                  v-model="specificAlbumId"
                  class="mt-2 w-full px-3 py-2 rounded-lg text-sm border"
                  :class="uiStore.isDarkMode
                    ? 'bg-gray-900 border-gray-600 text-gray-200'
                    : 'bg-white border-gray-300 text-gray-800'"
                  @click.stop
                >
                  <option :value="null">Select an album...</option>
                  <option
                    v-for="album in albums"
                    :key="album.id"
                    :value="album.id"
                  >
                    {{ album.albumName }} ({{ album.assetCount || 0 }} items)
                  </option>
                </select>
              </div>
            </label>
          </div>
        </div>
      </div>

      <!-- Footer Buttons -->
      <div class="mt-6 flex items-center justify-end gap-3">
        <button
          type="button"
          class="px-4 py-2 rounded-lg text-sm font-medium border transition-colors"
          :class="uiStore.isDarkMode
            ? 'border-gray-700 text-gray-200 hover:bg-gray-800'
            : 'border-gray-300 text-gray-700 hover:bg-gray-100'"
          @click="handleClose"
        >
          Cancel
        </button>
        <button
          type="button"
          class="px-5 py-2 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          @click="handleApply"
        >
          Apply Settings
        </button>
      </div>
    </div>
  </div>
</template>
