'use client'

import { Toaster } from 'react-hot-toast'

export default function ToasterProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#2D5016',
          color: '#F5F1E8',
        },
        success: {
          style: {
            background: '#2D5016',
          },
        },
        error: {
          style: {
            background: '#DC2626',
          },
        },
      }}
    />
  )
}

