import React from 'react';
import { render, waitFor } from '@testing-library/react';
import DashBoardLatestActivities from './DashBoardLatestActivities';
import { useList } from '@refinedev/core';
import {
  DASHBOARD_LATEST_ACTIVITIES_AUDITS_QUERY,
  DASHBOARD_LATEST_ACTIVITIES_DEALS_QUERY,
} from '@/graphql/queries';

jest.mock('@refinedev/core', () => ({
  useList: jest.fn(),
}));

describe('DashBoardLatestActivities Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });


  it('fetches audit data correctly', async () => {
    useList.mockReturnValueOnce({ data: { data: [] }, isLoading: false });

    render(<DashBoardLatestActivities />);

    expect(useList).toHaveBeenCalledWith({
      resource: 'audits',
      meta: { gqlQuery: DASHBOARD_LATEST_ACTIVITIES_AUDITS_QUERY },
    });
  });

  it('fetches deals data correctly', async () => {
    useList.mockReturnValueOnce({ data: { data: [] } }).mockReturnValueOnce({ data: { data: [] } });

    render(<DashBoardLatestActivities />);

    expect(useList).toHaveBeenCalledWith({
      resource: 'deals',
      queryOptions: { enabled: false },
      pagination: { mode: 'off' },
      filters: [],
      meta: { gqlQuery: DASHBOARD_LATEST_ACTIVITIES_DEALS_QUERY },
    });
  });

  it('displays loading skeleton when data is loading', async () => {
    useList.mockReturnValueOnce({ data: null, isLoading: true });

    const { getAllByTestId } = render(<DashBoardLatestActivities />);

    await waitFor(() => {
      expect(getAllByTestId('latest-activity-skeleton')).toHaveLength(5);
    });
  });

});
