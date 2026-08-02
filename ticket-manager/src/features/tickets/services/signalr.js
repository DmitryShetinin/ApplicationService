import {useEffect} from "react";
import {HubConnectionBuilder} from "@microsoft/signalr";

const URL = "http://localhost:5353/hubs/tickets";

export default function useTicketHub(onUpdate){

useEffect(()=>{

const connection=new HubConnectionBuilder()
.withUrl(URL)
.withAutomaticReconnect()
.build();

connection.on("TicketUpdated",onUpdate);

connection.start();

return()=>{
connection.stop();
};

},[onUpdate]);

}