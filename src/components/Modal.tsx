import { useEffect, useRef, type ReactNode } from 'react'

interface ModalProps {
  title: string
  onClose: () => void
  children: ReactNode
}

/** Dialog that closes with Escape, the close button, or a click outside. Focus moves inside on open. */
export function Modal({ title, onClose, children }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    dialogRef.current?.focus()
  }, [])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        className="modal"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="modal-head">
          <h2 id="modal-title">{title}</h2>
          <button type="button" className="btn btn-ghost" onClick={onClose} aria-label="Close">
            ×
          </button>
        </header>
        {children}
      </div>
    </div>
  )
}