import React, { useState, useEffect } from 'react';
import { Card } from 'antd';

import dotSvg from '../assets/images/Ellipse 12.svg';
import {
  createProject,
  fetchProjects,
  updateProject,
  deleteProject,
} from '../services/api';

const Project = () => {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({
    title: '',
    status: '',
    start_Date: '',
    members: '',
    progress: '',
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
      status: '',
      start_Date: '',
      members: '',
      progress: '',
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

  const cardInfo = [
    { title: "Dashboard", status: "Active", start_Date: "20-09-2023", members: "Anum, Amna, Moiz", progress: "60%" },
    { title: "Sidebar", status: "Completed", start_Date: "19-09-2023", members: "Amna", progress: "100%" },
    { title: "Navbar", status: "Active", start_Date: "25-09-2023", members: "Anum", progress: "10%" },
    { title: "Report page", status: "Inactive", start_Date: "27-09-2023", members: "Anum", progress: "0%" },
    { title: "Module Page", status: "Inactive", start_Date: "28-08-2023", members: "Anum", progress: "0%" },
  ];

  const cardRender = (card, index) => {
    return (
      <div className="card-render" key={index}>
        <Card>
          <div className="card-header">
            <h1>{card.title}</h1>
            <div className="icon">
              {/* Add your icon content here */}
            </div>
          </div>
          <div className="status">
            <span> <img src={dotSvg} alt="Dot" /> </span>
            <p>{card.status}</p>
          </div>
          <div className="startDate">
            <p>Start Date</p>
            <span>{card.start_Date}</span>
          </div>
          <div className="avatars">
            <p>Members</p>
            <span>{card.members}</span>
          </div>
          <div className="progress">
            <p>Progress</p>
            <span>{card.progress} </span>
          </div>
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
        <input
          type="text"
          name="status"
          value={newProject.status}
          onChange={handleInputChange}
          placeholder="Status"
        />
        <input
          type="text"
          name="start_Date"
          value={newProject.start_Date}
          onChange={handleInputChange}
          placeholder="Start Date"
        />
        <input
          type="text"
          name="members"
          value={newProject.members}
          onChange={handleInputChange}
          placeholder="Members"
        />
        <input
          type="text"
          name="progress"
          value={newProject.progress}
          onChange={handleInputChange}
          placeholder="Progress"
        />
        <button type="submit">Create Project</button>
      </form>

      {projects.map((project) => (
        <div key={project.id}>
          <p>Title: {project.title}</p>
          <p>Status: {project.status}</p>
          <p>Start Date: {project.start_Date}</p>
          <p>Members: {project.members}</p>
          <p>Progress: {project.progress}</p>
          <button onClick={() => handleEdit(project.id)}>Edit</button>
          <button onClick={() => handleDelete(project.id)}>Delete</button>
        </div>
      ))}

      {editingProject && (
        <div>
          <h2>Edit Project</h2>
          <input
            type="text"
            name="title"
            value={editingProject.title}
            onChange={(e) => {
              setEditingProject({ ...editingProject, title: e.target.value });
            }}
          />
          <input
            type="text"
            name="status"
            value={editingProject.status}
            onChange={(e) => {
              setEditingProject({ ...editingProject, status: e.target.value });
            }}
          />
          <input
            type="text"
            name="start_Date"
            value={editingProject.start_Date}
            onChange={(e) => {
              setEditingProject({ ...editingProject, start_Date: e.target.value });
            }}
          />
          <input
            type="text"
            name="members"
            value={editingProject.members}
            onChange={(e) => {
              setEditingProject({ ...editingProject, members: e.target.value });
            }}
          />
          <input
            type="text"
            name="progress"
            value={editingProject.progress}
            onChange={(e) => {
              setEditingProject({ ...editingProject, progress: e.target.value });
            }}
          />
          <button onClick={handleUpdate}>Update</button>
        </div>
      )}

      <div className='card'>{cardInfo.map(cardRender)}</div>
    </div>
  );
};

export default Project;
