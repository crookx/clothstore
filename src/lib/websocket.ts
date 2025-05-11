import { createWebSocketClient } from '@/lib/websocket-client';

export const wsClient = createWebSocketClient({
  url: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001',
  onConnect: () => {
    console.log('WebSocket connected');
  },
  onDisconnect: () => {
    console.log('WebSocket disconnected');
  }
});

export const subscribeToInventoryUpdates = (callback: (data: any) => void) => {
  return wsClient.subscribe('inventory-updates', callback);
};