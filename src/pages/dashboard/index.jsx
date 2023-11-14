import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchProjects, fetchTasksForProject } from "../../services/api";
import { Card, Row, Col, Button, Empty, List, Badge } from "antd";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement } from "chart.js";
import "./dashboard.css";
import ContentLoader from '../contentLoader/ContentLoader';

const getStatusColor = (status) => {
  switch (status) {
    case "To-Do":
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
  const [projects, setProjects] = useState([]);
  // const [loading, setLoading] = useState(true);
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
      "To-Do": 0,
      "In Progress": 0,
      "Completed": 0,
      "Review": 0,
      "Cancelled": 0,
      "On Hold": 0,
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

  const pieChartData = {
    labels: [
      "To-Do",
      "In Progress",
      "Completed",
      "Review",
      "Cancelled",
      "On Hold",
    ],
    datasets: [
      {
        data: taskStatusData,
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#45aaf2",
          "#F7464A",
          "#D4AF37",
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#45aaf2",
          "#F7464A",
          "#D4AF37",
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
      <h2>Your Activities...</h2>
    {loading ? (
      <ContentLoader /> 
    ) : (
        <Row gutter={20}>
          <Col span={16}>
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
          <Col span={8}>
            <Card title="Task Status Distribution">
              <Pie data={pieChartData} />
            </Card>
          </Col>
          {projects.map((project) => (
            <Col span={8} key={project.id}>
              <Card
                title={project.title}
                extra={<Link to={`/${project.id}/tasks`}>Add Tasks</Link>}
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
};

const TaskList = ({ tasks }) => {
  return (
    <List
      itemLayout="horizontal"
      dataSource={tasks}
      renderItem={(task) => (
        <List.Item>
          <List.Item.Meta
            title={
              <div>
                {task.title}
                <TaskStatusBadge status={task.status} />
              </div>
            }
            description={task.description}
          />
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

export default Dashboard;
