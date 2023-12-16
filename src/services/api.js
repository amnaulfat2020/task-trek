import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from 'firebase/firestore'; 
import { db } from '../utils/constants/Firebase';

// ----------------------Project API---------------------------------------

export const createProject = async (projectData, userId) => {
  try {
    // Set the timestamp property to the current timestamp
    const timestamp = new Date().getTime();
    const projectWithTimestamp = { ...projectData, timestamp };

    // Add the project to your Firestore collection
    const docRef = await addDoc(collection(db, 'projects', ), projectWithTimestamp)
    console.log('Project added with ID: ', docRef.id);
    const projectId = docRef.id;

    // Creating subcollection called "tasks"
    const tasksCollectionRef = collection(db, 'projects', projectId, 'tasks');

    // Adding tasks to subcollection
    for (const task of projectData.tasks) {
      task['projectId'] = projectId;
      await addDoc(tasksCollectionRef, task);
    }

    return projectId; // Return the ID of the newly created project
    // Get the task count and update the project data
    const taskSnapshot = await getDocs(tasksCollectionRef);
    const taskCount = taskSnapshot.size;
    const completedTasks = taskSnapshot.docs.filter((doc) => doc.data().status === 'Completed');
    const completedTaskCount = completedTasks.length;

    // Update the project with the task count
    await updateDoc(doc(db, 'projects', projectId), { 
      taskCount,
      taskStatus: completedTaskCount === taskCount ? 'Completed' : 'In Progress', 
    });

  } catch (error) {
    console.error('Error adding project: ', error);
    throw error;
  }
};
export const fetchTasksForProject = async (projectId) => {
  const tasksCollectionRef = collection(db, "projects", projectId, "tasks");
  const taskSnapshot = await getDocs(tasksCollectionRef);
  const tasks = [];
  taskSnapshot.forEach((doc) => {
    tasks.push(doc.data());
  });
  return tasks;
};




export const fetchProjects = async (userId) => {
  const projectList = [];
  try {
    const querySnapshot = await getDocs(
      query(collection(db, 'projects'), where('userId', '==', userId))
    );
    querySnapshot.forEach(async (doc) => {
      const projectData = { id: doc.id, ...doc.data() };

      // Fetch task count for each project
      const tasksCollectionRef = collection(db, 'projects', doc.id, 'tasks');
      const taskSnapshot = await getDocs(tasksCollectionRef);

      // Ensure tasks is an array or set it to an empty array
      projectData.tasks = taskSnapshot.docs.map(doc => doc.data());
      
      projectData.taskCount = taskSnapshot.size;
      projectData.completedTaskCount = taskSnapshot.docs.filter((doc) => doc.data().status === 'Completed').length;
      projectData.taskStatus = projectData.completedTaskCount === projectData.taskCount ? "Completed" : "In progress";

       // Calculate progress based on completed tasks
       projectData.progress = projectData.taskCount === 0 ? 0 : Math.floor((projectData.completedTaskCount / projectData.taskCount) * 100);
      
      projectList.push(projectData);
    });
  } catch (error) {
    console.error('Error fetching projects: ', error);
  }
  return projectList;
};
export const updateProject = async (projectId, newData) => {
  const projectRef = doc(db, 'projects', projectId);
  try {
    await updateDoc(projectRef, newData);
    console.log('Project updated successfully', projectId);
  } catch (error) {
    console.error('Error updating project: ', error);
  }
};

export const deleteProject = async (projectId) => {
  const projectRef = doc(db, 'projects', projectId);
  try {
    await deleteDoc(projectRef);
    console.log('Project deleted successfully');
  } catch (error) {
    console.error('Error deleting project: ', error);
  }
};



// --------------------Taskpage ApI-------------------------

