<script setup lang="ts">
interface Props {
  modelValue?: boolean
  yesLabel?: string
  noLabel?: string
}

withDefaults(defineProps<Props>(), {
  yesLabel: 'Sí',
  noLabel: 'No'
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

function select(value: boolean): void {
  emit('update:modelValue', value)
}
</script>

<template>
  <div class="toggle-button">
    <button
      type="button"
      class="toggle-option"
      :class="{ active: modelValue === true }"
      @click="select(true)"
    >
      {{ yesLabel }}
    </button>
    <button
      type="button"
      class="toggle-option"
      :class="{ active: modelValue === false }"
      @click="select(false)"
    >
      {{ noLabel }}
    </button>
  </div>
</template>

<style scoped>
.toggle-button {
  display: flex;
  gap: 0.5rem;
}

.toggle-option {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid #E5E7EB;
  border-radius: 0.5rem;
  background: white;
  font-size: 1rem;
  font-weight: 500;
  color: #6B7280;
  cursor: pointer;
  transition: all 0.2s ease;
}

.toggle-option:hover {
  border-color: #D1D5DB;
}

.toggle-option.active {
  border-color: #2E7D32;
  background-color: #E8F5E9;
  color: #2E7D32;
}
</style>
