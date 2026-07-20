import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import {
  createAnecdote,
  getAnecdotes,
  updateAnecdote,
} from '../requests'

export const useAnecdotes = () => {
  const queryClient = useQueryClient()
  const anecdotesQuery = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: false,
    refetchOnWindowFocus: false,
  })

  const createMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (created) => {
      const anecdotes = queryClient.getQueryData(['anecdotes']) || []
      queryClient.setQueryData(
        ['anecdotes'],
        anecdotes.concat(created),
      )
    },
  })

  const voteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: (updated) => {
      const anecdotes = queryClient.getQueryData(['anecdotes']) || []
      queryClient.setQueryData(
        ['anecdotes'],
        anecdotes.map((anecdote) =>
          anecdote.id === updated.id ? updated : anecdote,
        ),
      )
    },
  })

  return {
    anecdotes: anecdotesQuery.data || [],
    isError: anecdotesQuery.isError,
    isPending: anecdotesQuery.isPending,
    createAnecdote: createMutation.mutateAsync,
    voteAnecdote: voteMutation.mutateAsync,
  }
}
