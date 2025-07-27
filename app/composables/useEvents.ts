import type { EventApi } from '@fullcalendar/core/index.js'

const currentEvents = ref<EventApi[] | null>(null)
export const useEvents = () => {
  const events = ref([
    {
      id: 'e1',
      title: 'Revisión técnica',
      start: '2025-07-27T09:00:00',
      end: '2025-07-27T11:00:00',
      resourceId: 'm1'
    },
    {
      id: 'e2',
      title: 'Funcionamiento',
      start: '2025-07-29T02:00:00',
      end: '2025-07-29T09:00:00',
      resourceId: 'm2'
    }
  ])

  return {
    events,
    currentEvents
  }
}
