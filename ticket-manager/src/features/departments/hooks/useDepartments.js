import {useEffect,useState} from "react";
import {getDepartments} from "../api/departmentApi";


export default function useDepartments(){

    const [departments,setDepartments]=useState([]);


    useEffect(()=>{

        async function load(){

            const data=
                await getDepartments();

            setDepartments(data);
        }


        load();

    },[]);


    return {
        departments
    };
}