import { HubConnectionBuilder } from "@microsoft/signalr";
import { useEffect, useState } from "react";


const [connection, setConnection] = useState(null);


useEffect(() => {

    const newConnection =
        new HubConnectionBuilder()
            .withUrl(
                "http://localhost:5353/hubs/tickets"
            )
            .withAutomaticReconnect()
            .build();


    setConnection(newConnection);



    return () => {

        newConnection.stop();

    };


}, []);




useEffect(() => {

    if(connection){

        connection
            .start()
            .then(() => {

                console.log(
                    "SignalR connected"
                );

            })
            .catch(err => {

                console.error(
                    err
                );

            });

    }


}, [connection]);