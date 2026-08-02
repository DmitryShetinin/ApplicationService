import { useCallback, useEffect, useState } from "react";
import { getKanbanTickets, getTickets } from "../api/ticketApi";

const PAGE_SIZE = 20;

const createColumn = () => ({
    items: [],
    page: 1,
    totalPages: 999999,
    loading: false
});

export default function useKanbanTickets() {

    const [initialized, setInitialized] = useState(false);

    const [columns, setColumns] = useState({
        1: createColumn(),
        2: createColumn(),
        3: createColumn()
    });

    const reload = useCallback(async () => {

        setInitialized(false);

        const result = await getKanbanTickets();


        setColumns({
            1: {
                items: result.new.items,
                page: result.new.page,
                totalPages: result.new.totalPages,
                loading: false
            },
            2: {
                items: result.inProgress.items,
                page: result.inProgress.page,
                totalPages: result.inProgress.totalPages,
                loading: false
            },
            3: {
                items: result.completed.items,
                page: result.completed.page,
                totalPages: result.completed.totalPages,
                loading: false
            }
        });

        setInitialized(true);

    }, []);

    const loadMore = useCallback(async (status) => {

        const column = columns[status];

        if (column.loading)
            return;

        const nextPage = column.page + 1;

        const result = await getTickets({
            status,
            page: nextPage,
            pageSize: PAGE_SIZE
        });

        if (result.items.length === 0)
            return;

        setColumns(prev => ({

            ...prev,

            [status]: {

                ...prev[status],

                items: [
                    ...prev[status].items,
                    ...result.items
                ],

                page: result.page,

                totalPages: result.totalPages,

                loading: false

            }

        }));

    }, [columns]);

    useEffect(() => {
        reload();
    }, [reload]);

    return {
        columns,
        reload,
        loadMore,
        initialized
    };

}