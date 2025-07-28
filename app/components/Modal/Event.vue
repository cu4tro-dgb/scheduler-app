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
import { toDate } from 'date-fns-tz'
import { LazyModalConfirmEvent } from '#components'

const props = defineProps<{ event: Partial<Events> }>()

const emit = defineEmits<{ close: [boolean] }>()

const toast = useToast()

const { events } = useEvents()
const { machines } = useMachine()
const calendar = useCalendar()

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

function isOverlappingEvent(
  start: string,
  end: string,
  resourceId: string
): any[] | null {
  const existingEvents = calendar.calendarApi.value?.getEvents() ?? []

  const startEvent = toDate(start, { timeZone: 'America/Lima' })
  const endEvent = toDate(end, { timeZone: 'America/Lima' })

  return (
    existingEvents.filter((ev) => {
      const sameMachine = ev.extendedProps?.resourceId === resourceId

      const eStart = toDate(ev.startStr, { timeZone: 'America/Lima' }) // <- Eventos existtente
      const eEnd = toDate(ev.endStr, { timeZone: 'America/Lima' })

      const isOverlapping = startEvent < eEnd && endEvent > eStart

      return sameMachine && isOverlapping
    }) || null
  )
}

const overlay = useOverlay()

const submitCreateEvent = async (body: FormSubmitEvent<EventForm>) => {
  const { start, end, resourceId, id, title } = body.data

  const overlappingEvents = isOverlappingEvent(start, end, resourceId)
  if (overlappingEvents && overlappingEvents.length > 0) {
    const modalConfirm = overlay.create(LazyModalConfirmEvent)
    modalConfirm.open({
      event: body.data,
      overlappingEvents: overlappingEvents
    })
    return
  }

  if (id) {
    // <- Actualizar
    events.value = events.value.map((ev: TUpdateEvent) => {
      if (ev.id === id) {
        return {
          id: id,
          end: end,
          start: start,
          resourceId: resourceId,
          title: title
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
      title: title,
      start: start,
      end: end,
      resourceId: resourceId
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
