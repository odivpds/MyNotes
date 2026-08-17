import { login, signup, loginWithGoogle } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-zinc-800">
      <div className="w-full max-w-md bg-[#FDE047] border-4 border-black p-8 shadow-[12px_12px_0_0_#000] transition-all rounded-xl relative">
        {/* Decorative elements */}
        <div className="absolute -top-4 -left-4 w-8 h-8 bg-black rounded-full"></div>
        <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-black rounded-full"></div>
        
        <div className="text-center mb-8 mt-2">
          <h1 className="text-5xl font-pixel uppercase tracking-widest text-black [text-shadow:3px_3px_0_#fff] mb-4">MyNotes</h1>
          <p className="font-bold border-b-4 border-black inline-block pb-1 uppercase text-black">Sign in to your account</p>
        </div>

        {error && (
          <div className="p-4 mb-6 bg-red-400 border-4 border-black text-black font-black uppercase shadow-[4px_4px_0_0_#000] text-center">
            {error}
          </div>
        )}

        <form className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="font-black text-lg uppercase tracking-wide text-black">Email</label>
            <Input 
              id="email" 
              name="email" 
              type="email" 
              required 
              className="border-4 border-black rounded-none shadow-[6px_6px_0_0_#000] focus-visible:ring-0 focus-visible:shadow-none focus-visible:translate-x-1.5 focus-visible:translate-y-1.5 transition-all h-12 text-lg font-bold bg-white text-black" 
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="font-black text-lg uppercase tracking-wide text-black">Password</label>
            <Input 
              id="password" 
              name="password" 
              type="password" 
              required 
              className="border-4 border-black rounded-none shadow-[6px_6px_0_0_#000] focus-visible:ring-0 focus-visible:shadow-none focus-visible:translate-x-1.5 focus-visible:translate-y-1.5 transition-all h-12 text-lg font-bold bg-white text-black" 
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button 
              type="submit" 
              formAction={login} 
              className="flex-1 h-14 border-4 border-black rounded-none font-black text-xl uppercase shadow-[6px_6px_0_0_#000] hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0_0_#000] transition-all bg-black text-white hover:bg-zinc-800"
            >
              Log in
            </Button>
            <Button 
              type="submit" 
              formAction={signup} 
              className="flex-1 h-14 border-4 border-black rounded-none font-black text-xl uppercase shadow-[6px_6px_0_0_#000] hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0_0_#000] transition-all bg-white text-black hover:bg-gray-100"
            >
              Sign up
            </Button>
          </div>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-4 border-black"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[#FDE047] text-black font-black uppercase text-lg">Or continue with</span>
            </div>
          </div>

          <Button 
            type="submit" 
            formAction={loginWithGoogle} 
            formNoValidate
            className="w-full h-14 border-4 border-black rounded-none font-black text-xl uppercase shadow-[6px_6px_0_0_#000] hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0_0_#000] transition-all bg-white text-black hover:bg-gray-100 flex items-center justify-center gap-3"
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              <path d="M1 1h22v22H1z" fill="none"/>
            </svg>
            Google
          </Button>
        </form>
      </div>
    </div>
  )
}
