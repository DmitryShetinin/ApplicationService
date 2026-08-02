export function generateId() {
  return 'ticket-' + crypto.randomUUID().split('-')[0];
}

 
 
