<script setup lang="ts">
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'

interface Props {
  avatarUrl?: string
  name?: string
  editable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  editable: false
})

const emit = defineEmits<{
  (e: 'change', file: Blob): void
}>()

function getInitials(): string {
  if (!props.name) return '?'
  const parts = props.name.split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return parts[0].substring(0, 2).toUpperCase()
}

async function takePhoto(): Promise<void> {
  if (!props.editable) return

  try {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Base64,
      source: CameraSource.Prompt,
      promptLabelHeader: 'Foto de perfil',
      promptLabelPhoto: 'Elegir de galería',
      promptLabelPicture: 'Tomar foto'
    })

    if (image.base64String) {
      const byteString = atob(image.base64String)
      const ab = new ArrayBuffer(byteString.length)
      const ia = new Uint8Array(ab)
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i)
      }
      const blob = new Blob([ab], { type: `image/${image.format}` })
      emit('change', blob)
    }
  } catch (error) {
    console.error('Error taking photo:', error)
  }
}
</script>

<template>
  <div class="avatar-container" :class="{ editable }" @click="takePhoto">
    <img
      v-if="avatarUrl"
      :src="avatarUrl"
      :alt="name"
      class="avatar-image"
    />
    <div v-else class="avatar-placeholder">
      {{ getInitials() }}
    </div>

    <div v-if="editable" class="edit-overlay">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
        <circle cx="12" cy="13" r="4" />
      </svg>
    </div>
  </div>
</template>

<style scoped>
.avatar-container {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #E8F5E9;
}

.avatar-container.editable {
  cursor: pointer;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 600;
  color: #2E7D32;
  background-color: #E8F5E9;
}

.edit-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 32px;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.edit-overlay svg {
  width: 18px;
  height: 18px;
}
</style>
