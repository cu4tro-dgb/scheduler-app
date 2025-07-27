export interface Events {
  id: string
  title: string
  start: string
  end: string
  resourceId: string
}

export type TCreateEvent = Omit<Events, 'id'>
export type TUpdateEvent = Omit<Events, ''>
export type TPropsEvent = Omit<Events, 'id' | 'resourceId' | 'title'>
