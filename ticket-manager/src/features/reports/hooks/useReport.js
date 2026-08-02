import {useCallback,useEffect,useState} from "react";
import {getReport} from "../api/reportApi";

export default function useReport(){

    const [report,setReport]=useState(null);
    const [loading,setLoading]=useState(true);

    const loadReport=useCallback(async()=>{

        setLoading(true);

        try{

            const result=await getReport();

            setReport(result);

        }
        finally{

            setLoading(false);

        }

    },[]);

    useEffect(()=>{
        loadReport();
    },[loadReport]);

    return{
        report,
        loading,
        reload:loadReport
    };

}