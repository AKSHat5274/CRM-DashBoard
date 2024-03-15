import React from 'react';
import { render, waitFor } from '@testing-library/react';
import UpcomingEvents from './UpcomingEvents';
import { useList } from '@refinedev/core';
import { DASHBORAD_CALENDAR_UPCOMING_EVENTS_QUERY } from '@/graphql/queries';
import dayjs from 'dayjs';

jest.mock('@refinedev/core', () => ({
  useList: jest.fn(),
}));

describe('UpcomingEvents Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<UpcomingEvents />);
  });

  it('fetches upcoming events data correctly', async () => {
    useList.mockReturnValueOnce({ data: { data: [] }, isLoading: false });

    render(<UpcomingEvents />);

    expect(useList).toHaveBeenCalledWith({
      resource: 'events',
      pagination: { pageSize: 5 },
      sorters: [{ field: 'startDate', order: 'asc' }],
      filters: [{ field: 'startDate', operator: 'gte', value: dayjs().format('YYYY-MM-DD') }],
      meta: { gqlQuery: DASHBORAD_CALENDAR_UPCOMING_EVENTS_QUERY },
    });
  });

  it('displays loading skeleton when data is loading', async () => {
    useList.mockReturnValueOnce({ data: null, isLoading: true });

    const { getAllByTestId } = render(<UpcomingEvents />);

    await waitFor(() => {
      expect(getAllByTestId('upcoming-event-skeleton')).toHaveLength(5);
    });
  });

  it('displays upcoming events correctly', async () => {
    const mockEventData = [
      { id: 1, title: 'Event 1', startDate: '2024-03-15', endDate: '2024-03-16', color: 'green' },
      { id: 2, title: 'Event 2', startDate: '2024-03-16', endDate: '2024-03-17', color: 'blue' },
    ];

    useList.mockReturnValueOnce({ data: { data: mockEventData }, isLoading: false });

    const { getByText } = render(<UpcomingEvents />);

    await waitFor(() => {
      expect(getByText('Event 1')).toBeInTheDocument();
      expect(getByText('Event 2')).toBeInTheDocument();
    });
  });

  it('displays "No Upcoming Events" when no events are available', async () => {
    useList.mockReturnValueOnce({ data: { data: [] }, isLoading: false });

    const { getByText } = render(<UpcomingEvents />);

    await waitFor(() => {
      expect(getByText('No Upcoming Events')).toBeInTheDocument();
    });
  });
});
