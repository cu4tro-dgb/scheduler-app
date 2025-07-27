<template>
  <UCard
    :ui="{
      root: 'p-3 bg-white/5 rounded-2xl text-sm space-y-3 relative',
      footer: 'sm:p-0 space-x-2',
      body: 'sm:p-0 font-semibold',
      header: 'sm:p-0'
    }"
  >
    <template #header>
      {{ start ? new Date(start).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : '' }} -
      {{ end ? new Date(end).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : '' }}
    </template>
    {{ title }}
    <UBadge :ui="{base: 'absolute top-2 right-2 rounded-xl'}" label="14 min" icon="i-lucide-clock" variant="soft"/>
    <template #footer>
      <UButton
        size="sm"
        :ui="{ base: 'rounded-lg px-4' }"
        label="Later"
        variant="outline"
      />
      <UButton size="sm" :ui="{ base: 'rounded-lg px-4' }" label="Details" />
    </template>
  </UCard>
</template>

<script lang="ts" setup>
defineProps<{
  title: string
  start: string
  end: string
  resourceId?: string
}>()
</script>

<style></style>
