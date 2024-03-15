import React from 'react';
import { render, waitFor } from '@testing-library/react';
import DealsCharts from './DealsCharts';
import { useList } from '@refinedev/core';
import { DASHBOARD_DEALS_CHART_QUERY } from '@/graphql/queries';

jest.mock('@refinedev/core', () => ({
  useList: jest.fn(),
}));

describe('DealsCharts Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('fetches deals data correctly', async () => {
    useList.mockReturnValueOnce({ data: { data: [] } });

    render(<DealsCharts />);

    expect(useList).toHaveBeenCalledWith({
      resource: 'dealStages',
      meta: { gqlQuery: DASHBOARD_DEALS_CHART_QUERY },
    });
  });

  it('displays deals chart correctly', async () => {
    const mockDealsData = [
      { timeText: '2024-03-15', value: 50000, state: 'Stage 1' },
      { timeText: '2024-03-16', value: 75000, state: 'Stage 2' },
    ];

    useList.mockReturnValueOnce({ data: { data: mockDealsData } });

    const { getByText } = render(<DealsCharts />);

    await waitFor(() => {
      expect(getByText('Deals')).toBeInTheDocument();
      expect(getByText('$5K')).toBeInTheDocument(); // Check for formatted yAxis label
      expect(getByText('$7.5K')).toBeInTheDocument(); // Check for formatted yAxis label
    });
  });
});
