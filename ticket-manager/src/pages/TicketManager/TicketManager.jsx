    import { useMemo, useState } from "react";

    import Header from "../../shared/components/Header.jsx";
    import Modal from "../../shared/components/Modal.jsx";
    import Board from "../../features/tickets/components/Board.jsx";
    import TicketFilters from "../../features/tickets/components/TicketFilters.jsx";
    import Pagination from "../../features/tickets/components/Pagination.jsx";
    import EmployeesTable from "../../features/employees/components/EmployeesTable.jsx";

    import useGridTickets from "../../features/tickets/hooks/useGridTickets.js";
    import useKanbanTickets from "../../features/tickets/hooks/useKanbanTickets.js";

    import useEmployees from "../../features/employees/hooks/useEmployees.js";
    import useDepartments from "../../features/departments/hooks/useDepartments.js";
    import useReport from "../../features/reports/hooks/useReport.js";

    import Report from "../../features/reports/Report.jsx";


    import  useTicketActions  from "../../features/tickets/hooks/useTicketActions.js";
    import useTicketHub from "../../features/tickets/hooks/useTicketHub.js";

    export default function TicketManager() {

        const [viewMode, setViewMode] = useState("kanban");
        const [modal, setModal] = useState(null);

        const {
            tickets: gridTickets,
            pageInfo,
            filters,
            setFilters,
            loadTickets: loadGridTickets,
            setPageInfo
        } = useGridTickets();

        const {
            columns,
            loadMore,
            reload: loadKanbanTickets,
            initialized
        } = useKanbanTickets();

        const { employees } = useEmployees();
        const { departments } = useDepartments();

        const reloadTickets = () => {
            loadGridTickets();
            loadKanbanTickets();
        };

        const {
            report,
            loading: reportLoading
        } = useReport();


        const {
            moveTicket,
            updateTicket,
            deleteTicket,
            createTicket
        } = useTicketActions(
    
            console.log
        );
        
        useTicketHub();

        const counts = useMemo(() => ({
            1: columns[1].items.length,
            2: columns[2].items.length,
            3: columns[3].items.length
        }), [columns]);

        const openCreateModal = () => {
            setModal({
                type: "create",
                ticket: null
            });
        };

        const openEditModal = ticket => {
            setModal({
                type: "edit",
                ticket
            });
        };

        const closeModal = () => {
            setModal(null);
        };

        const handleSave = async (formData) => {
            await updateTicket(
                modal.ticket,
                formData
            );

            closeModal();
        };

           const handleCreate = async (formData) => {
            
            createTicket(
   
                formData
            );

            closeModal();
        };

        return (
            <>

                <Header
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                    counts={counts}
                    onCreate={openCreateModal}
                />

                {viewMode === "employees" && (
                    <EmployeesTable
                        employees={employees}
                    />
                )}

                {viewMode === "kanban" && (
                    initialized
                        ? (
                            <Board
                                viewMode="kanban"
                                columns={columns}
                                loadMore={loadMore}
                                onMove={moveTicket}
                                onDelete={deleteTicket}
                                onEdit={openEditModal}
                            />
                        )
                        : (
                            <div className="kanban-loading">
                                Загрузка...
                            </div>
                        )
                )}
                {viewMode === "grid" && (
                    <>

                        <TicketFilters
                            filters={filters}
                            setFilters={setFilters}
                            employees={employees}
                            departments={departments}
                        />

                        <Board
                            viewMode="grid"
                            tickets={gridTickets}
                            onMove={moveTicket}
                            onDelete={deleteTicket}
                            onEdit={openEditModal}
                        />

                        <Pagination
                            pageInfo={pageInfo}
                            setPageInfo={setPageInfo}
                        />

                    </>
                )}


                {viewMode === "report" && (
                    <>


                    <Report
        report={report}
        loading={reportLoading}
    />

                    </>
                )}


                {modal && (
                    <Modal
                        type={modal.type}
                        ticket={modal.ticket}
                        employees={employees}
                        onSave={handleSave}
                        onCreate={handleCreate}
                        onClose={closeModal}
                    />
                )}

            </>
        );

    }