<script setup lang="ts">
import { useUiStore } from '@/stores/ui'
import type { ImmichAsset } from '@/types/immich'

const props = defineProps<{
  open: boolean
  asset: ImmichAsset | null
  albumNames: string[]
}>()

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const uiStore = useUiStore()

function handleConfirm() {
  emit('confirm')
}

function handleCancel() {
  emit('cancel')
}
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
    @click="handleCancel"
  >
    <div
      class="w-full max-w-md rounded-2xl shadow-2xl border p-6"
      :class="uiStore.isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'"
      @click.stop
    >
      <!-- Warning Icon -->
      <div class="flex justify-center mb-4">
        <div
          class="w-12 h-12 rounded-full flex items-center justify-center"
          :class="uiStore.isDarkMode ? 'bg-yellow-900/30' : 'bg-yellow-100'"
        >
          <svg
            class="w-7 h-7 text-yellow-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
      </div>

      <!-- Title -->
      <h2
        class="text-lg font-semibold text-center mb-2"
        :class="uiStore.isDarkMode ? 'text-gray-100' : 'text-gray-900'"
      >
        Delete Asset in Album{{ albumNames.length > 1 ? 's' : '' }}?
      </h2>

      <!-- Description -->
      <p
        class="text-sm text-center mb-4"
        :class="uiStore.isDarkMode ? 'text-gray-400' : 'text-gray-600'"
      >
        This asset is currently in
        <strong>{{ albumNames.length }} album{{ albumNames.length > 1 ? 's' : '' }}</strong>.
        Are you sure you want to delete it?
      </p>

      <!-- Album Names -->
      <div
        v-if="albumNames.length > 0"
        class="mb-6 max-h-32 overflow-y-auto rounded-lg p-3 space-y-1"
        :class="uiStore.isDarkMode ? 'bg-gray-800' : 'bg-gray-50'"
      >
        <div
          v-for="(name, index) in albumNames"
          :key="index"
          class="flex items-center gap-2 text-sm"
          :class="uiStore.isDarkMode ? 'text-gray-300' : 'text-gray-700'"
        >
          <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <span class="truncate">{{ name }}</span>
        </div>
      </div>

      <!-- Buttons -->
      <div class="flex items-center justify-end gap-3">
        <button
          type="button"
          class="px-4 py-2 rounded-lg text-sm font-medium border transition-colors"
          :class="uiStore.isDarkMode
            ? 'border-gray-700 text-gray-200 hover:bg-gray-800'
            : 'border-gray-300 text-gray-700 hover:bg-gray-100'"
          @click="handleCancel"
        >
          Cancel
        </button>
        <button
          type="button"
          class="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors"
          @click="handleConfirm"
        >
          Delete Anyway
        </button>
      </div>
    </div>
  </div>
</template>
