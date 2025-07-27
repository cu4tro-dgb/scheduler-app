<template>
  <aside class="w-full max-w-sm flex flex-col gap-5">
    <UUser
      :ui="{ root: 'p-3 bg-white/5 rounded-2xl' }"
      name="Antonio Larencio"
      description="Product Designer"
      :avatar="{
        src: 'https://i.pravatar.cc/150?u=john-doe',
        icon: 'i-lucide-image'
      }"
    />
    <UCalendar
      v-model="value"
      :ui="{ root: 'p-3 bg-white/5 rounded-2xl', heading: 'font-semibold' }"
    />
    <CardEvents
      v-for="event in currentEvents"
      :id="event.id"
      :key="event.id"
      :title="event.title"
      :start="event.startStr"
      :end="event.endStr"
      :resource-id="event.extendedProps.resourceId"
    />
    <MachineGroups />
  </aside>
</template>

<script lang="ts" setup>
import { today } from '@internationalized/date'

const value = shallowRef(today('America/Lima'))

const { currentEvents } = useEvents()
</script>

<style></style>
