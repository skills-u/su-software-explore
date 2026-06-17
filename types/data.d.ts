interface University {
  name: string
  domain: string
  url: string
  state: string | null
}


// Table 

type ViewMode = 'grid' | 'table'
type ColumnKey = 'name' | 'domain' | 'state' | 'url'

interface ColumnDef {
  key: ColumnKey
  label: string
  defaultWidth: number
  minWidth: number
  hideable: boolean
}