'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  let errorMsg = ''
  try {
    const supabase = await createClient()
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) errorMsg = error.message
  } catch (err: any) {
    errorMsg = err.message || 'Unknown error during login'
  }

  if (errorMsg) {
    redirect(`/login?error=${encodeURIComponent(errorMsg)}`)
  }

  revalidatePath('/', 'layout')
  redirect('/notes')
}

export async function signup(formData: FormData) {
  let errorMsg = ''
  try {
    const supabase = await createClient()
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      errorMsg = error.message
    } else if (!data.session) {
      errorMsg = 'Email confirmation required! Please disable "Confirm email" in Supabase Authentication settings.'
    }
  } catch (err: any) {
    errorMsg = err.message || 'Unknown error during signup'
  }

  if (errorMsg) {
    redirect(`/login?error=${encodeURIComponent(errorMsg)}`)
  }

  revalidatePath('/', 'layout')
  redirect('/notes')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export async function loginWithGoogle() {
  const supabase = await createClient()
  
  // NOTE: You must set up the SITE_URL or use a dynamic origin for the redirectUrl
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
    },
  })

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`)
  }

  if (data.url) {
    redirect(data.url)
  }
}
