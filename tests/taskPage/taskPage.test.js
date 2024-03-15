import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { useList, useUpdate } from '@refinedev/core';
import { useNavigation } from '@refinedev/core';
import { TASKS_QUERY, TASK_STAGES_QUERY } from '@/graphql/queries';
import { UPDATE_TASK_STAGE_MUTATION } from '@/graphql/mutations';
import TaskList from './TaskList';

jest.mock('@refinedev/core', () => ({
  useList: jest.fn(),
  useUpdate: jest.fn(),
  useNavigation: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

describe('TaskList Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });


  it('renders task list correctly', async () => {
    const mockTaskStages = {
      unassignedStages: [],
      columns: [
        { id: '1', title: 'TODO', tasks: [{ id: '1', title: 'Task 1' }] },
      ],
    };

    useList.mockReturnValueOnce({ data: mockTaskStages, isLoading: false });
    useList.mockReturnValueOnce({ data: mockTaskStages, isLoading: false });

    const { getByText } = render(<TaskList />);

    await waitFor(() => {
      expect(getByText('Task 1')).toBeInTheDocument();
    });
  });

  it('executes task update correctly on drag end', async () => {
    const mockTaskStages = {
      unassignedStages: [],
      columns: [
        { id: '1', title: 'TODO', tasks: [{ id: '1', title: 'Task 1' }] },
      ],
    };

    useList.mockReturnValueOnce({ data: mockTaskStages, isLoading: false });
    useList.mockReturnValueOnce({ data: mockTaskStages, isLoading: false });

    const mockUpdateTask = jest.fn();
    useUpdate.mockReturnValueOnce({ mutate: mockUpdateTask });

    const { getByText, getByTestId } = render(<TaskList />);

    fireEvent.dragEnd(getByText('Task 1'), { over: { id: '2' } });

    await waitFor(() => {
      expect(mockUpdateTask).toHaveBeenCalledWith({
        resource: 'tasks',
        id: '1',
        values: { stageId: '2' },
        successNotification: false,
        mutationMode: 'optimistic',
        meta: { gqlMutation: UPDATE_TASK_STAGE_MUTATION },
      });
    });
  });

  it('executes task add correctly when adding card', () => {
    const mockReplace = jest.fn();
    useNavigation.mockReturnValueOnce({ replace: mockReplace });

    const mockTaskStages = {
      unassignedStages: [],
      columns: [
        { id: '1', title: 'TODO', tasks: [{ id: '1', title: 'Task 1' }] },
      ],
    };

    useList.mockReturnValueOnce({ data: mockTaskStages, isLoading: false });
    useList.mockReturnValueOnce({ data: mockTaskStages, isLoading: false });

    const { getByText } = render(<TaskList />);

    fireEvent.click(getByText('Add Card'));

    expect(mockReplace).toHaveBeenCalledWith('/tasks/new?stageId=unassigned');
  });

});
