'use client'

import React, { useState } from 'react'

type SendStatus = 'idle' | 'sending' | 'success' | 'error'

// This component receives all cell props from Payload, but we only need rowData.
function SendWaCell(props: { rowData?: { id?: string }; collectionSlug: string }) {
  const { rowData, collectionSlug } = props
  const [sendStatus, setSendStatus] = useState<SendStatus>('idle')
  const [message, setMessage] = useState<string>('Kirim PDF')

  const handleSendWA = async () => {
    if (!rowData?.id) {
      setSendStatus('error')
      setMessage('Error: Missing ID')
      return
    }

    setSendStatus('sending')
    setMessage('Mengirim...')

    try {
      const response = await fetch('/api/regenerate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId: rowData.id,
          collectionSlug: collectionSlug,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Server error ${response.status}`)
      }

      await response.json()
      setSendStatus('success')
      setMessage('Terkirim!')
    } catch (error: any) {
      setSendStatus('error')
      setMessage(`Gagal: ${error.message}`)
    } finally {
      setTimeout(() => {
        setSendStatus('idle')
        setMessage('Kirim PDF')
      }, 3000)
    }
  }

  const disabled = sendStatus === 'sending'

  let backgroundColor = '#6c757d' // Gray for idle
  if (sendStatus === 'success') backgroundColor = '#28a745' // Green for success
  if (sendStatus === 'error') backgroundColor = '#dc3545' // Red for error
  if (sendStatus === 'sending') backgroundColor = '#ffc107' // Yellow for sending

  const downloadUrl = `/api/booking/${rowData?.id}/pdf?type=${
    collectionSlug.includes('auditorium') ? 'auditorium' : 'hostel'
  }`

  return (
    <div style={{ display: 'flex', gap: '5px' }}>
      <a
        href={downloadUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          backgroundColor: '#007bff', // Blue
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          padding: '5px 10px',
          fontSize: '12px',
          textDecoration: 'none',
          cursor: 'pointer',
          display: 'inline-block',
        }}
      >
        Download PDF
      </a>
      <button
        onClick={handleSendWA}
        disabled={disabled}
        style={{
          backgroundColor: backgroundColor,
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          padding: '5px 10px',
          fontSize: '12px',
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}
      >
        {message}
      </button>
    </div>
  )
}

export default SendWaCell
