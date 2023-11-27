import React, { useState, useEffect } from "react";
import { Routes, Route } from 'react-router-dom';

import { Link, useParams } from "react-router-dom";
import { fetchProjects, fetchTasksForProject } from "../../services/api";
import { Card, Row, Col, Button, Empty, List, Badge } from "antd";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement
} from "chart.js";
import "./dashboard.css";
import ContentLoader from "../contentLoader/ContentLoader";

const getStatusColor = (status) => {
  switch (status) {
    case "Todo":
      return "default";
    case "In Progress":
      return "processing";
    case "Completed":
      return "success";
    default:
      return "default";
  }
};

const Dashboard = () => {
  const { userId } = useParams();
  const { projectId } = useParams();

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

      setProjects(projectList);
      setLoading(false);

      const statusData = countTaskStatuses(projectList);
      setTaskStatusData(statusData);
    }

    fetchData();
  }, [userId]);

  ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement);

  const countTaskStatuses = (projects) => {
    const statusCount = {
      Todo: 0,
      "In Progress": 0,
<<<<<<< HEAD
      Completed: 0,
      Review: 0,
      Cancelled: 0,
      "On Hold": 0
=======
      "Completed": 0,
      "Review": 0,
      // "Cancelled": 0,
      "Testing": 0,
>>>>>>> a3d0d55beb59a07e434e1b15044cf763e43a7e8c
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
        borderWidth: 1
      }
    ]
  };

  const pieChartOptions = {
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const clickedStatus = pieChartData.labels[elements[0].index];
        console.log(`User clicked on: ${clickedStatus}`);
      }
    }
  };

  const pieChartData = {
    labels: [
      "Todo",
      "In Progress",
      "Completed",
      "Review",
<<<<<<< HEAD
      "Cancelled",
      "On Hold"
=======
      // "Cancelled",
      "Testing",
>>>>>>> a3d0d55beb59a07e434e1b15044cf763e43a7e8c
    ],
    datasets: [
      {
        data: taskStatusData,
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#90EE90",
<<<<<<< HEAD
          "#F7464A",
          "#808080"
=======
          // "#F7464A",
          "#808080",
>>>>>>> a3d0d55beb59a07e434e1b15044cf763e43a7e8c
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#90EE90",
<<<<<<< HEAD
          "#F7464A",
          "#808080"
        ]
      }
    ]
=======
          // "#F7464A",
          "#808080",
        ],
      },
    ],
>>>>>>> a3d0d55beb59a07e434e1b15044cf763e43a7e8c
  };

  useEffect(() => {
    setTimeout(() => {
      setData();
      setLoading(false);
    }, 2000);
  }, []);

  return (
<<<<<<< HEAD
    <div>
      <h2>Your Activities...</h2>
      {loading ? (
        <ContentLoader />
      ) : (
        <Row gutter={20}>
          <Col span={14}>
            <Card title="Tasks Overview">
              <Bar
                data={chartData}
                options={{
                  scales: {
                    x: {
                      type: "category"
                    },
                    y: {
                      beginAtZero: true
                    }
                  }
                }}
              />
            </Card>
          </Col>
          <Col span={7}>
            <Card title="Task Status Distribution">
              <Pie data={pieChartData} options={pieChartOptions} />
            </Card>
          </Col>
          <Col span={3}>
            <Card title="Colors Info">
              {statusColors.map((status) => (
                <div
                  key={status.color}
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      backgroundColor: status.color
                    }}
                  ></div>
                  <span>{status.name}</span>
                </div>
              ))}
            </Card>
          </Col>
          {projects.map((project) => (
            <Col span={8} key={project.id}>
              <Card
                title={project.title}
                extra={
                  <Link to={`/dashboard/project/${userId}/${projectId}/tasks`}>
                    Add Tasks
                  </Link>
                }
              >
                <div>
                  <h3>Tasks:</h3>
                  {project.tasks.length > 0 ? (
                    <TaskList tasks={project.tasks} />
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
=======
  <div>
    {loading ? (
      <ContentLoader />
    ) : (
      <Row gutter={20}>
        <Col span={14}>
          <Card title="Tasks Overview">
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
          <Card title="Task Status Distribution">
            <Pie data={pieChartData} options={pieChartOptions} />
          </Card>
        </Col>
        <Col span={3}>
          <Card title="Colors Info">
            {statusColors.map((status) => (
              <div key={status.color} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
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
      extra={<Link to={`/dashboard/project/${userId}/${project.id}/tasks`}>Add Tasks</Link>}
    >
      <div>
        <h3>Tasks:</h3>
        {project.tasks.length > 0 ? (
          <TaskList tasks={project.tasks} />
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
>>>>>>> a3d0d55beb59a07e434e1b15044cf763e43a7e8c
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
  return <div>{/* Add buttons or components for task actions here */}</div>;
};

const statusColors = [
  { name: "Todo", color: "#FF6384" },
  { name: "In Progress", color: "#36A2EB" },
  { name: "Completed", color: "#FFCE56" },
<<<<<<< HEAD
  { name: "Review", color: "#90EE90" },
  { name: "Cancelled", color: "#F7464A" },
  { name: "On Hold", color: "#808080" }
=======
  {name:"Review",color:"#90EE90"},
  {name:"Testing",color:"#808080"},
>>>>>>> a3d0d55beb59a07e434e1b15044cf763e43a7e8c
];

export default Dashboard;
