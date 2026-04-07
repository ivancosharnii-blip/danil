'use client'

import { useState, useTransition, useRef } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import type { Work, WorkType } from '@/types'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Upload } from 'lucide-react'

interface WorkFormProps {
  work?: Work
  action: (formData: FormData) => Promise<{ error?: string }>
}

function compressImage(file: File, maxSize: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new window.Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      let { width, height } = img
      if (width > maxSize || height > maxSize) {
        const ratio = Math.min(maxSize / width, maxSize / height)
        width = Math.round(width * ratio)
        height = Math.round(height * ratio)
      }
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      if (!ctx) return reject(new Error('Canvas context unavailable'))
      ctx.drawImage(img, 0, 0, width, height)
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob)
          else reject(new Error('Compression failed'))
        },
        'image/webp',
        0.85,
      )
    }
    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = url
  })
}

export default function WorkForm({ work, action }: WorkFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(work?.image_url ?? null)
  const [uploading, setUploading] = useState(false)
  const imageUrlRef = useRef<string>(work?.image_url ?? '')
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError(null)

    try {
      const compressed = await compressImage(file, 1920)
      const supabase = createClient()
      const ext = 'webp'
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const path = `public/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('works-images')
        .upload(path, compressed, { contentType: 'image/webp', upsert: false })

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage
        .from('works-images')
        .getPublicUrl(path)

      imageUrlRef.current = urlData.publicUrl
      setPreview(urlData.publicUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки')
    } finally {
      setUploading(false)
    }
  }

  function handleSubmit(formData: FormData) {
    if (!imageUrlRef.current) {
      setError('Загрузите изображение')
      return
    }
    formData.set('image_url', imageUrlRef.current)

    startTransition(async () => {
      const result = await action(formData)
      if (result?.error) {
        setError(result.error)
      } else {
        router.push('/admin/works')
      }
    })
  }

  const inputBase =
    'w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 focus:outline-none transition'

  return (
    <form action={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <label className="mb-1.5 block text-sm font-medium text-zinc-700">
          Название *
        </label>
        <input
          name="title"
          required
          defaultValue={work?.title ?? ''}
          className={inputBase}
          placeholder="Название работы"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-zinc-700">
          Описание
        </label>
        <textarea
          name="description"
          rows={4}
          defaultValue={work?.description ?? ''}
          className={inputBase + ' resize-y'}
          placeholder="Описание работы (необязательно)"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700">
            Тип *
          </label>
          <select
            name="type"
            required
            defaultValue={work?.type ?? 'painting'}
            className={inputBase}
          >
            <option value="painting">Картина</option>
            <option value="tattoo">Тату эскиз</option>
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700">
            Цена (₴)
          </label>
          <input
            name="price"
            type="number"
            min={0}
            step={1}
            defaultValue={work?.price ?? ''}
            className={inputBase}
            placeholder="Необязательно"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          name="is_available"
          id="is_available"
          defaultChecked={work?.is_available ?? true}
          value="true"
          className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500"
        />
        <label htmlFor="is_available" className="text-sm font-medium text-zinc-700">
          Доступна для продажи
        </label>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-zinc-700">
          Изображение *
        </label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 rounded-lg border border-dashed border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-600 transition hover:border-zinc-400 hover:text-zinc-800 disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Upload size={18} />
          )}
          {uploading ? 'Загрузка…' : 'Выбрать изображение'}
        </button>

        {preview && (
          <div className="relative mt-3 aspect-[4/5] w-48 overflow-hidden rounded-lg border border-zinc-200">
            <Image
              src={preview}
              alt="Превью"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending || uploading}
          className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 disabled:opacity-50"
        >
          {isPending && <Loader2 size={16} className="animate-spin" />}
          {work ? 'Сохранить' : 'Создать'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-50"
        >
          Отмена
        </button>
      </div>
    </form>
  )
}
