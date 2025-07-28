<template>
  <aside class="w-full max-w-sm flex flex-col gap-5">
    <UUser
      :ui="{ root: 'p-3 bg-elevated rounded-2xl', wrapper: 'flex-1 flex justify-between items-center gap-2' }"
      name="Antonio Larencio"
      description="Product Designer"
      :avatar="{
        src: 'https://i.pravatar.cc/150?u=john-doe',
        icon: 'i-lucide-image'
      }"
    >
    <template #default>
      <div class="w-full">
        <p class="font-medium text-highlighted text-sm">Antonio Larencio</p>
        <p class="text-muted text-xs">Product Designer</p>
      </div>
      <UColorModeButton />
    </template>
    </UUser>
    <UCalendar
      v-model="value"
      :ui="{ root: 'p-3 bg-elevated rounded-2xl', heading: 'font-semibold' }"
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
