import { useCallback, useEffect, useState } from "react";
import { getKanbanTickets, getTickets } from "../api/ticketApi";
import useTicketStore from "../../../store/ticketStore";


const PAGE_SIZE = 20;


export default function useKanbanTickets() {

    const [initialized, setInitialized] = useState(false);


    const columns = useTicketStore(
        x => x.columns
    );


    const setKanban = useTicketStore(
        x => x.setKanban
    );


    const appendTickets = useTicketStore(
        x => x.appendTickets
    );



    const reload = useCallback(async () => {
        console.trace("KANBAN RELOAD");

        setInitialized(false);


        try {

            const result =
                await getKanbanTickets();


            setKanban(result);


        }
        finally {

            setInitialized(true);

        }


    }, [
        setKanban
    ]);




    const loadMore = useCallback(
        async (status) => {

            const column = columns[status];

            console.log(
                "LOAD MORE",
                status,
                column
            );


            if (!column)
                return;


            const nextPage = column.page + 1;


            console.log(
                "NEXT PAGE",
                nextPage
            );


            if (
                column.loading ||
                nextPage > column.totalPages
            ) {
                console.log(
                    "BLOCKED",
                    {
                        loading: column.loading,
                        nextPage,
                        totalPages: column.totalPages
                    }
                );

                return;
            }


            const result = await getTickets({
                status,
                page: nextPage,
                pageSize: PAGE_SIZE
            });


            console.log(
                "SERVER RESULT",
                result
            );


            appendTickets(
                status,
                result.items,
                result.page,
                result.totalPages
            );

        },
        [
            columns,
            appendTickets
        ]
    );



    useEffect(() => {

        reload();

    }, [
        reload
    ]);



    return {
        columns,
        reload,
        loadMore,
        initialized
    };

}