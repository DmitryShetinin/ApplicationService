
const API_URL = "http://localhost:5353/api/tickets";

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
