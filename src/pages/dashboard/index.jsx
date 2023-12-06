import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchProjects, fetchTasksForProject } from "../../services/api";
import { Card, Row, Col, Button, Empty, List, Badge, Pagination } from "antd";
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
  const [taskStatusData, setTaskStatusData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 3;
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const itemsToShow = generateContent(start, end);
  const totalprojects = projects.length;
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  function generateContent(start, end) {
    const content = projects.slice(start, end);
    return content;
  }
  useEffect(() => {
    async function fetchData() {
      const projectList = await fetchProjects(userId);

      for (const project of projectList) {
        const tasks = await fetchTasksForProject(project.id);
        project.tasks = tasks;
      }

      const sortedProjects = projectList.sort((a, b) =>
        a.title.localeCompare(b.title)
      );

      setProjects(sortedProjects);
      setLoading(false);

      const statusData = countTaskStatuses(sortedProjects);
      setTaskStatusData(statusData);
    }

    fetchData();
  }, [userId]);

  ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement);

  const getTaskCountForStatus = (tasks, status) => {
    return tasks.filter((task) => task.status === status).length;
  };
  const countTaskStatuses = (projects) => {
    const statusCount = {
      "To-Do": 0,
      "In Progress": 0,
      Completed: 0,
      Review: 0,
      Cancelled: 0,
      Testing: 0
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
      "To-Do",
      "In Progress",
      "Completed",
      "Review",
      "Cancelled",
      "Testing"
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
          "#f06e3f"
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#90EE90",
          "#F7464A",
          "#f06e3f"
        ]
      }
    ]
  };

  useEffect(() => {
    setTimeout(() => {
      setData();
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <div className="d_section">
      {loading ? (
        <ContentLoader />
      ) : (
        <>
          <div className="row-1">
            <Card
              title="Tasks Overview"
              style={{
                height: "400px",
                width: "100%"
              }}
            >
              <Bar
                data={chartData}
                className="t_bar"
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
            <Card title="Task Status Distribution">
              <Pie data={pieChartData} options={pieChartOptions} />
            </Card>
            <Card
              title="Colors Info"
              style={{
                height: "280px"
              }}
            >
              {statusColors.map((status) => (
                <div
                  key={status.color}
                  style={{
                    display: "flex",
                    gap: "10px",
                    margin: "10px 0"
                  }}
                >
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      backgroundColor: status.color
                    }}
                  ></div>
                  <span className="fnt">{status.name}</span>
                </div>
              ))}
            </Card>
          </div>
          <div className="d-proj-container">
            {itemsToShow.map((project) => (
              <Card
                title={project.title.toUpperCase()}
                className="p-Cards-dashboard"
                extra={
                  <Link
                    to={`/dashboard/project/${userId}/${project.id}/tasks/${project.title}`}
                    style={{
                      color: "#4743e0"
                    }}
                    className="fnt f18"
                  >
                    Add Task
                  </Link>
                }
              >
                <div className="project-card-content">
                  <h3 className="fnt f22 fw-400">Tasks Overview:</h3>
                  {project.tasks.length > 0 ? (
                    <div className="task-status-section">
                      {statusColors.map((status) => (
                        <div key={status.color} className="st_flex">
                          <Badge
                            status={getStatusColor(status.name)}
                            text={status.name}
                          />
                          <span className="status-count f18 fnt">
                            {getTaskCountForStatus(project.tasks, status.name)}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Empty description="No tasks available" />
                  )}
                </div>
              </Card>
            ))}
          </div>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            className="project_pagination"
            total={totalprojects}
            onChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

const statusColors = [
  { name: "Todo", color: "#FF6384" },
  { name: "In Progress", color: "#36A2EB" },
  { name: "Completed", color: "#FFCE56" },
  { name: "Review", color: "#90EE90" },
  { name: "Testing", color: "#f06e3f" }
];

export default Dashboard;
