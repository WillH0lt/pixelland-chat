import { Role } from '@/graphql/types.gen'

export interface Person {
  name: string
  image: string
  roles: Role[]
  about: string
}

export function initPerson(options?: Partial<Person>): Person {
  const defaults = {
    name: '',
    image: '',
    roles: [],
    about: '',
  }

  return {
    ...defaults,
    ...options,
  }
}
