import {
    changeTicketStatus,
    updateTicket as updateTicketRequest,
    createTicket as createTicketRequest,
    deleteTicket as deleteTicketRequest
} from "../api/ticketApi";

import useTicketStore from "../../../store/ticketStore";


export default function useTicketActions(addToast) {

    const addOptimisticTicket =
        useTicketStore(
            x => x.addOptimisticTicket
        );


    const replaceTicket =
        useTicketStore(
            x => x.replaceTicket
        );


    const removeOptimisticTicket =
        useTicketStore(
            x => x.removeOptimisticTicket
        );


    const moveTicket = async (
        ticketId,
        newStatus
    ) => {

        try {

            await changeTicketStatus(
                ticketId,
                newStatus
            );


            addToast(
                "Статус тикета изменён",
                "success"
            );


        } catch (error) {

            console.error(error);


            addToast(
                error.message,
                "error"
            );

        }

    };


    const updateTicket = async (
        ticket,
        formData
    ) => {

        try {

            await updateTicketRequest(
                ticket.id,
                {
                    executorId:
                        formData.executorId,

                    description:
                        formData.description,

                    deadline:
                        formData.deadline,

                    status:
                        formData.status,

                    version:
                        ticket.version
                }
            );


            addToast(
                `Тикет #${ticket.number} обновлён`,
                "success"
            );


        } catch (error) {

            console.error(error);


            addToast(
                error.message,
                "error"
            );

        }

    };


    const createTicket = async (
        formData
    ) => {

        const tempId = crypto.randomUUID();


        const optimisticTicket = {

            id: tempId,

            number: "создание...",


            author: {
                id: formData.authorId,
                firstName: "",
                lastName: "Загрузка...",
                patronymic: ""
            },


            executor: formData.executorId
                ? {
                    id: formData.executorId,
                    firstName: "",
                    lastName: "Загрузка...",
                    patronymic: ""
                }
                : null,


            description:
                formData.description,


            deadline:
                formData.deadline,


            status: 1,


            allowedTransitions: [],


            pending: true
        };


        try {

            addOptimisticTicket(
                optimisticTicket
            );


            const createdTicket = await createTicketRequest({
                authorId: formData.authorId,
                executorId: formData.executorId,
                description: formData.description,
                deadline: formData.deadline,
                clientRequestId: tempId
            });


            replaceTicket(
                tempId,
                createdTicket
            );

            addToast(
                "Тикет создан",
                "success"
            );


        } catch (error) {

            console.error(error);


            removeOptimisticTicket(
                tempId
            );


            addToast(
                error.message,
                "error"
            );
        }
    };


    const deleteTicket = async (
        ticketId
    ) => {

        try {

            await deleteTicketRequest(
                ticketId
            );


            addToast(
                "Тикет удалён",
                "success"
            );


        } catch (error) {


            console.error(error);


            addToast(
                error.message,
                "error"
            );

        }

    };


    return {
        moveTicket,
        updateTicket,
        createTicket,
        deleteTicket
    };

}