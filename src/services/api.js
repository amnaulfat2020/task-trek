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

export const createProject = async (projectData) => {
  try {
    const docRef = await addDoc(collection(db, 'projects'), projectData);
    console.log('Project added with ID: ', docRef.id);
    return docRef.id; 
  } catch (error) {
    console.error('Error adding project: ', error);
    throw error; 
  }
};

export const fetchProjects = async (userId) => {
  const projectList = [];
  try {
    const querySnapshot = await getDocs(
      query(collection(db, 'projects'), where('userId', '==', userId))
    );
    querySnapshot.forEach((doc) => {
      projectList.push({ id: doc.id, ...doc.data() });
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
    console.log('Project updated successfully');
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
