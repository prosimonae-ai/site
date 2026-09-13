import { useMemo } from 'react'
import { useFurniture, useRooms } from '../store/useAppStore'
import { roomArea, roomOpenings } from '../three/helpers/geometry'
import type { Room } from '../types'

export function useApartmentMetrics() {
  const rooms = useRooms()
  const furniture = useFurniture()
  return useMemo(() => ({
    area: rooms.reduce((a, r) => a + roomArea(r), 0),
    roomCount: rooms.length,
    furnitureCount: furniture.length,
  }), [rooms, furniture])
}

export function roomStats(room: Room, furnitureCount: number) {
  const openings = roomOpenings(room)
  const windows = openings.filter(o => o.type === 'window').length
  const doors = openings.filter(o => o.type === 'door').length
  return { area: roomArea(room), windows, doors, furnitureCount }
}
