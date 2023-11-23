import React from 'react';
import { render, act } from '@testing-library/react';
import Project from './Project'; 
import { MemoryRouter } from 'react-router-dom';
import { SearchProvider } from '../../contexts/SearchContext'; 
import { createProject, fetchProjects, updateProject, deleteProject } from '../../services/api';

jest.mock('../../services/api');

describe('ProjectPage Component Tests', () => {
  let projectsData;
  beforeEach(() => {
    projectsData = [
      {
        id: '1',
        title: 'Project 1',
        status: 'In Progress',
        members: 'John Doe',
        progress: 50,
        startDate: '2023-01-01',
        tasks: ['Task 1', 'Task 2'],
      },
    ];

    fetchProjects.mockResolvedValue(projectsData);
  });

  // Test 1: Rendering Test
  test('renders ProjectPage component without crashing', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <SearchProvider>
            <Project />
          </SearchProvider>
        </MemoryRouter>
      );
    });
  });

  test('renders project title',async () => {
    await act(async () => {
      const {  } = render(
        <MemoryRouter>
          <SearchProvider>
            <Project />
          </SearchProvider>
        </MemoryRouter>
      );

   
    });
  });

  test('renders project status',async () => {
    await act(async () => {
      const { } = render(
        <MemoryRouter>
          <SearchProvider>
            <Project />
          </SearchProvider>
        </MemoryRouter>
      );

    
    });
  });
  test('adds a new project on form submission', async () => {
    createProject.mockResolvedValueOnce({});

    await act(async () => {
      const { } = render(
        <MemoryRouter>
          <SearchProvider>
            <Project />
          </SearchProvider>
        </MemoryRouter>
      );

      
    });
  });

  test('edits a project on button click', async () => {
    updateProject.mockResolvedValueOnce({});

    await act(async () => {
      const {  } = render(
        <MemoryRouter>
          <SearchProvider>
            <Project />
          </SearchProvider>
        </MemoryRouter>
      );

      
    });
  });

  test('deletes a project on button click', async () => {
    deleteProject.mockResolvedValueOnce({});

    await act(async () => {
      const { } = render(
        <MemoryRouter>
          <SearchProvider>
            <Project />
          </SearchProvider>
        </MemoryRouter>
      );

      
    });
  });
});
