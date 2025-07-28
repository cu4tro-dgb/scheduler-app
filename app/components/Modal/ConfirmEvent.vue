<template>
  <UModal :ui="{ content: 'max-w-xl rounded-2xl ring-0' }">
    <template #content>
      <UAlert
        :ui="{ root: 'ring-0', title: 'text-xl font-bold' }"
        :title="'Información del evento ' + event.title"
        description="El evento que intentas crear se solapa con otro evento."
        color="neutral"
        variant="outline"
        orientation="vertical"
        :actions="[
          {
            label: 'Cancelar',
            color: 'error',
            variant: 'soft',
            size: 'md',
            onClick: () => emit('close', true)
          },
          {
            label: 'Mover abajo',
            color: 'primary',
            variant: 'subtle',
            size: 'md',
            onClick: () => moveDown()
          }
        ]"
      />
    </template>
  </UModal>
</template>

<script lang="ts" setup>
import { addMilliseconds } from 'date-fns';
import { toDate } from 'date-fns-tz';
import type { TCreateEvent } from '~/types/events'

const props = defineProps<{ event: TCreateEvent, overlappingEvents: any[] }>()
const emit = defineEmits<{ close: [boolean] }>()

const toast = useToast()
const overlay = useOverlay()

const calendar = useCalendar()

// function moverEventoAbajo(evento: { start: Date; end: Date }) {
//   const duracion = evento.end.getTime() - evento.start.getTime()

//   const nuevoStart = new Date(evento.end)
//   const nuevoEnd = new Date(nuevoStart.getTime() + duracion)

//   return { start: nuevoStart, end: nuevoEnd }
// }

function moveDown() {
  let baseStart = toDate(props.event.end, { timeZone: 'America/Lima' })
  
  props.overlappingEvents.forEach((event) => {
    const eventFind = calendar.calendarApi.value?.getEventById(event.id)
    if (!eventFind) return

    const duration = (eventFind.end?.getTime() || 0) - (eventFind.start?.getTime() || 0)

    const newStart = baseStart
    const newEnd = addMilliseconds(newStart, duration)

    eventFind?.setStart(newStart)
    eventFind?.setEnd(newEnd) 

    baseStart = newEnd
  })

  calendar.addEvent({
    title: props.event.title,
    start: props.event.start,
    end: props.event.end,
    resourceId: props.event.resourceId
  })

  toast.add({
    title: 'Success',
    description: 'Evento creado correctamente',
    color: 'success'
  })

  overlay.closeAll()
}
</script>

<style></style>
