export const PAGE_SIZE = 24
export const LETTERS = ['All', '#', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')]
export const GRADIENTS = [
  'from-indigo-500 to-violet-500',
  'from-violet-500 to-fuchsia-500',
  'from-sky-500 to-indigo-500',
  'from-emerald-500 to-teal-500',
  'from-rose-500 to-pink-500',
  'from-amber-500 to-orange-500',
  'from-cyan-500 to-blue-500',
  'from-fuchsia-500 to-purple-500',
] as const


export const COLUMNS: ColumnDef[] = [
  { key: 'name',   label: 'Name',    defaultWidth: 300, minWidth: 160, hideable: false },
  { key: 'domain', label: 'Domain',  defaultWidth: 200, minWidth: 100, hideable: true  },
  { key: 'state',  label: 'State',   defaultWidth: 160, minWidth: 80,  hideable: true  },
  { key: 'url',    label: 'Website', defaultWidth: 110, minWidth: 80,  hideable: true  },
]