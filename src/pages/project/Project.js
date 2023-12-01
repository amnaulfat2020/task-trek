import "./project.css";
// import headerStyles from '../../styles/headerStyles';
import { act } from 'react-dom/test-utils';
import React, { useState, useEffect } from "react";
import { Card, Progress, Button, Input, List, Popover, Typography } from "antd";
import { PlusOutlined, DeleteOutlined, CheckOutlined } from "@ant-design/icons";
import EditSvg from "../../assets/images/edit-pencil 1.svg";
// import redDotSvg from "../../assets/images/Ellipse red.svg";
// import greenDotSvg from "../../assets/images/Ellipse 12.svg";
// import yellowDotSvg from "../../assets/images/Ellipse yellow.svg";
// import Line3 from "../../assets/images/Line 3.png";
import ContentLoader from '../contentLoader/ContentLoader';
import {
  createProject,
  fetchProjects,
  updateProject,
  deleteProject,
  fetchTasksForProject,
} from "../../services/api";
import { doc, setDoc } from 'firebase/firestore';
import { Link, useNavigate, useParams } from "react-router-dom";
import { db } from '../../utils/constants/Firebase';
const { Title, Text } = Typography;

const Project = () => {
  const { userId } = useParams();
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [projects, setProjects] = useState([]);
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
  // const [editingTitle, setEditingTitle] = useState('');
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
      await act(async () => {
        const projectList = await fetchProjects(userId);
        setProjects(projectList);
      });
    };
  
    fetchProjectData();
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
    await createProject({ ...newProject, tasks: taskList });
    setNewProject({
      title: "",
      StartDate: "",
      status: "In Progress",
      members: "",
      progress: 0,
    });
    setTaskList([]);
    const updatedProjectList = await fetchProjects();
    setProjects(updatedProjectList);
    setShowInputFields(true);
    setTaskModalVisible(false);
    try {
      // Include status and progress properties when creating a new project
      await createProject({ ...newProject, tasks: taskList, userId, status: newProject.status, progress: newProject.progress });
      setNewProject({
        title: '',
        client: '',
        status: 'In Progress',
        members: '',
        progress: 0,
      });
      setTaskList([]);
      const updatedProjectList = await fetchProjects(userId);
      setProjects(updatedProjectList);
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
      // Roll back the state if there's an error
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
        // title: editingTitle !== null ? editingTitle : currentProject.title,
        StartDate: editingStartDate !== null ? editingStartDate : currentProject.StartDate,
        members: editingMembers !== null ? editingMembers : currentProject.members,
        // status: newProject.status,
        // progress: newProject.progress,
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
    const { title, status, members, progress } = project;

    // let statusImg = redDotSvg;
    // let statusColor = "red";
    // if (status === "Completed") {
    //   statusImg = greenDotSvg;
    //   statusColor = "green";
    // } else if (status === "On Hold" || status === "Review") {
    //   statusImg = yellowDotSvg;
    //   statusColor = "yellow";
    // }

    let color = "red";
    if (progress >= 50) {
      color = "yellow";
    }
    if (progress === 100) {
      color = "green";
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
                {tasks && tasks.length > 0 && (
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
                )}
                <div className="task-input">
                  <Link to={`/dashboard/project/${userId}/${project.id}/tasks`}>
                    <Text className="l-task">Tasks</Text>
                  </Link>
                 
                </div>
              </div>

            </div>


            {/* <div className="attribute">
              <p>Progress</p>
              {editingProjectId === project.id ? (
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
                <div className="progress-bar">
                  <Progress percent={progress} strokeColor={color} />
                </div>
              )}
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

