'use client'

import { logout } from '../actions'

export function LogoutButton() {
  return (
    <button
      onClick={() => logout()}
      className="text-sm text-gray-500 hover:text-red-600 font-medium transition-colors underline decoration-gray-300 hover:decoration-red-300 underline-offset-4"
    >
      로그아웃
    </button>
  )
}