export async function logAuditEvent(event: {
  action: string;
  userId: string;
  resource: string;
  details?: any;
}) {
  try {
    await fetch('/api/audit-log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...event,
        timestamp: new Date().toISOString()
      })
    });
  } catch (error) {
    console.error('Failed to log audit event:', error);
  }
}