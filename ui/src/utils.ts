import { SERVER_START_DATE } from '@/constants'
import { Access, Role } from '@/graphql/types.gen'
import { InstanceInput } from '@/graphql/types.gen'
import { Author } from '@/graphql/types.gen'
import { useDialogStore } from '@/store/dialog'
import { ExtendedAuthor } from '@/types/ExtendedAuthor'
import { ExtendedInstance } from '@/types/ExtendedInstance'

export function handleLinkClicks(
  event: MouseEvent,
  dialogStore: ReturnType<typeof useDialogStore>
) {
  // ensure we use the link, in case the click has been received by a subelement
  let htmlTarget = event.target as HTMLElement
  while (htmlTarget && htmlTarget.tagName !== 'A') htmlTarget = htmlTarget.parentNode as HTMLElement

  const target = htmlTarget as HTMLAnchorElement
  const href = target?.getAttribute('href')
  // handle only links that occur inside the component and do not reference external resources
  if (target && target.matches('a') && href) {
    // some sanity checks taken from vue-router:
    // https://github.com/vuejs/vue-router/blob/dev/src/components/link.js#L106
    const { altKey, ctrlKey, metaKey, shiftKey, button, defaultPrevented } = event

    // don't handle with control keys
    if (metaKey || altKey || ctrlKey || shiftKey) return
    // don't handle when preventDefault called
    if (defaultPrevented) return
    // don't handle right clicks
    if (button !== undefined && button !== 0) return

    event.preventDefault()
    const url = new URL(href)
    if (window.origin === url.origin) {
      window.open(url.href, '_blank')
      return true
    }

    const linkOrigin = url.origin.replace('http://', '').replace('https://', '')
    dialogStore.showDialog({
      title: 'Hold up',
      text: `This link will take you to <a href="${url.origin}" target="_blank">${linkOrigin}</a>, are you sure you want to go there?`,
      buttons: [
        {
          text: 'cancel',
          onClicked: () => {},
        },
        {
          text: 'go there',
          onClicked: () => {
            window.open(url.href, '_blank')
          },
        },
      ],
    })
    return true
  }

  return false
}

const orderedRoles = [Role.AllUsers, Role.Member, Role.Moderator, Role.Admin]
export function getMostPermissiveRole(roles: Role[]) {
  for (const r of orderedRoles) {
    if (roles.includes(r)) {
      return r
    }
  }
  throw new Error('invalid roles')
}

export function generateAvatar() {
  const r = Math.random().toString(16).substring(2, 16)

  let hash = 0
  for (let i = 0; i < r.length; i++) {
    hash = (hash << 5) - hash + r.charCodeAt(i)
    hash |= 0 // to 32bit integer
    hash = Math.abs(hash)
  }

  // return `https://api.dicebear.com/6.x/shapes/svg?seed=${hash}`
  return `https://avatars.dicebear.com/api/human/${hash}.svg`
}

export function timeSince(timestamp: Date) {
  const now = new Date()
  const secondsPast = (now.getTime() - timestamp.getTime()) / 1000
  if (secondsPast < 10) {
    return 'just now'
  }
  if (secondsPast < 60) {
    return `a few seconds ago`
  }
  if (secondsPast < 3600) {
    return `${Math.floor(secondsPast / 60)}m ago`
  }
  if (secondsPast <= 86400) {
    return `${Math.floor(secondsPast / 3600)}h ago`
  }

  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]
  const day = timestamp.getDate()
  const month = months[timestamp.getMonth()]
  if (timestamp.getFullYear() == now.getFullYear()) {
    return `${month} ${day}`
  } else {
    const year = timestamp.getFullYear()
    return `${month} ${day}, ${year}`
  }
}

export function getInstanceInput(instance: ExtendedInstance): InstanceInput {
  return {
    name: instance.name,
    readAccess: instance.readAccess,
    icon: instance.icon,
    description: instance.description,
    showAuthor: instance.showAuthor,
    showChat: instance.showChat,
    showComments: instance.showComments,
    showLikes: instance.showLikes,
  }
}

export function createInstanceInput(): InstanceInput {
  return {
    name: '',
    readAccess: Access.Public,
    icon: generateAvatar(),
    description: '',
    showAuthor: true,
    showChat: true,
    showComments: true,
    showLikes: true,
  }
}

export function extendAuthor(author: Author): ExtendedAuthor {
  const createdAtDate = new Date(author.createdAt)
  let createdAtTimeSince = timeSince(createdAtDate)
  if (createdAtDate.getTime() < SERVER_START_DATE.getTime()) {
    createdAtTimeSince = 'before time'
  }

  return {
    ...author,
    avatar: author.avatar || generateAvatar(),
    createdAtDate,
    createdAtTimeSince,
  }
}

const spookyWords = [
  'vampire',
  'vampires',
  'ghost',
  'ghosts',
  'Werewolf',
  'werewolves',
  'mummy',
  'mummies',
  'monster',
  'monsters',
  'dracula',
  'demon',
  'demons',
  'skeleton',
  'skeletons',
  'frankenstein',
  'ghoul',
  'ghouls',
  'banshee',
  'banshees',
  'zombie',
  'zombies',
  'bat',
  'bats',
  'witch',
  'witches',
  'pumpkin',
  'pumpkins',
  'haunted',
  'spooky',
  'spookier',
  'spookiest',
  'scary',
  'scarier',
  'scariest',
  'boo',
  'jack-o-lantern',
  'halloween',

  'kooky',
  'doom',
  'skull',
  'spider',
  'spoopy',
  'undertale',
  'terror',
  'vlad the impaler',
  'Samhain',
  'green eggs and ham',
  'griefed',
  'garfield',
  'politics',
  'possessed',
  'irs',
  'spook',
  'bonfire',
  'devil',
  'satan',
  'lucifer',
  'hell',
  'Taxes',
  'Depression',
  'Murder',
  'Emo',
  'Edgy',
  'My little brother',
  'Uhhhhhh',
  'My dogs farts',
  'Charr',
  'Qoute',
  'Chomps',
  'Phantom',
  'Poltergeist',
  'pooky',
  'charr',
  'qoute',
  'Tankey',
  'CerithKD',
  'nepeta',
  'blood',
  'scare',
  'nizneb',
  'Spork',
  'eyeballs',
  'heinous',
]

export function spookifyString(str: string): string {
  const pattern = new RegExp(`\\b(${spookyWords.join('|')})\\b`, 'ig')
  const spookyStr = str.replace(
    pattern,
    v => `<span style="font-family: \'Halloween\'; color: #D6002F;">${v.toUpperCase()}</span>`
  )

  return spookyStr
}
