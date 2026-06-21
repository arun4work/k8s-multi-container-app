import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import Fib from './Fib';

// 1. Setup MSW to mock the actual API endpoints
const server = setupServer(
  http.get('*/api/indices/all', () => {
    return HttpResponse.json([1, 2, 3]);
  }),
  http.get('*/api/indices/values', () => {
    return HttpResponse.json({ '1': '1', '2': '1' });
  }),
  http.post('*/api/indices', () => {
    return new HttpResponse(null, { status: 200 });
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Fib Component (Vitest + MSW)', () => {
  let queryClient: QueryClient;
  beforeEach(() => {
    // Create a fresh client for every test to avoid cache pollution
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          gcTime: 0, // Ensure no old data hangs around
        },
      },
    });
  });
  it('displays indices and values from the API', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Fib />
      </QueryClientProvider>,
    );

    // MSW returns data, Vitest waits for it
    const indexList = await screen.findByText(/1, 2, 3/i);
    expect(indexList).toBeInTheDocument();
    expect(
      await screen.findByText(/For index 1, I calculated 1/i),
    ).toBeInTheDocument();
  });

  it('submits a new index and clears input', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Fib />
      </QueryClientProvider>,
    );

    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /submit/i });

    fireEvent.change(input, { target: { value: '5' } });
    fireEvent.click(button);

    // Verify the input clears after the "API call" succeeds
    await waitFor(() => expect(input).toHaveValue(''));
  });
});
