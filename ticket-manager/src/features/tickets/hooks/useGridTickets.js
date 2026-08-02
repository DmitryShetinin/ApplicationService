import { useEffect, useState, useCallback } from "react";
import { getTickets } from "../api/ticketApi";

export default function useGridTickets() {
    const [tickets, setTickets] = useState([]);

    const [pageInfo, setPageInfo] = useState({
        page: 1,
        pageSize: 12,
        totalPages: 1,
        totalCount: 0
    });

    const [filters, setFilters] = useState({
        status: "",
        executorId: "",
        departmentId: "",
        onlyOverdue: false
    });

    const loadTickets = useCallback(async () => {
        const result = await getTickets({
            ...filters,
            page: pageInfo.page,
            pageSize: pageInfo.pageSize
        });

        setTickets(result.items);

        setPageInfo(prev => ({
            ...prev,
            page: result.page,
            pageSize: result.pageSize,
            totalPages: result.totalPages,
            totalCount: result.totalCount
        }));

    }, [filters, pageInfo.page, pageInfo.pageSize]);

    useEffect(() => {
        loadTickets();
    }, [loadTickets]);

    return {
        tickets,
        pageInfo,
        setPageInfo,
        filters,
        setFilters,
        loadTickets
    };
}