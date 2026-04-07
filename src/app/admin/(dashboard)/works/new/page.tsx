import WorkForm from '@/components/WorkForm'
import { createWork } from '../../../actions'

export default function NewWorkPage() {
  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-6 text-xl font-bold text-zinc-900">Добавить работу</h1>
      <WorkForm action={createWork} />
    </div>
  )
}
