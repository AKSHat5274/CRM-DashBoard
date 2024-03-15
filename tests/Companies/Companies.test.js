import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { useTable } from '@refinedev/antd';
import { useGo } from '@refinedev/core';
import { COMPANIES_LIST_QUERY } from '@/graphql/queries';
import { CompanyPage } from './CompanyPage';

jest.mock('@refinedev/antd', () => ({
  useTable: jest.fn(),
}));

jest.mock('@refinedev/core', () => ({
  useGo: jest.fn(),
}));

describe('CompanyPage Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('fetches companies data correctly', () => {
    useTable.mockReturnValueOnce({
      tableProps: {
        dataSource: [],
        columns: [],
        pagination: {},
      },
      filters: {},
    });

    render(<CompanyPage />);

    expect(useTable).toHaveBeenCalledWith({
      resource: 'companies',
      onSearch: expect.any(Function),
      sorters: {
        initial: [
          {
            field: 'createdAt',
            order: 'desc',
          },
        ],
      },
      filters: {
        initial: [
          {
            field: 'name',
            operator: 'contains',
            value: undefined,
          },
        ],
      },
      pagination: {
        pageSize: 12,
      },
      meta: {
        gqlQuery: COMPANIES_LIST_QUERY,
      },
    });
  });

  it('executes search correctly', async () => {
    const mockedGo = jest.fn();
    useGo.mockReturnValue(mockedGo);

    useTable.mockReturnValueOnce({
      tableProps: {
        dataSource: [],
        columns: [],
        pagination: {},
      },
      filters: {},
    });

    const { getByPlaceholderText } = render(<CompanyPage />);

    const searchInput = getByPlaceholderText('Search Company');
    fireEvent.change(searchInput, { target: { value: 'Test Company' } });
    fireEvent.keyPress(searchInput, { key: 'Enter', code: 13, charCode: 13 });

    await waitFor(() => {
      expect(mockedGo).toHaveBeenCalled();
    });
  });

});
