import NotificationBell from "../../features/notifications/components/NotificationBell";

export default function Header({
    viewMode,
    setViewMode,
    counts,
    onCreate
}) {

    return (
        <header className="header">

            <div className="header-left">

                <div className="logo">
                    TM
                </div>

                <div>
                    <div className="header-title">
                        Ticket Manager
                    </div>

                    <div className="header-subtitle">
                        {
                            viewMode === "kanban"
                                ? "Канбан"
                                : viewMode === "grid"
                                    ? "Сетка"
                                    : viewMode === "employees"
                                        ? "Сотрудники"
                                        : "Отчёт"
                        }
                    </div>
                </div>

            </div>


            <div
                style={{
                    display:"flex",
                    alignItems:"center",
                    gap:16,
                    flexWrap:"wrap"
                }}
            >

                <div className="stats-pill">
                    <span className="stats-dot dot-new"/>
                    Новые:
                    <strong>
                        {counts[1]}
                    </strong>
                </div>


                <div className="stats-pill">
                    <span className="stats-dot dot-processing"/>
                    В работе:
                    <strong>
                        {counts[2]}
                    </strong>
                </div>


                <div className="stats-pill">
                    <span className="stats-dot dot-completed"/>
                    Завершено:
                    <strong>
                        {counts[3]}
                    </strong>
                </div>


                <button
                    className={`btn btn-ghost ${
                        viewMode==="kanban"
                            ? "active-filter"
                            : ""
                    }`}
                    onClick={() => setViewMode("kanban")}
                >
                    📋 Канбан
                </button>


                <button
                    className={`btn btn-ghost ${
                        viewMode==="grid"
                            ? "active-filter"
                            : ""
                    }`}
                    onClick={() => setViewMode("grid")}
                >
                    📊 Сетка
                </button>


                <button
                    className={`btn btn-ghost ${
                        viewMode==="employees"
                            ? "active-filter"
                            : ""
                    }`}
                    onClick={() => setViewMode("employees")}
                >
                    👥 Сотрудники
                </button>


                <button
                    className={`btn btn-ghost ${
                        viewMode==="report"
                            ? "active-filter"
                            : ""
                    }`}
                    onClick={() => setViewMode("report")}
                >
                    📈 Отчёт
                </button>


                {/* 🔔 Уведомления */}
                <NotificationBell />


                <button
                    className="btn btn-primary"
                    onClick={onCreate}
                >
                    + Новый тикет
                </button>


            </div>

        </header>
    );
}