import { useState, useMemo, useCallback, useEffect } from 'react';

import Board from './components/Board';
import Modal from './components/Modal';
import Toast from './components/Toast';
import Report from './components/Report';

import { employees } from './utils';

import {
  changeTicketExecutor,
  changeTicketStatus
} from './api.js';


const STATUS = {
  New: 1,
  Processing: 2,
  Completed: 3
};


const API_URL =
  "http://localhost:5353/api/tickets";



export default function App() {


  const [tickets, setTickets] = useState([]);

  const [modal, setModal] = useState(null);

  const [toasts, setToasts] = useState([]);

  const [viewMode, setViewMode] =
    useState('kanban');



  const [filterStatus, setFilterStatus] =
    useState('');

  const [filterExecutor, setFilterExecutor] =
    useState('');

  const [filterDepartment, setFilterDepartment] =
    useState('');

  const [filterOverdue, setFilterOverdue] =
    useState(false);





  const addToast = useCallback(
    (message, type = "info") => {

      const id = Date.now();

      setToasts(prev => [
        ...prev,
        {
          id,
          message,
          type
        }
      ]);


      setTimeout(() => {

        setToasts(prev =>
          prev.filter(
            x => x.id !== id
          )
        );

      }, 2800);

    },
    []
  );






  async function loadTickets(){


    const params =
      new URLSearchParams();



    if(filterStatus)
      params.append(
        "Status",
        filterStatus
      );


    if(filterExecutor)
      params.append(
        "ExecutorId",
        filterExecutor
      );


    if(filterDepartment)
      params.append(
        "DepartmentId",
        filterDepartment
      );


    if(filterOverdue)
      params.append(
        "OnlyOverdue",
        "true"
      );




    const response =
      await fetch(
        `${API_URL}?${params.toString()}`
      );



    if(!response.ok){

      console.error(
        await response.text()
      );

      return;

    }





    const data =
      await response.json();





    const normalized =
      data.map(ticket => ({

        ...ticket,


        authorId:
          ticket.author?.id ?? null,


        executorId:
          ticket.executor?.id ?? null,


        allowedTransitions:
          ticket.allowedTransitions ?? []

      }));




    setTickets(normalized);

  }





  useEffect(()=>{

    loadTickets();

  },[
    filterStatus,
    filterExecutor,
    filterDepartment,
    filterOverdue
  ]);








 const filteredTickets =
  useMemo(()=>{


    if(viewMode !== "grid")
      return tickets;



    return tickets.filter(ticket=>{


      // фильтр по статусу
      if(
        filterStatus &&
        ticket.status !== Number(filterStatus)
      ){
        return false;
      }



      // фильтр по исполнителю
      if(
        filterExecutor &&
        ticket.executor?.id !== filterExecutor
      ){
        return false;
      }



      // фильтр по подразделению
      if(
        filterDepartment &&
        ticket.executor?.department !== filterDepartment
      ){
        return false;
      }



      // фильтр просроченных
      if(filterOverdue){

        const deadline =
          new Date(ticket.deadline);


        if(deadline >= new Date()){
          return false;
        }

      }



      return true;


    });


  },[
    tickets,
    viewMode,
    filterStatus,
    filterExecutor,
    filterDepartment,
    filterOverdue
  ]);






  const departments =
    [
      ...new Set(
        employees.map(
          e => e.department
        )
      )
    ];









  const openCreateModal = ()=>{

    setModal({
      type:"create",
      ticket:null
    });

  };





  const openEditModal =
    (ticket)=>{


      console.log(
        "EDIT",
        ticket
      );


      setModal({

        type:"edit",

        ticket

      });

    };





  const closeModal = ()=>{

    setModal(null);

  };









  const handleSave =
    async(formData)=>{


      if(
        modal?.type === "edit" &&
        modal.ticket
      ){


        try{


          if(
            modal.ticket.executorId !==
            formData.executorId
          ){


            await changeTicketExecutor(
              modal.ticket.id,
              formData.executorId
            );

          }




          if(
            modal.ticket.status !==
            formData.status
          ){


            await changeTicketStatus(
              modal.ticket.id,
              formData.status
            );

          }




          await loadTickets();



          addToast(
            `Тикет #${modal.ticket.number} обновлён`,
            "success"
          );


        }
        catch(error){


          console.error(error);


          addToast(
            error.message,
            "error"
          );

        }



      }



      closeModal();

    };












  const moveTicket =
    async(ticketId,newStatus)=>{


      try{


        await changeTicketStatus(
          ticketId,
          newStatus
        );


        await loadTickets();


      }
      catch(error){


        console.error(error);


        addToast(
          error.message,
          "error"
        );


      }


    };









  const deleteTicket =
    (ticketId)=>{


      const ticket =
        tickets.find(
          t=>t.id===ticketId
        );



      if(
        ticket &&
        confirm(
          `Удалить тикет #${ticket.number}?`
        )
      ){


        setTickets(prev=>
          prev.filter(
            t=>t.id!==ticketId
          )
        );


        addToast(
          `Тикет #${ticket.number} удалён`
        );


      }


    };









  const counts = {


    1:
      tickets.filter(
        t=>t.status===1
      ).length,


    2:
      tickets.filter(
        t=>t.status===2
      ).length,


    3:
      tickets.filter(
        t=>t.status===3
      ).length


  };









  const EmployeesTable = ()=>(
    <div className="content">

      <table className="employees-table">

        <thead>

        <tr>
          <th>Сотрудник</th>
          <th>Подразделение</th>
          <th>Должность</th>
        </tr>

        </thead>


        <tbody>


        {
          employees.map(emp=>(

            <tr key={emp.id}>

              <td>

                <span className="emp-avatar">
                  {emp.initials}
                </span>

                {emp.name}

              </td>


              <td>
                {emp.department}
              </td>


              <td>
                {emp.position}
              </td>


            </tr>

          ))
        }


        </tbody>


      </table>


    </div>
  );









  return (

<div className="app">



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
 viewMode === 'kanban'
 ? 'Канбан'
 : viewMode === 'grid'
 ? 'Сетка'
 : viewMode === 'employees'
 ? 'Сотрудники'
 : 'Отчёт'
}


</div>


</div>


</div>







<div style={{
display:'flex',
alignItems:'center',
gap:16,
flexWrap:'wrap'
}}>


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
?'active-filter'
:''
}`}
onClick={()=>setViewMode("kanban")}
>
📋 Канбан
</button>



<button
className={`btn btn-ghost ${
viewMode==="grid"
?'active-filter'
:''
}`}
onClick={()=>setViewMode("grid")}
>
📊 Сетка
</button>



<button
className={`btn btn-ghost ${
viewMode==="employees"
?'active-filter'
:''
}`}
onClick={()=>setViewMode("employees")}
>
👥 Сотрудники
</button>



<button
className={`btn btn-ghost ${
viewMode==="report"
?'active-filter'
:''
}`}
onClick={()=>setViewMode("report")}
>
📈 Отчёт
</button>



<button
className="btn btn-primary"
onClick={openCreateModal}
>
+ Новый тикет
</button>


</div>



</header>









{
viewMode==="grid" && (


<div className="filter-bar">


<div className="filter-group">

<label>
Статус
</label>


<select
value={filterStatus}
onChange={
e=>setFilterStatus(e.target.value)
}
>

<option value="">
Все статусы
</option>


<option value="1">
Новый
</option>


<option value="2">
В работе
</option>


<option value="3">
Завершён
</option>


</select>


</div>






<div className="filter-group">

<label>
Исполнитель
</label>


<select
value={filterExecutor}
onChange={
e=>setFilterExecutor(e.target.value)
}
>


<option value="">
Все исполнители
</option>


{
employees.map(emp=>(

<option
key={emp.id}
value={emp.id}
>
{emp.name}
</option>

))
}


</select>


</div>







<div className="filter-group">


<label>
Подразделение
</label>


<select
value={filterDepartment}
onChange={
e=>setFilterDepartment(e.target.value)
}
>


<option value="">
Все подразделения
</option>


{
departments.map(dep=>(

<option
key={dep}
value={dep}
>
{dep}
</option>

))
}


</select>


</div>







<div className="filter-group">

<label>

<input
type="checkbox"
checked={filterOverdue}
onChange={
e=>setFilterOverdue(e.target.checked)
}
/>

Только просроченные

</label>


</div>




<button
className="filter-reset"
onClick={()=>{

setFilterStatus('');
setFilterExecutor('');
setFilterDepartment('');
setFilterOverdue(false);

}}
>
Сбросить
</button>


</div>


)

}









{
viewMode==="kanban" &&

<Board
tickets={tickets}
viewMode="kanban"
onMove={moveTicket}
onDelete={deleteTicket}
onEdit={openEditModal}
/>

}






{
viewMode==="grid" &&

<Board
tickets={filteredTickets}
viewMode="grid"
onMove={moveTicket}
onDelete={deleteTicket}
onEdit={openEditModal}
/>

}





{
viewMode==="employees" &&
<EmployeesTable/>
}





{
viewMode==="report" &&
<Report
tickets={tickets}
employees={employees}
/>

}





{
modal &&

<Modal

type={modal.type}

ticket={modal.ticket}

employees={employees}

onSave={handleSave}

onClose={closeModal}

/>

}





<Toast toasts={toasts}/>


</div>

  );

}