import React, { useState, useEffect } from "react";
import { Routes, Route } from 'react-router-dom';

import { Link, useParams } from "react-router-dom";
import { fetchProjects, fetchTasksForProject } from "../../services/api";
import { Card, Row, Col, Button, Empty, List, Badge } from "antd";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement } from "chart.js";
import "./dashboard.css";
import ContentLoader from '../contentLoader/ContentLoader';

const getStatusColor = (status) => {
  switch (status) {
    case "Todo":
      return "default";
    case "InProgress":
      return "processing";
    case "Completed":
      return "success";
    default:
      return "default";
  }
};

const Dashboard = () => {
  const { userId } = useParams();
  const [projects, setProjects] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [taskStatusData, setTaskStatusData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const projectList = await fetchProjects(userId);
  
      for (const project of projectList) {
        const tasks = await fetchTasksForProject(project.id);
        project.tasks = tasks;
      }
  
      const sortedProjects = projectList.sort((a, b) => a.title.localeCompare(b.title));
  
      setProjects(sortedProjects);
      setLoading(false);
  
      const statusData = countTaskStatuses(sortedProjects);
      setTaskStatusData(statusData);
    }
  
    fetchData();
  }, [userId]);

  ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement);

  const getTaskCountForStatus = (tasks, status) => {
    return tasks.filter(task => task.status === status).length;
  };
  const countTaskStatuses = (projects) => {
    const statusCount = {
      "Todo": 0,
      "InProgress": 0,
      "Completed": 0,
      "Review": 0,
      "Cancelled": 0,
      "Testing": 0,
    };

    projects.forEach((project) => {
      project.tasks.forEach((task) => {
        if (task.status in statusCount) {
          statusCount[task.status]++;
        }
      });
    });

    return Object.values(statusCount);
  };

  const chartData = {
    labels: projects.map((project) => project.title),
    datasets: [
      {
        label: "Number of Tasks",
        data: projects.map((project) => project.tasks.length),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const pieChartOptions = {
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const clickedStatus = pieChartData.labels[elements[0].index];
        console.log(`User clicked on: ${clickedStatus}`);
      }
    },
  };

  const pieChartData = {
    labels: [
      "Todo",
      "InProgress",
      "Completed",
      "Review",
      "Cancelled",
      "Testing",
    ],
    datasets: [
      {
        data: taskStatusData,
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#90EE90",
          "#F7464A",
          "#f06e3f",
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#90EE90",
          "#F7464A",
          "#f06e3f",
        ],
      },
    ],
  };

  useEffect(() => {
    setTimeout(() => {
      setData();
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <div>
      {loading ? (
        <ContentLoader />
      ) : (
        <Row gutter={20}>
          <Col span={14}>
            <Card title="Tasks Overview" style={{ height: "450px", width: "100%",fontFamily: 'Montserrat' }}>
              <Bar
                data={chartData}
                options={{
                  scales: {
                    x: {
                      type: "category",
                    },
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </Card>
          </Col>
          <Col span={7}>
            <Card title="Task Status Distribution" style={{ height: "450px", width: "100%", fontFamily: 'Montserrat' }}>
              <Pie data={pieChartData} options={pieChartOptions} />
            </Card>
          </Col>
          <Col span={3}>
            <Card title="Colors Info" style={{ height: "450px", width: "100%",fontFamily: 'Montserrat' }}>
              {statusColors.map((status) => (
                <div key={status.color} style={{ display: "flex", alignItems: "center", gap: "8px", height: "60px"  }}>
                  <div style={{ width: "20px", height: "20px", backgroundColor: status.color }}></div>
                  <span>{status.name}</span>
                </div>
              ))}
            </Card>
          </Col>
          {projects.map((project) => (
  <Col span={8} key={project.id}>
    <Card
      title={project.title.toUpperCase()}
      extra={
        <Link to={`/dashboard/project/${userId}/${project.id}/tasks`} style={{ color: '#4743e0', fontFamily: 'Montserrat' }}>
          Add Task
        </Link>
      }
      style={{ height: "300px", width: "100%" }}
    >
      <div className="project-card-content">
        <h3>Tasks Overview:</h3>
        {project.tasks.length > 0 ? (
          <div className="task-status-section">
            {statusColors.map((status) => (
              <div key={status.color} style={{ display: "flex", alignItems: "center", gap: "8px", height: "30px" }}>
                <Badge status={getStatusColor(status.name)} text={status.name} className="task-status-badge" />
                <span className="status-count">{getTaskCountForStatus(project.tasks, status.name)}</span>
              </div>
            ))}
          </div>
        ) : (
          <Empty description="No tasks available" />
        )}
      </div>
    </Card>
  </Col>
))}
        </Row>
      )}
    </div>
  );
};

// const TaskList = ({ tasks }) => {
//   return (
//     <List
//       itemLayout="horizontal"
//       dataSource={tasks}
//       renderItem={(task) => (
//         <List.Item>
//           <List.Item.Meta
//             title={
//               <div>
//                 <span className="task-title">
//                   {task.title.charAt(0).toUpperCase() + task.title.slice(1)}
//                 </span>
//                 <TaskStatusBadge status={task.status} />
//               </div>
//             }
//             description={task.description}
//           />
//           <TaskActions task={task} />
//         </List.Item>
//       )}
//     />
//   );
// };
const TaskList = ({ tasks }) => {
  return (
    <List
      itemLayout="horizontal"
      dataSource={tasks}
      renderItem={(task) => (
        <List.Item className="task-list-item">
          <List.Item.Meta
            title={
              <div className="task-title">
            
                {task.title.charAt(0).toUpperCase() + task.title.slice(1)}
              </div>
            }
            description={task.description}
          />
          <TaskStatusBadge status={task.status} />
          <TaskActions task={task} />
        </List.Item>
      )}
    />
  );
};
const TaskStatusBadge = ({ status }) => {
  return <Badge status={getStatusColor(status)} text={status} />;
};

const TaskActions = ({ task }) => {
  return (
    <div>
      {/* Add buttons or components for task actions here */}
    </div>
  );
};

const statusColors = [
  { name: "Todo", color: "#FF6384" },
  { name: "InProgress", color: "#36A2EB" },
  { name: "Completed", color: "#FFCE56" },
  {name:"Review",color:"#90EE90"},
  // {name:"Cancelled",color:"#F7464A"},
  {name:"Testing",color:"#f06e3f"},
];

export default Dashboard;