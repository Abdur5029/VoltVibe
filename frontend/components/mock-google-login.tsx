'use client'

import { useState } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { signIn } from 'next-auth/react'

interface MockGoogleLoginProps {
  isOpen: boolean
  onClose: () => void
}

export function MockGoogleLogin({ isOpen, onClose }: MockGoogleLoginProps) {
  const [step, setStep] = useState<1 | 2>(1)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    // Auto-generate a name from email if not provided
    if (!name) {
      const generatedName = email.split('@')[0].replace(/[^a-zA-Z]/g, ' ')
      setName(generatedName.charAt(0).toUpperCase() + generatedName.slice(1))
    }
    setStep(2)
  }

  const handleConsent = async () => {
    setLoading(true)
    
    const names = name.trim().split(' ')
    const firstName = names[0] || 'Google'
    const lastName = names.slice(1).join(' ') || 'User'

    try {
      // Sign in using the custom mock_google provider
      const res = await signIn('mock_google', {
        redirect: false,
        email: email,
        name: name
      })

      if (res?.ok) {
        onClose()
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden bg-white rounded-3xl">
        <div className="flex flex-col items-center pt-10 pb-12 px-10">
          {/* Google Logo */}
          <div className="mb-4">
            <svg width="48" height="48" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
              <path fill="none" d="M0 0h48v48H0z"></path>
            </svg>
          </div>

          {step === 1 ? (
            <>
              <h1 className="text-2xl font-normal text-black mb-2 text-center">Sign in</h1>
              <p className="text-base text-gray-800 mb-8 text-center">to continue to VoltVibe</p>
              
              <form onSubmit={handleNext} className="w-full">
                <div className="w-full mb-6">
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email or phone"
                    className="w-full h-14 px-4 text-base rounded border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                
                <div className="flex justify-between items-center mt-12">
                  <button type="button" className="text-blue-600 hover:bg-blue-50 px-2 py-1 rounded text-sm font-medium transition-colors">
                    Create account
                  </button>
                  <Button 
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded px-6 h-10 font-medium"
                  >
                    Next
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-normal text-black mb-6 text-center">VoltVibe wants to access your Google Account</h1>
              
              <div className="w-full border border-gray-200 rounded-xl p-4 mb-6 text-left">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                    {email.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-black">{name}</p>
                    <p className="text-xs text-gray-500">{email}</p>
                  </div>
                </div>
                
                <hr className="border-gray-200 mb-4" />
                
                <p className="text-sm text-gray-700 mb-2 font-medium">This will allow VoltVibe to:</p>
                <ul className="text-sm text-gray-600 space-y-3 mb-2">
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    See your personal info, including any personal info you've made publicly available
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    See your primary Google Account email address
                  </li>
                </ul>
              </div>

              <div className="w-full flex justify-end gap-3 mt-4">
                <Button 
                  variant="ghost" 
                  onClick={onClose}
                  className="text-blue-600 hover:bg-blue-50 rounded px-6 h-10 font-medium"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleConsent}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded px-6 h-10 font-medium"
                >
                  {loading ? 'Allowing...' : 'Allow'}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
