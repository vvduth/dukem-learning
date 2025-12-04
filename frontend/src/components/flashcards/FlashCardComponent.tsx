/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react'
import type { FlashCardSet, FlashCardItem } from '../../types'

const FlashCardComponent = ({
    flashCard, 
    onToggleStar,
}: {
    flashCard: FlashCardItem,
    onToggleStar: (cardId: string) => void,
}) => {
    const [isFlipped, setIsFlipped] = useState(false)
    const handleFlip = () => {
    setIsFlipped(!isFlipped)
    }
  return (
    <div>FlashCard</div>
  )
}

export default FlashCardComponent