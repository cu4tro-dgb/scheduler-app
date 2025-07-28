<template>
  <FullCalendar ref="fullCalendar" :options="calendarOptions">
    <template #event-content="{ event, view }">
      <template v-if="view.type === 'dayGridMonth'">
        <span class="text-xs text-muted font-bold">
          <time>
            {{ formatInTimeZone(event.start, 'America/Lima', 'HH:mm') }}
          </time>
          -
          <time>
            {{ formatInTimeZone(event.end, 'America/Lima', 'HH:mm') }}
          </time>
        </span>
        <br>
        <span class="font-bold text-highlighted">{{ event.title }}</span>
      </template>
      <template v-else>
        <span class="font-bold block text-highlighted">{{ event.title }}</span>

        <span class="text-base text-muted font-bold block">
          <time>
            {{ formatInTimeZone(event.start, 'America/Lima', 'HH:mm') }}
          </time>
          -
          <time>
            {{ formatInTimeZone(event.end, 'America/Lima', 'HH:mm') }}
          </time>
        </span>

        <span class="text-base font-bold block text-highlighted">
          {{ event.extendedProps.resourceId }}
        </span>
      </template>
    </template>
    <template #header-content="{ event }">{{ event }}</template>
  </FullCalendar>
</template>

<script lang="ts" setup>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { LazyModalEvent } from '#components'
import type {
  CalendarApi,
  CalendarOptions,
  DateSelectArg,
  EventApi,
  EventClickArg
} from '@fullcalendar/core'

import { formatInTimeZone } from 'date-fns-tz'
import { es } from 'date-fns/locale'

const fullCalendar = ref<InstanceType<typeof FullCalendar> | null>(null)
const { events, currentEvents } = useEvents()

const { setCalendar } = useCalendar()

onMounted(() => {
  const api = fullCalendar.value?.getApi() as CalendarApi
  setCalendar(api)
})

const overlay = useOverlay()
const calendarOptions = ref<CalendarOptions>({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: 'timeGridWeek',
  initialEvents: events.value,
  headerToolbar: {
    left: 'title',
    center: 'dayGridMonth,timeGridWeek,timeGridDay',
    right: 'prev,today,next'
  },
  allDaySlot: false,
  titleFormat(arg) {
    return formatInTimeZone(arg.date.marker, 'America/Lima', 'MMMM, yyyy', {
      locale: es
    })
  },
  dayHeaderContent: (arg) => {
    return {
      html:
        arg.view.type === 'dayGridMonth'
          ? `<span class="font-bold text-2xl">
              ${formatInTimeZone(arg.date, 'America/Lima', 'EEE')}
             </span>`
          : `<span class="font-bold">
              ${formatInTimeZone(arg.date, 'America/Lima', 'EEEE')} 
             </br>
             <span class="text-3xl">
               ${formatInTimeZone(arg.date, 'America/Lima', 'dd')}
             </span>
            </span>`
    }
  },
  slotLabelContent: (arg) => {
    return {
      html: `<span class="font-bold text-sm text-muted text-left block">${formatInTimeZone(
        arg.date,
        'America/Lima',
        'h aaa'
      )}</span>`
    }
  },
  editable: true,
  selectable: true,
  locale: 'es',
  select: handleDateSelect,
  eventClick: handleEventClick,
  eventClassNames: (arg) => {
    return [`evento-${arg.event.extendedProps.resourceId}`]
  },
  eventsSet: handleEvents // <- Se llama cuando los eventos se inican o se actualizan,
})

async function handleDateSelect(selectInfo: DateSelectArg) {
  const modal = overlay.create(LazyModalEvent)
  modal.open({
    event: {
      start: formatInTimeZone(
        selectInfo.start,
        'America/Lima',
        "yyyy-MM-dd'T'HH:mm"
      ),
      end: formatInTimeZone(
        selectInfo.end,
        'America/Lima',
        "yyyy-MM-dd'T'HH:mm"
      )
    }
  })
}

async function handleEventClick(clickInfo: EventClickArg) {
  const modal = overlay.create(LazyModalEvent)
  modal.open({
    event: {
      id: clickInfo.event.id,
      title: clickInfo.event.title,
      start: formatInTimeZone(
        clickInfo.event.start || clickInfo.event.startStr,
        'America/Lima',
        "yyyy-MM-dd'T'HH:mm"
      ),
      end: formatInTimeZone(
        clickInfo.event.end || clickInfo.event.endStr,
        'America/Lima',
        "yyyy-MM-dd'T'HH:mm"
      ),
      resourceId: clickInfo.event.extendedProps.resourceId
    }
  })
}

function handleEvents(events: EventApi[]) {
  currentEvents.value = events
}
</script>

<style>
:root {
  /* Color de los bordes */
  --fc-border-color: transparent !important;
  /* Color de los eventos */
  --fc-page-bg-color: transparent !important;
  /* --fc-event-bg: var(--color-gray-700) !important; */
}

.fc {
  height: calc(100vh - calc(var(--spacing) * 4));
}

.fc-timegrid-event .fc-event-main {
  padding: 0.7em 0.9em;
  border-radius: 2rem;
}

.fc-toolbar-title {
  font-weight: 900;
}
.fc-header-toolbar {
  position: relative;
}

.fc-toolbar-chunk:nth-child(2) {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--color-gray-700);
}

.fc-toolbar-chunk:nth-child(2) .fc-button-group button,
.fc-toolbar-chunk:nth-child(3) .fc-button-group button:nth-child(2) {
  width: 120px;
}

.fc-toolbar-chunk:has(.fc-button-group) {
  padding: 2px 4px;
  border-radius: 10px;
}

.fc-toolbar-chunk .fc-button-group {
  display: flex !important;
  gap: 0.3rem;
}
.fc-toolbar-chunk .fc-button-group button {
  font-weight: 900;
  border-radius: 0.5rem !important;
}

.fc-button-primary {
  outline: none;
}

.fc .fc-button-primary:not(:disabled).fc-button-active:focus,
.fc .fc-button-primary:not(:disabled):active:focus {
  box-shadow: none !important;
}

/* Espaciado entre las filas de la primeta tabla(tabla padre) */
.fc .fc-scrollgrid {
  border-spacing: 1.25rem !important;
}

/* Padding Y background  de los header days */
th.fc-day.fc-day-today {
  background-color: rgba(0, 0, 0, 0.3) !important;
}

th.fc-day {
  padding-block: 0.925rem;
}

/* Color de la fecha actual (columan entera) */
.fc .fc-day-today {
  background-color: transparent !important;
  border-radius: 1rem;
}

/* Alineamiento de las horas de los dias */
.fc-timegrid-slot-label-frame.fc-scrollgrid-shrink-frame {
  text-align: center !important;
}

.fc-event {
  border-radius: 1rem;
}

.fc-daygrid-dot-event {
  display: block !important;
  padding: 0.7em 0.9em !important;
}

.evento-m1 {
  background-color: #b9d9ff !important;
  border-color: #b9d9ff !important;
}
.evento-m2 {
  background-color: #fbd484 !important;
  border-color: #fbd484 !important;
}
.evento-m3 {
  background-color: #bfb0fe !important;
  border-color: #bfb0fe !important;
}
</style>
