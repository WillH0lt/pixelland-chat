import { MODE } from '@/types/ModeEnum'

const DEFAULT_API_HOSTS: { [key: string]: string } = {
  [MODE.DEV]: 'http://localhost:8081/graphql',
  [MODE.PROD]: 'https://chat.pixel.land/graphql',
  [MODE.STAGING]: 'https://chat.pixel.land/graphql',
  [MODE.TESTING]: 'http://localhost:8081/graphql',
}

export const DEFAULT_API_HOST = DEFAULT_API_HOSTS[import.meta.env.MODE]

export const NULL_UUID = '00000000-0000-0000-0000-000000000000'
export const SERVER_START_DATE = new Date('2023-02-01T12:00:00.000Z')
