import React, { useState, useEffect } from 'react';
import { Card, Progress } from 'antd'; 
import { EditOutlined } from '@ant-design/icons';
import {createProject, fetchProjects, updateProject, deleteProject,} from '../services/api';

const Project = () => {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({
    title: '',
    client: '',
    status: 'In Progress', 
    members: '',
    progress: 0, 
  });
  const [editingProject, setEditingProject] = useState(null);

  useEffect(() => {
    async function fetchProjectData() {
      const projectList = await fetchProjects();
      setProjects(projectList);
    }
    fetchProjectData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProject({ ...newProject, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createProject(newProject);
    setNewProject({
      title: '',
      client: '',
      status: 'In Progress', 
      members: '',
      progress: 0, 
    });
    const updatedProjectList = await fetchProjects();
    setProjects(updatedProjectList);
  };

  const handleDelete = async (projectId) => {
    await deleteProject(projectId);
    const updatedProjectList = await fetchProjects();
    setProjects(updatedProjectList);
  };

  const handleEdit = (projectId) => {
    const projectToEdit = projects.find((project) => project.id === projectId);
    setEditingProject(projectToEdit);
  };

  const handleUpdate = async () => {
    if (editingProject) {
      await updateProject(editingProject.id, editingProject);
      setEditingProject(null);
      const updatedProjectList = await fetchProjects();
      setProjects(updatedProjectList);
    }
  };

  const cardRender = (project) => {
    const { title, client, status, members, progress } = editingProject || project;

    let color = 'red'; 
    if (progress >= 50) {
      color = 'light';
    }
    if (progress === 100) {
      color = 'green';
    }

    return (
      <div className="card-render" key={project.id}>
        <Card>
          <div className="card-header">
            <h1>{title}</h1>
            <div className="icon">
            <EditOutlined />
            </div>
          </div>
          <div className="attribute">
            <p>Client</p>
            <input
              type="text"
              name="client"
              value={client}
              onChange={(e) => {
                if (editingProject) {
                  setEditingProject({ ...editingProject, client: e.target.value });
                }
              }}
            />
          </div>
          <div className="attribute">
            <p>Status</p>
            {editingProject ? (
              <select
                name="status"
                value={status}
                onChange={(e) => {
                  setEditingProject({ ...editingProject, status: e.target.value });
                }}
              >
                {/* Options for status */}
                <option value="In Progress">In Progress</option>
                <option value="Discussing">Discussing</option>
                <option value="Completed">Completed</option>
                <option value="Review">Review</option>
                <option value="Cancelled">Cancelled</option>
                <option value="On Hold">On Hold</option>
              </select>
            ) : (
              <p>{status}</p>
            )}
          </div>
          <div className="attribute">
            <p>Members</p>
            <input
              type="text"
              name="members"
              value={members}
              onChange={(e) => {
                if (editingProject) {
                  setEditingProject({ ...editingProject, members: e.target.value });
                }
              }}
            />
          </div>
          <div className="attribute">
            <p>Progress</p>
            {editingProject ? (
              <input
                type="number"
                name="progress"
                value={progress}
                onChange={(e) => {
                  setEditingProject({ ...editingProject, progress: parseInt(e.target.value) });
                }}
              />
            ) : (
              <div className="progress-bar">
                <Progress percent={progress} strokeColor={color} />
              </div>
            )}
          </div>
          {editingProject ? (
            <button onClick={handleUpdate}>Update</button>
          ) : (
            <div>
              <button onClick={() => handleEdit(project.id)}>Edit</button>
              <button onClick={() => handleDelete(project.id)}>Delete</button>
            </div>
          )}
        </Card>
      </div>
    );
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          value={newProject.title}
          onChange={handleInputChange}
          placeholder="Project Title"
        />
        <button type="submit">Create Project</button>
      </form>

      <div className="card">{projects.map((project) => cardRender(project))}</div>
    </div>
  );
};

export default Project;