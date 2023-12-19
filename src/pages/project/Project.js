import "./project.css";
import { act } from 'react-dom/test-utils';
import React, { useState, useEffect } from "react";
import { Card, Progress, Button, Input, List, Popover, Typography } from "antd";
import { PlusOutlined, DeleteOutlined, CheckOutlined } from "@ant-design/icons";
import EditSvg from "../../assets/images/edit-pencil 1.svg";
import ContentLoader from '../contentLoader/ContentLoader';
import {
  createProject,
  fetchProjects,
  updateProject,
  deleteProject,
} from "../../services/api";
import { Link, useNavigate, useParams } from "react-router-dom";
const { Title, Text } = Typography;

const Project = () => {
  const { userId } = useParams();
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [projects, setProjects] = useState([]);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [newProject, setNewProject] = useState({
    title: "",
    client: "",
    status: "In Progress",
    members: "",
    progress: 0,
    startDate: "", 
  });
  const [tasks, setTasks] = useState([]);
  const [showInputFields, setShowInputFields] = useState(false);
  const [taskModalVisible, setTaskModalVisible] = useState(false);
  const [taskList, setTaskList] = useState([]);
  const [taskText, setTaskText] = useState("");
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [editingStartDate, setEditingStartDate] = useState(null);
  const [editingMembers, setEditingMembers] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingValues, setEditingValues] = useState({
    title: '',
    startDate: '',
    members: '',
    progress: '',
    status: '',

  });
  


  // for fetching project
  useEffect(() => {
    const fetchProjectData = async () => {
      const projectList = await fetchProjects(userId);
  
      const sortedProjects = projectList.sort((a, b) => b.timestamp - a.timestamp);
      const reversedProjects = sortedProjects.reverse();

      setProjects(reversedProjects);
      setLoading(false);
    };
  
    fetchProjectData();
  
    // Set up an interval to update the current time every second
    const intervalId = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
  
    return () => clearInterval(intervalId);
  }, [userId]);


  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setData();
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timeoutId);

  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProject({ ...newProject, [name]: value });
  };

  const handleTaskInputChange = (e) => {
    setTaskText(e.target.value);
  };

  const handleTaskAdd = () => {
    if (taskText.trim() !== "") {
      setTaskList([...taskList, taskText]);
      setTaskText("");
    }
  };

  const handleTaskDelete = (index) => {
    const updatedTaskList = [...taskList];
    updatedTaskList.splice(index, 1);
    setTaskList(updatedTaskList);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create the new project
      const newProjectId = await createProject({
        ...newProject,
        tasks: taskList,
        userId,
        status: newProject.status,
        progress: newProject.progress,
        timestamp: Date.now(),
      });

      // Fetch updated projects
      const updatedProjectList = await fetchProjects(userId);

      const sortedProjects = updatedProjectList.sort((a, b) => a.timestamp - b.timestamp);

      setProjects(sortedProjects);

      setNewProject({
        title: "",
        startDate: "",
        status: "In Progress",
        members: "",
        progress: 0,
      });
      setTaskList([]);

      setShowInputFields(false);
      setTaskModalVisible(false);
    } catch (error) {
      console.error('Error creating project: ', error);
    }
  };
  const handleDelete = async (projectId) => {
    try {
      const updatedProjects = projects.filter((project) => project.id !== projectId);
      setProjects(updatedProjects);

      await deleteProject(projectId);
    } catch (error) {
      const projectList = await fetchProjects(userId);
      setProjects(projectList);

      console.error('Error deleting project: ', error);
    }
  };

  const handleEdit = (projectId) => {
    const currentProject = projects.find((project) => project.id === projectId);
    setEditingValues({
      // title: currentProject.title,
      startDate: currentProject.startDate,
      members: currentProject.members,
    });
    setEditingProjectId(projectId);
  };

  const handleUpdate = async () => {
    if (editingProjectId !== null) {
      const currentProjectIndex = projects.findIndex((project) => project.id === editingProjectId);
      const currentProject = projects[currentProjectIndex];

      const updatedProject = {
        ...currentProject,
        StartDate: editingStartDate !== null ? editingStartDate : currentProject.StartDate,
        members: editingMembers !== null ? editingMembers : currentProject.members,
  
      };

      // Update the project locally
      const updatedProjects = [...projects];
      updatedProjects[currentProjectIndex] = updatedProject;
      setProjects(updatedProjects);

      // Send the update to the server
      await updateProject(editingProjectId, updatedProject);
      setEditingProjectId(null);
    }
  };


  const toggleInputFields = () => {
    setShowInputFields(!showInputFields);
  };

  const toggleTaskModal = () => {
    setTaskModalVisible(!taskModalVisible);
  };
  const updateProjectInState = (projectId, updatedProject) => {
    const updatedProjects = projects.map((project) =>
      project.id === projectId ? updatedProject : project
    );
    setProjects(updatedProjects);
  };


  // create project input content
  const content = (
    <div>

      <form onSubmit={handleSubmit}>
        <div className="pop-content-container">
          <Title className='pop-title '>Project Title</Title>
          <Input
            name="title"
            required
            value={newProject.title}
            onChange={handleInputChange}
            placeholder="Project Title"
            className='title-input'
          />
        </div>
        <Button className='task-add mt-5' htmlType="submit" >          Create
        </Button>

      </form>


    </div>

  )
                        

  //--------------------------card Render function--------------------------------------
  const cardRender = (project) => {
    const { title, progress, timestamp, taskCount, taskStatus } = project;


    let color = "red";
    if (progress >= 50) {
      color = "yellow";
    }
    if (progress === 100) {
      color = "green";
    }

    const timeElapsedInSeconds = Math.floor((currentTime - project.timestamp) / 1000);
    const hours = Math.floor(timeElapsedInSeconds / 3600);
    const minutes = Math.floor((timeElapsedInSeconds % 3600) / 60);
    const seconds = timeElapsedInSeconds % 60;
    let progressLabel = "In Progress";
    if (progress === 100) {
      progressLabel = "Completed";
    } else if (progress > 0) {
      progressLabel = "In Progress";
    } else {
      progressLabel = "Not Started";
    }
      return (
        <div className="card-render" key={project.id}>
          <Card className='br-0 cdProject'>
            <div className="card-header">
               <Title className="card-title">{title}</Title>
              <div className="icon">
                {editingProjectId === project.id ? (
                  <Button onClick={handleUpdate} className="updatebtn br-0" >
                    <CheckOutlined />
                  </Button>
                ) : (
                  <div className="fn-btn-container">
                    <Button
                      className="fn-btn no-bg br-0"
                      type="text"
                      onClick={() => handleEdit(project.id)}
                    >
                        <img src={EditSvg} alt="edit icon" />

                    </Button>
                    <Button
                      className="fn-btn no-bg br-0"
                      type="text"
                      onClick={() => handleDelete(project.id)}
                    >
                        <DeleteOutlined />
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <hr></hr>
            <div className="Task-area">
              {/* start date */}
              <div className="startDate">
                <p>Start Date</p>
                {editingProjectId === project.id ? (
                  <Input
                    type="date"
                    name="StartDate br-0"
                    value={editingStartDate !== null ? editingStartDate : ""}
                    onChange={(e) => setEditingStartDate(e.target.value)}
                  />
                ) : (
                  <p className="br-0">
                    {localStorage.getItem(`startDate_${project.id}`) ||
                      project.StartDate}
                  </p>
                )}
              </div>
              {/* tasks box */}
              <div className="tasks-box">
                {/* {tasks && tasks.length > 0 && (
                  <div className="task-list" key={project.id}>
                    <List
                      dataSource={project.tasks}
                      renderItem={(task, index) => (
                        <List.Item key={index}>
                          {task}
                          <Button
                            type="text"
                            className="bro-0"
                            onClick={() => handleTaskDelete(index)}
                          >
                            Delete
                          </Button>
                        </List.Item>
                      )}
                    />
                  </div>
                )} */}
                <div className="task-input">
                <Link to={`/dashboard/project/${userId}/${project.id}/tasks/${project.title}`}>
    <Text className="l-task">Tasks</Text>
    <div className="task-count" style={{ color: '#4743e0', marginLeft: '15px' }}>
            <p className="br-0">{taskCount}</p>
          </div>
  </Link>
                 
                </div>
              </div>

            </div>
          
        

            {/* <div className="attribute">
              <p>{taskStatus}</p> */}
               <div className="attribute">
          <p>{progressLabel}</p> 
              {/* {editingProjectId === project.id ? (
                <Input
                  type="number"
                  name="progress"
                  value={newProject.progress}
                  className="br-0"
                  onChange={(e) => {
                    setNewProject({
                      ...newProject,
                      progress: parseInt(e.target.value),
                    });
                  }}
                />
              ) : (
              )} */}
                    {/* // Progress Bar */}
                <div className="progress-bar"> 
          <Progress percent={progress} status="active" strokeColor={color} />
                </div>
            </div>
             {/* <div className="attribute">
            <p></p>
            <p className="br-0">{`${hours}:${minutes}:${seconds}`}</p>
          </div> */}
          </Card>
        </div>
      );
  };

  return (
    <div>
      {loading ? (
        <ContentLoader />
      ) : (
        <div>

          {/*------------------------ Navbar-----------------------------------*/}
          <div className="navbar">
            <div className="new-project">
              <Popover placement="bottom" content={content} trigger="click">
                <Button className="newbtn">
                  <PlusOutlined />
                  New</Button>
              </Popover>
            </div>



          </div>
          {/* ----------------------------card render-------------------------------- */}
          <div className="card">
            {projects.map((project) => (
              <>
                <div key={project.id}>{cardRender(project)}</div>
              </>
            ))}

          </div>

        </div>
      )}
    </div>
  );
};

export default Project;