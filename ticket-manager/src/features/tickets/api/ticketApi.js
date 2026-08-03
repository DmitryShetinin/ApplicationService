
const API_URL = "http://localhost:5353/api/tickets";


export async function getKanbanTickets(){

    const response=await fetch(
        `${API_URL}/kanban`
    );

    if(!response.ok)
        throw new Error("Failed loading kanban");

    return await response.json();

}


export async function updateTicket(id, request) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(request)
    });

    if (!response.ok) {
        throw new Error(await response.text());
    }
}

export async function createTicket(request) {
    const response = await fetch(`${API_URL}/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(request)
    });

    if (!response.ok) {
        throw new Error(await response.text());
    }

    return await response.json();
}

export async function changeTicketExecutor(ticketId, executorId) {
      const response = await fetch(
          `${API_URL}/${ticketId}/executor`,
          {
              method: "PATCH",
              headers: {
                  "Content-Type": "application/json"
              },
              body: JSON.stringify({
                  executorId
              })
          });

      if (!response.ok) {
          const error = await response.text();
          throw new Error(error);
      }
  }

  export async function changeTicketStatus(ticketId, status) {
      const response = await fetch(
          `${API_URL}/${ticketId}/status`,
          {
              method: "PATCH",
              headers: {
                  "Content-Type": "application/json"
              },
              body: JSON.stringify({
                  status
              })
          });

      if (!response.ok) {
          const error = await response.text();
          throw new Error(error);
      }
  }

 


export async function getTickets(filters = {})
{
    const params = new URLSearchParams();


    if(filters.status)
        params.append(
            "Status",
            filters.status
        );


    if(filters.executorId)
        params.append(
            "ExecutorId",
            filters.executorId
        );


    if(filters.page)
        params.append(
            "Page",
            filters.page
        );


    if(filters.pageSize)
        params.append(
            "PageSize",
            filters.pageSize
        );


if(filters.departmentId)
    params.append(
        "DepartmentId",
        filters.departmentId
    );

if(filters.onlyOverdue)
    params.append(
        "OnlyOverdue",
        true
    );


    const response =
        await fetch(
            `${API_URL}?${params}`
        );


    if(!response.ok)
        throw new Error(
            "Failed loading tickets"
        );


    return await response.json();
}


export async function deleteTicket(id) {

    const response = await fetch(
        `http://localhost:5353/api/tickets/${id}`,
        {
            method: "DELETE"
        }
    );


    if (!response.ok) {
        throw new Error(
            "Ошибка удаления тикета"
        );
    }

}