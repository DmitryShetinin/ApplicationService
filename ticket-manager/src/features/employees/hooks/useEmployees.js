import {useEffect,useState,useCallback} from "react";
import {getEmployees} from "../api/employeeApi.js";

export default function useEmployees(){

    const [employees,setEmployees]=useState([]);

    const loadEmployees=useCallback(async()=>{

        const data=await getEmployees();
        console.log(data)
        setEmployees(data);

    },[]);


    useEffect(()=>{

        loadEmployees();

    },[loadEmployees]);


    return {
        employees,
        loadEmployees
    };
}