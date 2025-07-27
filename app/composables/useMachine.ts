import type { MachineItem } from '~/types/machine'

export const useMachine = () => {
  const machines = ref<MachineItem[]>([
    { id: 'm1', title: 'Excavadora', machine_value: 3 },
    { id: 'm2', title: 'Retroexcavadora', machine_value: 0 },
    { id: 'm3', title: 'Camión', machine_value: 12 }
  ])
  // <- machine_valuevalue representa la cantida de eventos que tiene la maquina
  return {
    machines
  }
}
