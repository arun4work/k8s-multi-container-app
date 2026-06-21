import {
  queryOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { api } from './config';

export const valueQueries = {
  healthCheck: () =>
    queryOptions({
      queryKey: ['indices', 'hi'],
      queryFn: () => api.getHealthCheck().then((res) => res.data),
    }),
  allIndices: () =>
    queryOptions({
      queryKey: ['indices', 'all'],
      queryFn: () => api.getAllIndices().then((res) => res.data),
    }),
  availableIndexvalues: () =>
    queryOptions({
      queryKey: ['indices', 'allIndexValues'],
      queryFn: () => api.getAvailableIndexValues().then((res) => res.data),
    }),
};

export const useCalculateValue = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (enteredIndex: string) => {
      console.log('enteredIndex: ', enteredIndex);
      const { data } = await api.calculateIndexValue({ index: enteredIndex });
      return data;
    },
    onSuccess: () => {
      // Refresh the list after a successful post
      queryClient.invalidateQueries({ queryKey: ['indices'] });
    },
  });
};
