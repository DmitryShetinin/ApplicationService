import {
    changeTicketExecutor,
    changeTicketStatus,
    getTickets
} from "../api/ticketApi";

export function useTicketActions(loadTickets, addToast) {
  const moveTicket = async (ticketId, newStatus) => {
    try {
      await changeTicketStatus(ticketId, newStatus);
      await loadTickets();
    } catch (error) {
      console.error(error);
      addToast(error.message, "error");
    }
  };

  const updateTicket = async (ticket, formData) => {
    try {
      if (ticket.executorId !== formData.executorId) {
        await changeTicketExecutor(ticket.id, formData.executorId);
      }
      if (ticket.status !== formData.status) {
        await changeTicketStatus(ticket.id, formData.status);
      }
      await loadTickets();
      addToast(`Тикет #${ticket.number} обновлён`, "success");
    } catch (error) {
      console.error(error);
      addToast(error.message, "error");
    }
  };

  const deleteTicket = async (ticket) => {
    if (!confirm(`Удалить тикет #${ticket.number}?`)) return;
    try {
      await deleteTicketRequest(ticket.id);
      await loadTickets();
      addToast(`Тикет #${ticket.number} удалён`, "success");
    } catch (error) {
      console.error(error);
      addToast(error.message, "error");
    }
  };

  return { moveTicket, updateTicket, deleteTicket };
}