<template>
  <UModal
    :ui="{
      content: 'rounded-3xl divide-y-0',
      header: 'justify-between items-center',
      overlay: 'bg-black/80'
    }"
  >
    <template #header>
      <h2 class="text-xl font-bold">
        {{ event.id ? 'Actualizar' : 'Crear' }} evento
      </h2>
      <UButton
        icon="i-lucide-x"
        variant="ghost"
        color="neutral"
        :ui="{ base: 'text-xl' }"
        @click="emit('close', true)"
      />
    </template>

    <template #body>
      <UForm
        id="form-create-event"
        class="space-y-2"
        :schema="eventSchema"
        :state="eventState"
        @submit="submitCreateEvent"
      >
        <UFormField label="Título del evento" name="title">
          <UInput v-model="eventState.title" :ui="{ root: 'flex' }" required />
        </UFormField>
        <UFormField label="Fecha de inicio" name="start">
          <UInput
            v-model="eventState.start"
            :ui="{ root: 'flex' }"
            type="datetime-local"
            required
          />
        </UFormField>
        <UFormField label="Fecha de fin" name="end">
          <UInput
            v-model="eventState.end"
            :ui="{ root: 'flex' }"
            type="datetime-local"
            required
          />
        </UFormField>
        <UFormField label="Maquina" name="resourceId">
          <USelectMenu
            v-model="eventState.resourceId"
            :ui="{ base: 'flex w-full' }"
            :items="machines"
            value-key="id"
            label-key="title"
            placeholder="Selecciona una maquina"
          />
        </UFormField>
      </UForm>
    </template>

    <template #footer>
      <UButton
        form="form-create-event"
        type="submit"
        color="primary"
        block
        :label="event.id ? 'Actualizar' : 'Crear'"
      />
    </template>
  </UModal>
</template>

<script lang="ts" setup>
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import type { Events, TUpdateEvent } from '~/types/events'

const props = defineProps<{ event: Partial<Events> }>()

const emit = defineEmits<{ close: [boolean] }>()

const { events } = useEvents()

const { machines } = useMachine()

const toast = useToast()

const eventSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1),
  start: z.string(),
  end: z.string(),
  resourceId: z.string()
})

type EventForm = z.output<typeof eventSchema>

const eventState = reactive<Partial<EventForm>>({})

onMounted(() => {
  eventState.start = props.event.start // <- Siempre tiene que tenar valor
  eventState.end = props.event.end // <- Siempre tiene que tenar valor
  eventState.id = props.event?.id
  eventState.title = props.event?.title
  eventState.resourceId = props.event?.resourceId
})

const submitCreateEvent = async (body: FormSubmitEvent<EventForm>) => {
  if (body.data.id) { // <- Actualizar
    events.value = events.value.map((ev: TUpdateEvent) => {
      if (ev.id === body.data.id) {
        return {
          id: body.data.id,
          end: body.data.end,
          start: body.data.start,
          resourceId: body.data.resourceId,
          title: body.data.title
        }
      }
      return ev
    })

    toast.add({
      title: 'Success',
      description: 'Evento actualizado correctamente',
      color: 'success'
    })

    emit('close', true)
  } else {
    useCalendar().addEvent({
      title: body.data.title,
      start: body.data.start,
      end: body.data.end,
      resourceId: body.data.resourceId
    })

    toast.add({
      title: 'Success',
      description: 'Evento creado correctamente',
      color: 'success'
    })

    emit('close', true)
  }
}
</script>

<style></style>
