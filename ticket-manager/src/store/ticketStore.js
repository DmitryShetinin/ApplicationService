import { create } from "zustand";

const useTicketStore = create((set) => ({

    columns: {
        1: {
            items: [],
            page: 1,
            totalPages: 1,
            loading: false
        },
        2: {
            items: [],
            page: 1,
            totalPages: 1,
            loading: false
        },
        3: {
            items: [],
            page: 1,
            totalPages: 1,
            loading: false
        }
    },

    gridTickets: [],


    setKanban: (data) =>
        set({
            columns: {
                1: {
                    items: data.new.items,
                    page: data.new.page,
                    totalPages: data.new.totalPages,
                    loading: false
                },
                2: {
                    items: data.inProgress.items,
                    page: data.inProgress.page,
                    totalPages: data.inProgress.totalPages,
                    loading: false
                },
                3: {
                    items: data.completed.items,
                    page: data.completed.page,
                    totalPages: data.completed.totalPages,
                    loading: false
                }
            }
        }),


    appendTickets: (
        status,
        items,
        page,
        totalPages
    ) =>
        set(state => ({
            columns: {
                ...state.columns,

                [status]: {
                    ...state.columns[status],

                    items: [
                        ...state.columns[status].items,
                        ...items
                    ],

                    page,
                    totalPages,
                    loading: false
                }
            }
        })),


    setGridTickets: (tickets) =>
        set({
            gridTickets: tickets
        }),


    // обычный тикет от SignalR
    addTicket: (ticket) =>
        set(state => ({

            columns: {

                ...state.columns,

                [ticket.status]: {

                    ...state.columns[ticket.status],

                    items: [
                        ticket,
                        ...state.columns[ticket.status].items
                    ]

                }

            },

            gridTickets: [
                ticket,
                ...state.gridTickets
            ]

        })),


        

    // временный тикет сразу после клика CREATE
    addOptimisticTicket: (ticket) =>
        set(state => ({

            columns: {

                ...state.columns,

                [ticket.status]: {

                    ...state.columns[ticket.status],

                    items: [
                        ticket,
                        ...state.columns[ticket.status].items
                    ]

                }

            },

            gridTickets: [
                ticket,
                ...state.gridTickets
            ]

        })),


        
    // заменяем временный тикет настоящим
     replaceTicket: (
    tempId,
    ticket
) =>
set(state => {

    const columns = {};

    Object.keys(state.columns)
        .forEach(status => {

            columns[status] = {
                ...state.columns[status],

                items:
                    state.columns[status]
                    .items
                    .filter(x => x.id !== tempId)
            };

        });


    columns[ticket.status].items.unshift(ticket);


    return {
        columns,

        gridTickets:
            state.gridTickets
            .map(x =>
                x.id === tempId
                    ? ticket
                    : x
            )
    };

}),


    updateTicket: (ticket) =>
        set(state => {

            const columns = {};

            Object.keys(state.columns)
                .forEach(status => {

                    columns[status] = {

                        ...state.columns[status],

                        items:
                            state.columns[status]
                                .items
                                .filter(
                                    x => x.id !== ticket.id
                                )

                    };

                });


            columns[ticket.status].items.unshift(ticket);


            return {

                columns,

                gridTickets:
                    state.gridTickets.map(
                        x =>
                            x.id === ticket.id
                                ? ticket
                                : x
                    )

            };

        }),

        

    removeTicket: (id) =>
        set(state => {

            const columns = {};

            Object.keys(state.columns)
                .forEach(status => {

                    columns[status] = {

                        ...state.columns[status],

                        items:
                            state.columns[status]
                                .items
                                .filter(
                                    x => x.id !== id
                                )

                    };

                });


            return {

                columns,

                gridTickets:
                    state.gridTickets.filter(
                        x => x.id !== id
                    )

            };

        }),


    removeOptimisticTicket: (id) =>
        set(state => ({

            columns: Object.fromEntries(
                Object.entries(state.columns)
                    .map(([status, column]) => [
                        status,
                        {
                            ...column,
                            items:
                                column.items.filter(
                                    x => x.id !== id
                                )
                        }
                    ])
            ),

            gridTickets:
                state.gridTickets.filter(
                    x => x.id !== id
                )

        }))

}));

export default useTicketStore;