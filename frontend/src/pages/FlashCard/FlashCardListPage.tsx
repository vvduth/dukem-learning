/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import { useState, useEffect } from 'react'
import flashcardService from '../../services/flashcardService'
import PageHeader from '../../components/common/PageHeader'
import Spiner from '../../components/common/Spiner'
import EmptyState from '../../components/common/EmptyState'
import toast from 'react-hot-toast'
import FlashCardSetCard from '../../components/flashcards/FlashCardSetCard'
import type { FlashCardSet } from '../../types'
import { Factory } from 'lucide-react'
const FlashCardListPage = () => {
  const [flashCardSet, setFlashCardSet] = useState<FlashCardSet[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchFlashCardSets = async () => {
      setLoading(true)
      try {
        const response = await flashcardService.getAllFlashCardSets()
        console.log('FlashCard Sets:', response.data)
        setFlashCardSet(response.data)
      } catch (error) {
        toast.error('Failed to fetch flashcard sets')
        console.error('Error fetching flashcard sets:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchFlashCardSets()
  }, [])

  const renderContent = () => {
    if (loading) {
      return <Spiner />
    }
    if (flashCardSet.length === 0) {
      return <EmptyState title="No flashcard sets available."
      description='You have not generated any flashcard yet.' />
    }
    return (
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        {flashCardSet.map((set) => (
          <FlashCardSetCard key={set._id} flashCardSet={set} />
        ))}
      </div>
    )
  }
  return (
    <div className=''>
      <PageHeader
        title='All FlashCard Sets'
      />
      {renderContent()}
    </div>
  )
}

export default FlashCardListPage