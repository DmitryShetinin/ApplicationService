import { useEffect } from "react";
import { HubConnectionBuilder } from "@microsoft/signalr";

import useTicketStore from "../../../store/ticketStore.js";
import useNotificationStore from "../../../store/notificationStore.js";


const URL = "http://localhost:5353/hubs/tickets";


export default function useTicketHub() {

    const addTicket =
        useTicketStore(
            state => state.addTicket
        );


    const updateTicket =
        useTicketStore(
            state => state.updateTicket
        );


    const replaceTicket =
        useTicketStore(
            state => state.replaceTicket
        );


    const removeTicket =
        useTicketStore(
            state => state.removeTicket
        );


    const addNotification =
        useNotificationStore(
            state => state.addNotification
        );



    useEffect(() => {


        const connection =
            new HubConnectionBuilder()
                .withUrl(URL)
                .withAutomaticReconnect()
                .build();



        // =========================
        // UPDATE
        // =========================

        connection.on(
            "TicketUpdated",
            (ticket) => {

                


                updateTicket(ticket);

            }
        );



        // =========================
        // CREATE
        // =========================

        connection.on(
            "TicketCreated",
            (ticket) => {

               

                if (
                    ticket.clientRequestId
                ) {

                    replaceTicket(
                        ticket.clientRequestId,
                        ticket
                    );

                } 
                else {

                    addTicket(ticket);

                }

            }
        );



        // =========================
        // DELETE
        // =========================

        connection.on(
            "TicketDeleted",
            (ticketId) => {

               


                removeTicket(ticketId);

            }
        );



        // =========================
        // NOTIFICATIONS
        // =========================

        connection.on(
            "NotificationReceived",
            (notification) => {

               


                addNotification(
                    notification
                );

            }
        );



        // =========================
        // START
        // =========================

        connection.start()
            .then(() => {

              

            })
            .catch(error => {

                console.error(
                    "SignalR connection error",
                    error
                );

            });



        return () => {

            connection.stop();

        };


    }, [
        addTicket,
        updateTicket,
        replaceTicket,
        removeTicket,
        addNotification
    ]);

}