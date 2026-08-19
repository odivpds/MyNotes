import { login, signup, loginWithGoogle } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/PasswordInput'
import { ForgotPasswordDialog } from '@/components/ForgotPasswordDialog'
import { MotivationalQuote } from '@/components/MotivationalQuote'

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams
  return (
    <div className="flex min-h-screen lg:h-screen lg:overflow-hidden bg-zinc-800">

      {/* Left Side: Quotes & Hero (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 items-center justify-center p-8 xl:p-12 relative overflow-hidden">
        <div className="relative z-10 w-full h-full flex flex-col justify-center">
          <MotivationalQuote userName="Explorer" />
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="flex-1 lg:flex-none lg:w-7/12 xl:flex-1 flex flex-col items-center p-3 py-4 sm:p-8 sm:py-12 overflow-y-auto">
        <div className="w-full max-w-md bg-[#FDE047] border-4 border-black p-5 sm:p-8 shadow-[8px_8px_0_0_#000] sm:shadow-[12px_12px_0_0_#000] transition-all rounded-none relative my-auto shrink-0">
          {/* Decorative elements: Neo-brutalist square corner bolts */}
          {/* <div className="absolute -top-2 -left-2 w-4 h-4 bg-white border-2 border-b-4 border-r-4 border-black"></div>
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-white border-2 border-b-4 border-r-4 border-black"></div>
          <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-white border-2 border-b-4 border-r-4 border-black"></div>
          <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-white border-2 border-b-4 border-r-4 border-black"></div> */}

          <div className="text-center mb-4 mt-0">
            <h1 className="text-2xl sm:text-4xl font-pixel uppercase tracking-wider text-black [text-shadow:2px_2px_0_#fff] sm:[text-shadow:3px_3px_0_#fff] mb-1">Nopepads</h1>
            <p className="font-bold border-b-2 sm:border-b-4 border-black inline-block pb-0.5 uppercase text-black text-xs sm:text-base">Sign in to your account</p>
          </div>

          {error && (
            <div className="p-4 mb-6 bg-red-400 border-4 border-black text-black font-black uppercase shadow-[4px_4px_0_0_#000] text-center">
              {error}
            </div>
          )}

          <form className="space-y-3">
            <div className="space-y-1">
              <label htmlFor="name" className="font-black text-sm sm:text-lg uppercase tracking-wide text-black flex flex-col">
                <span>Tell me your name</span>
                <span className="text-[10px] sm:text-xs text-black/70 normal-case font-bold">(e.g. Batman, Shizu, or just Bob)</span>
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                className="border-2 sm:border-4 border-black rounded-none shadow-[3px_3px_0_0_#000] sm:shadow-[6px_6px_0_0_#000] focus-visible:ring-0 focus-visible:shadow-none focus-visible:translate-x-1 focus-visible:translate-y-1 transition-all h-10 sm:h-12 text-base sm:text-lg font-bold bg-white dark:bg-white text-black"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="email" className="font-black text-sm sm:text-lg uppercase tracking-wide text-black flex justify-between items-end">
                <span>Email</span>
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                className="border-2 sm:border-4 border-black rounded-none shadow-[3px_3px_0_0_#000] sm:shadow-[6px_6px_0_0_#000] focus-visible:ring-0 focus-visible:shadow-none focus-visible:translate-x-1 focus-visible:translate-y-1 transition-all h-10 sm:h-12 text-base sm:text-lg font-bold bg-white dark:bg-white text-black"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="password" className="font-black text-sm sm:text-lg uppercase tracking-wide text-black">Password</label>
              <PasswordInput
                id="password"
                name="password"
                required
                shiftOnFocus={true}
                className="border-2 sm:border-4 border-black rounded-none shadow-[3px_3px_0_0_#000] sm:shadow-[6px_6px_0_0_#000] focus-visible:ring-0 focus-visible:shadow-none focus-visible:translate-x-1 focus-visible:translate-y-1 transition-all h-10 sm:h-12 text-base sm:text-lg font-bold bg-white dark:bg-white text-black"
              />
              <div className="flex justify-end pt-0.5">
                <ForgotPasswordDialog />
              </div>
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <Button
                type="submit"
                formAction={login}
                className="w-full h-10 sm:h-12 border-2 sm:border-4 border-black rounded-none font-black text-base sm:text-xl uppercase shadow-[3px_3px_0_0_#000] sm:shadow-[6px_6px_0_0_#000] hover:translate-y-1 hover:translate-x-1 hover:shadow-[1px_1px_0_0_#000] transition-all bg-black text-white hover:bg-zinc-800"
              >
                Log in
              </Button>
              <Button
                type="submit"
                formAction={signup}
                className="w-full h-10 sm:h-12 border-2 sm:border-4 border-black rounded-none font-black text-base sm:text-xl uppercase shadow-[3px_3px_0_0_#000] sm:shadow-[6px_6px_0_0_#000] hover:translate-y-1 hover:translate-x-1 hover:shadow-[1px_1px_0_0_#000] transition-all bg-white text-black hover:bg-gray-100"
              >
                Sign up
              </Button>
            </div>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 sm:border-t-4 border-black"></div>
              </div>
              <div className="relative flex justify-center text-xs sm:text-sm">
                <span className="px-3 bg-[#FDE047] text-black font-black uppercase text-sm sm:text-lg">Or continue with</span>
              </div>
            </div>

            <Button
              type="submit"
              formAction={loginWithGoogle}
              formNoValidate
              className="w-full h-10 sm:h-12 border-2 sm:border-4 border-black rounded-none font-black text-base sm:text-xl uppercase shadow-[3px_3px_0_0_#000] sm:shadow-[6px_6px_0_0_#000] hover:translate-y-1 hover:translate-x-1 hover:shadow-[1px_1px_0_0_#000] transition-all bg-white text-black hover:bg-gray-100 flex items-center justify-center gap-2 sm:gap-3"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                <path d="M1 1h22v22H1z" fill="none" />
              </svg>
              Google
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
