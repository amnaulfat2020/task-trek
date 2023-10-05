import React, { createContext, useContext, useState } from 'react';

const ButtonContext= createContext();

export const useButton = () => useContext(ButtonContext);

export const ButtonProvider= (props) =>{
    const [newProject, setNewProject] = useState({
        title: "",
        client: "",
        status: "In Progress",
        members: "",
        progress: 0,
      });


    const setButton = (proj) =>{
        setNewProject(proj);
    }
    return(
        <ButtonContext.Provider value={{ newProject, setButton }}>
            {props.children}

        </ButtonContext.Provider>

    );

}