export type WorkType = 'painting' | 'tattoo'

export interface Work {
  id: string
  type: WorkType
  title: string
  description: string | null
  price: number | null
  image_url: string
  is_available: boolean
  sort_order: number
  created_at: string
}
