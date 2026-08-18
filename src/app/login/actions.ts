'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
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
  const headersList = await headers()
  const host = headersList.get('host')
  const protocol = host?.includes('localhost') ? 'http' : 'https'
  const origin = host ? `${protocol}://${host}` : (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000')
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  })

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`)
  }

  if (data.url) {
    redirect(data.url)
  }
}

export async function updatePassword(password: string) {
  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.updateUser({
      password: password
    })
    
    if (error) {
      return { success: false, message: error.message }
    }
    
    return { success: true, message: 'Password updated successfully!' }
  } catch (err: any) {
    return { success: false, message: err.message || 'An unknown error occurred' }
  }
}
export async function resetPassword(email: string) {
  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
    })
    
    if (error) {
      return { success: false, message: error.message }
    }
    
    return { success: true, message: 'Password reset email sent! Check your inbox.' }
  } catch (err: any) {
    return { success: false, message: err.message || 'An unknown error occurred' }
  }
}
