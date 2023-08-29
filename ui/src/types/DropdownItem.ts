export interface DropdownItem {
  text: string
  onClicked?: (args: any) => void
  loading?: boolean
  active?: boolean
  selected?: boolean
}
