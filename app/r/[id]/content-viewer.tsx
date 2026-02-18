'use client'

import { useState } from 'react'

interface Document {
  _id: string
  title?: string
  contentType: 'image' | 'audio' | 'video'
  hasCode?: boolean
  code?: string
  imageFile?: {
    asset: {
      url: string
      _id: string
    }
  }
  audioFile?: {
    asset: {
      url: string
      _id: string
    }
    title?: string
  }
  videoFile?: {
    asset: {
      url: string
      _id: string
    }
    title?: string
  }
}

interface ContentViewerProps {
  document: Document
}

export default function ContentViewer({ document }: ContentViewerProps) {
  const [enteredCode, setEnteredCode] = useState('')
  const [isUnlocked, setIsUnlocked] = useState(!document.hasCode)
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!document.hasCode || !document.code) {
      setIsUnlocked(true)
      return
    }

    if (enteredCode === document.code) {
      setIsUnlocked(true)
      setError('')
    } else {
      setError('Código incorrecto. Intenta nuevamente.')
      setEnteredCode('')
    }
  }

  // Si no requiere código o ya está desbloqueado, mostrar contenido
  if (isUnlocked) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          {/* Mostrar contenido según el tipo */}
          {document.contentType === 'image' && document.imageFile?.asset?.url && (
            <div className="w-full">
              <img
                src={document.imageFile.asset.url}
                alt={document.title || 'Imagen'}
                className="w-full h-auto"
              />
            </div>
          )}
          
          {document.contentType === 'audio' && document.audioFile?.asset?.url && (
            <div className="w-full">
              <audio controls className="w-full">
                <source src={document.audioFile.asset.url} />
                Tu navegador no soporta el elemento de audio.
              </audio>
            </div>
          )}
          
          {document.contentType === 'video' && document.videoFile?.asset?.url && (
            <div className="w-full">
              <video controls className="w-full">
                <source src={document.videoFile.asset.url} />
                Tu navegador no soporta el elemento de video.
              </video>
            </div>
          )}
        </div>
      </main>
    )
  }

  // Mostrar formulario de código
  return (
    <main className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-50 rounded-lg p-8 shadow-lg">
          <h1 className="text-2xl font-bold text-black text-center mb-6">Código de acceso</h1>
          <p className="text-gray-600 text-center mb-6">
            Ingresá lo que <span>dure el silencio</span> para acceder</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={3}
                value={enteredCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '')
                  setEnteredCode(value)
                  setError('')
                }}
                className="w-full text-center text-4xl font-bold text-black tracking-widest border-2 border-gray-300 rounded-lg px-4 py-6 focus:outline-none focus:border-blue-500"
                placeholder="***"
                autoFocus
              />
            </div>
            
            {error && (
              <p className="text-red-600 text-center text-sm">{error}</p>
            )}
            
            <button
              type="submit"
              disabled={enteredCode.length !== 3}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
            >
              Acceder
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
