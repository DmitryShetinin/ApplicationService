import {useEffect,useRef,useState} from "react";

export default function Report({
    report,
    loading
}){

    const loaderRef=useRef(null);

    const [visibleCount,setVisibleCount]=useState(2);
console.log(report.executors.length);
console.log(report.executors);
    useEffect(()=>{

        if(!loaderRef.current)
            return;

        const observer=new IntersectionObserver(entries=>{

            if(entries[0].isIntersecting){

                setVisibleCount(x=>
                    Math.min(
                        x+20,
                        report?.executors.length??0
                    )
                );

            }

        });

        observer.observe(loaderRef.current);

        return()=>observer.disconnect();

    },[report?.executors.length]);

    if(loading)
        return(
            <div className="content">
                Загрузка...
            </div>
        );

    if(!report)
        return null;

    return(

        <div className="content">

            <div className="report-card">

                <h2>📈 Отчёт по заявкам</h2>

                <div className="report-section">

                    <h3>Общая статистика</h3>

                    <div className="report-row">
                        <span>Всего заявок</span>
                        <span className="badge">
                            {report.totalTickets}
                        </span>
                    </div>

                    <div className="report-row">
                        <span>Новые</span>
                        <span className="badge badge-blue">
                            {report.newTickets}
                        </span>
                    </div>

                    <div className="report-row">
                        <span>В работе</span>
                        <span className="badge badge-orange">
                            {report.processingTickets}
                        </span>
                    </div>

                    <div className="report-row">
                        <span>Завершено</span>
                        <span className="badge badge-green">
                            {report.completedTickets}
                        </span>
                    </div>

                    <div className="report-row">
                        <span>Просроченные</span>
                        <span className="badge badge-red">
                            {report.overdueTickets}
                        </span>
                    </div>

                </div>

                <div className="report-section">

                    <h3>Статистика по отделам</h3>

                    {report.departments.map(dep=>(

                        <div
                            key={dep.department}
                            className="report-row"
                        >

                            <span>{dep.department}</span>

                            <span className="badge">
                                {dep.tickets}
                            </span>

                        </div>

                    ))}

                </div>

                <div className="report-section">

                    <h3>Топ исполнителей</h3>

                    {report.executors
                        .slice(0,visibleCount)
                        .map(emp=>(

                            <div
                                key={emp.id}
                                className="report-row"
                            >

                                <span>{emp.fullName}</span>

                                <span className="badge badge-green">
                                    {emp.tickets}
                                </span>

                            </div>

                        ))}

                    <div
                        ref={loaderRef}
                        style={{height:20}}
                    />

                </div>

                <button
                    className="btn-download"
                >
                    📥 Скачать отчёт (.txt)
                </button>

            </div>

        </div>

    );

}