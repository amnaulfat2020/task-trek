import React, { useState, useEffect, useRef } from 'react';
import { Card, Input, Button, Modal, Menu, Popover, Alert, FloatButton, Typography } from 'antd';
import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons';
import { useMenuContext } from '../../contexts/SearchContext';
import './taskPage.css';
import ContentLoader from '../contentLoader/ContentLoader';
import redDotSvg from '../../assets/images/Ellipse red.svg';
import greenDotSvg from '../../assets/images/Ellipse 12.svg';
import yellowDotSvg from '../../assets/images/Ellipse yellow.svg';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  query,
  addDoc,
} from 'firebase/firestore';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../../utils/constants/Firebase';
import dbNames from '../../utils/constants/db';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
const { Title, Text } = Typography;

const statusColumns = {
  'Todo': { title: 'Todo', image: redDotSvg },
  'InProgress': { title: 'In Progress', image: yellowDotSvg },
  'Review': { title: 'Review', image: yellowDotSvg },
  'Testing': { title: 'Testing', image: yellowDotSvg },
  'Completed': { title: 'Completed', image: greenDotSvg },
};

const TaskPage = () => {
  const navigate = useNavigate()
  const { projectId } = useParams()
  const { userId } = useParams()
  const [tasks, setTasks] = useState([]);

  const docId = useRef();

  const [newTask, setNewTask] = useState({
    title: '',
    assigned: '',
    status: 'Todo',
  });

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editedTask, setEditedTask] = useState({});
  const [editedTaskIndex, setEditedTaskIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  const fetchTasks = async () => {
    const tasksList = [];
    try {
      const querySnapshot = await getDocs(
        query(collection(db, dbNames.getTaskCollection(projectId)))
      );
      querySnapshot.forEach((doc) => {
        tasksList.push({ id: doc.id, ...doc.data() });
      });
    } catch (error) {
      console.error('Error fetching tasks: ', error);
    }

    return tasksList;
  };
  useEffect(() => {
    setTimeout(() => {
      setData();
      setLoading(false);
    }, 2000);
  }, []);

  useEffect(() => {
    const fetchTasksData = async () => {
      let taskList = await fetchTasks(projectId);
      taskList = taskList.sort(orderBy(["order"],["asc"]));
      console.table(taskList);
      setTasks(taskList);
      setLoading(false);
    };

    fetchTasksData();
  }, [projectId]);

  const q = collection(db, dbNames.projectCollection);
  const [docs, error] = useCollectionData(q);

  async function handleAddTask() {
    if (newTask.title.trim() !== '') {
      const collectionName = dbNames.getTaskCollection(projectId);
      const taskRef = collection(db, collectionName);
      const docsSet = await getDocs(taskRef);
      const newTaskData = {
        title: newTask.title,
        projectId: projectId,
        status: newTask.status,
        order: docsSet.size+1
      };

      try {
        const docRef = await addDoc(taskRef, newTaskData);
        const addedTask = { id: docRef.id, ...newTaskData };

        setTasks([...tasks, addedTask]);

        setNewTask({
          title: '',
          status: 'Todo',
        });
      } catch (error) {
        console.error('Error adding task to Firestore:', error);
      }
    }
  }


  const deleteTask = async (taskId) => {
    try {
      const collectionName = dbNames.getTaskCollection(projectId);
      const taskRef = doc(db, collectionName, taskId);
      await deleteDoc(taskRef);

      const updatedTasks = tasks.filter((task) => task.id !== taskId);
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleDeleteTask = (taskId) => {
    deleteTask(taskId);
  };

  const openEditModal = (task, index) => {
    setEditedTask(task);
    setEditedTaskIndex(index);
    setEditModalVisible(true);
  };

  const handleUpdateTask = async () => {
    if (editedTaskIndex !== null) {
      const updatedTasks = [...tasks];
      updatedTasks[editedTaskIndex] = editedTask;
      setTasks(updatedTasks);

      try {
        const collectionName = dbNames.getTaskCollection(projectId);
        const taskRef = doc(db, collectionName, editedTask.id);
        await setDoc(taskRef, editedTask);
      } catch (error) {
        console.error('Error updating task:', error);
      }

      setEditModalVisible(false);
      setEditedTask({});
      setEditedTaskIndex(null);
    }
  };

  const content = (
    <div className='pop-content-container'>
      <Title className='pop-title'>Tasks</Title>
      <Input
        ref={docId}
        type="text"
        className='title-input'
        placeholder="Task Title"
        value={newTask.title}
        onChange={(e) => {
          setNewTask({ ...newTask, title: e.target.value });
        }}
      />
      
      <Button className='task-add' onClick={handleAddTask}>Add Task</Button>

    </div>
  );

  const statusImg = {
    'Todo': redDotSvg,
    'InProgress': yellowDotSvg,
    'Review': yellowDotSvg,
    'Testing': greenDotSvg,
    'Completed': yellowDotSvg,
  };

  // const handleStatusFilterChange = (key) => {
  //   setMenuFilter(key);
  // };

  // const { menuFilter, setMenuFilter } = useMenuContext();

  const onDragEnd = async (result) => {
    if (!result.destination) {
      return;
    }

    const sourceStatus = result.source.droppableId;
    const destinationStatus = result.destination.droppableId;
    const taskId = result.draggableId;

    if (sourceStatus !== destinationStatus) {


      const taskToMove = tasks.find((task) => task.id === taskId);

      taskToMove.status =  destinationStatus;
       const updateData = {status: destinationStatus};
      if (result.destination.index != result.source.index){
        updateData['order']=  result.destination.index;
        reorder({status: destinationStatus});
      }
      saveTask(updateData,taskId);
     
    } else {
      
 
      if (result.destination.index != result.source.index){
       
        reorder();
        console.log({ id: taskId, order: result.destination.index })
        saveTask({  order: result.destination.index },taskId);
      }
      
    }
    function reorder(fields){
      let prev = tasks.find(t=> t.order === result.destination.index),
            next = tasks.find(t=> t.order === result.source.index);
            if(prev){
              prev.order = result.source.index;
            }
           
           if(next){
            next.order = result.destination.index;
            next = {...next , fields};
           }
           
       
          const  reordered = tasks.sort(orderBy(["order"],["asc"]));
            setTasks(reordered);
      
    }
      async function saveTask (taskData, id)   { 
      try {
        const collectionName = dbNames.getTaskCollection(projectId);
        const taskRef = doc(db, collectionName, id);
        delete taskData.id;
        setDoc(taskRef,taskData,{merge:true});
      } catch (error) {
        console.error('Error updating task in Firestore:', error);
      }
     } 
  };

  function sortBy( key, cb ) {
    if ( !cb ) cb = () => 0;
    return ( a, b ) => ( a[key] > b[key] ) ? 1 :
        ( ( b[key] > a[key] ) ? -1 : cb( a, b ) );
}

function sortByDesc( key, cb ) {
    if ( !cb ) cb = () => 0;
    return ( b, a ) => ( a[key] > b[key] ) ? 1 :
        ( ( b[key] > a[key] ) ? -1 : cb( b, a ) );
}

function orderBy( keys, orders ) {
    let cb = () => 0;
    keys.reverse();
    orders.reverse();
    for ( const [i, key] of keys.entries() ) {
        const order = orders[i];
        if ( order == 'asc' )
            cb = sortBy( key, cb );
        else if ( order == 'desc' )
            cb = sortByDesc( key, cb );
        else
            throw new Error( `Unsupported order "${order}"` );
    }
    return cb;
}

  return (
    <div>
      {loading ? (
        <ContentLoader />
      ) : (
        <div>
          <div className="navbar">
            <div className="new-project">
              <Popover placement="bottom" content={content}>
                <Button className="newbtn">
                  <PlusOutlined />
                  New
                </Button>
              </Popover>
            </div>


          </div>


          {/* Kanban Board */}
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="kanban-board">
              {Object.keys(statusColumns).map((status) => (
                <Droppable droppableId={status} key={status}>
                  {(provided, snapshot) => (
                    <div
                      className={`kanban-column ${status.toLowerCase()}`}
                      ref={provided.innerRef}
                    >
                      <Title className='card-status'>{status}</Title>
                      { tasks
                        .filter((task) => task.status === status)
                        .map((task, index) => (
                          <Draggable
                            key={task.id}
                            draggableId={task.id}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <Card
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`task-card ${status.toLowerCase()}`}
                              >
                                <Title className='card-title'>{task.title}</Title>
                                <div className="task-status-container">
                                  <img src={statusImg[task.status]} alt="dot" />
                                  <Text className='task-status'>{task.status}</Text>
                                </div>
                                <Button className='task-del-btn' onClick={() => handleDeleteTask(task.id)}>Delete</Button>
                              </Card>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
          </DragDropContext>
          
          {loading && <Alert className="alert-message" message=" Loading..." type="success" />}
        </div>
      )}
      <FloatButton
        shape="circle"
        type="primary"
        icon={<ArrowLeftOutlined />}
        onClick={() => {
          navigate(`/dashboard/project/${userId}`)
        }}
        style={{
          right: 50,
        }}
      />

    </div>
  );
};

export default TaskPage;
