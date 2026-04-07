'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function login(formData: FormData): Promise<{ error?: string }> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Введите email и пароль' }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: 'Неверный email или пароль' }
  }

  redirect('/admin/works')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/admin/login')
}

export async function createWork(formData: FormData): Promise<{ error?: string }> {
  const supabase = await createClient()

  const title = formData.get('title') as string
  const description = (formData.get('description') as string) || null
  const type = formData.get('type') as 'painting' | 'tattoo'
  const priceRaw = formData.get('price') as string
  const price = priceRaw ? Number(priceRaw) : null
  const isAvailable = formData.get('is_available') === 'true'
  const imageUrl = formData.get('image_url') as string

  if (!title || !type || !imageUrl) {
    return { error: 'Заполните обязательные поля' }
  }

  const { data: maxOrder } = await supabase
    .from('works')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1)
    .single()

  const sortOrder = maxOrder ? maxOrder.sort_order + 1 : 0

  const { error } = await supabase.from('works').insert({
    title,
    description,
    type,
    price,
    is_available: isAvailable,
    image_url: imageUrl,
    sort_order: sortOrder,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/')
  return {}
}

export async function updateWork(
  id: string,
  formData: FormData,
): Promise<{ error?: string }> {
  const supabase = await createClient()

  const title = formData.get('title') as string
  const description = (formData.get('description') as string) || null
  const type = formData.get('type') as 'painting' | 'tattoo'
  const priceRaw = formData.get('price') as string
  const price = priceRaw ? Number(priceRaw) : null
  const isAvailable = formData.get('is_available') === 'true'
  const imageUrl = formData.get('image_url') as string

  if (!title || !type || !imageUrl) {
    return { error: 'Заполните обязательные поля' }
  }

  const { error } = await supabase
    .from('works')
    .update({
      title,
      description,
      type,
      price,
      is_available: isAvailable,
      image_url: imageUrl,
    })
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/')
  return {}
}

export async function deleteWork(id: string): Promise<{ error?: string }> {
  const supabase = await createClient()

  const { error } = await supabase.from('works').delete().eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/')
  revalidatePath('/admin/works')
  return {}
}
