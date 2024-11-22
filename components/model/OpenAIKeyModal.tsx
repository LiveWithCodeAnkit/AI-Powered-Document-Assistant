'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useOpenAIKey } from '@/provider/OpenAIKeyProvider'

interface OpenAIKeyModalProps {
  isOpen: boolean
  onClose: () => void
}

export function OpenAIKeyModal({ isOpen, onClose }: OpenAIKeyModalProps) {
  const [key, setKey] = useState<string>('')
  const { setApiKey } = useOpenAIKey()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setApiKey(key)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>OpenAI API Key</DialogTitle>
          <DialogDescription>
            Please provide your OpenAI API key to proceed with document upload and processing.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Input
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="sk-..."
            className="mt-4"
          />
          <DialogFooter className="mt-4">
            <Button type="submit">Submit</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}