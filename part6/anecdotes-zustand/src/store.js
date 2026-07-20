import { create } from 'zustand'

import * as anecdoteService from './services/anecdotes'

export const useAnecdoteStore = create((set, get) => ({
  anecdotes: [],
  filter: '',
  actions: {
    initialize: async () => {
      const anecdotes = await anecdoteService.getAll()
      set({ anecdotes })
    },
    create: async (content) => {
      const anecdote = await anecdoteService.create(content)
      set((state) => ({
        anecdotes: state.anecdotes.concat(anecdote),
      }))
      return anecdote
    },
    vote: async (id) => {
      const current = get().anecdotes.find(
        (anecdote) => anecdote.id === id,
      )
      const updated = await anecdoteService.update({
        ...current,
        votes: current.votes + 1,
      })
      set((state) => ({
        anecdotes: state.anecdotes.map((anecdote) =>
          anecdote.id === id ? updated : anecdote,
        ),
      }))
      return updated
    },
    remove: async (id) => {
      await anecdoteService.remove(id)
      set((state) => ({
        anecdotes: state.anecdotes.filter(
          (anecdote) => anecdote.id !== id,
        ),
      }))
    },
    setFilter: (filter) => set({ filter }),
  },
}))

export const useAnecdotes = () =>
  useAnecdoteStore((state) => state.anecdotes)
export const useFilter = () =>
  useAnecdoteStore((state) => state.filter)
export const useAnecdoteActions = () =>
  useAnecdoteStore((state) => state.actions)
