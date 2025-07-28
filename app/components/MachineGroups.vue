<template>
  <UCheckboxGroup
    v-model="value"
    :items="machines"
    :ui="{
      root: 'p-3 bg-elevated rounded-2xl',
      legend: 'font-semibold text-base'
    }"
    label-key="title"
    value-key="id"
    legend="Machines"
  >
    <template #label="{ item }">
      {{ item.title }}
      <UBadge
        v-if="item.machine_value"
        :label="item.machine_value"
        size="sm"
        :ui="{ base: 'rounded-full' }"
      />
    </template>
  </UCheckboxGroup>
</template>

<script lang="ts" setup>
import type { CheckboxGroupValue } from '@nuxt/ui'

const { machines } = useMachine()
const value = ref<CheckboxGroupValue[]>([])
</script>

<style></style>
