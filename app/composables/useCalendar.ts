import type { CalendarApi } from '@fullcalendar/core'
import type { TCreateEvent } from '~/types/events'

const calendarApi = ref<CalendarApi | null>(null)

export const useCalendar = () => {
  const setCalendar = (api: CalendarApi) => {
    calendarApi.value = api
  }

  const addEvent = (event: TCreateEvent) => {
    calendarApi.value?.addEvent({
      id: 'e' + ((calendarApi.value.getEvents().length || 0) + 1),
      title: event.title,
      start: event.start,
      end: event.end,
      resourceId: event.resourceId
    })
  }

  return {
    calendarApi,
    setCalendar,
    addEvent
  }
}
