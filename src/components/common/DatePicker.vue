<script setup lang="ts">
interface Props {
  modelValue?: string
  disabled?: boolean
  min?: string
  max?: string
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

function handleInput(event: Event): void {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <input
    type="date"
    class="date-picker"
    :value="modelValue"
    :disabled="disabled"
    :min="min"
    :max="max"
    @input="handleInput"
  />
</template>

<style scoped>
.date-picker {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #D1D5DB;
  border-radius: 0.5rem;
  font-size: 1rem;
  color: #424242;
  background-color: white;
}

.date-picker:focus {
  outline: none;
  border-color: #2E7D32;
  box-shadow: 0 0 0 2px rgba(46, 125, 50, 0.2);
}

.date-picker:disabled {
  background-color: #F5F5F5;
  color: #9CA3AF;
  cursor: not-allowed;
}
</style>
