import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from '@react-email/components';
import type { Order } from '@/types/order';

interface OrderStatusUpdateEmailProps {
  order: Order;
}

export function OrderStatusUpdateEmail({ order }: OrderStatusUpdateEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your order status has been updated</Preview>
      <Body>
        <Container>
          <Heading>Order Status Update</Heading>
          <Text>Order ID: {order.id}</Text>
          <Text>New Status: {order.status}</Text>
          <Text>Updated: {new Date(order.updatedAt).toLocaleString()}</Text>
        </Container>
      </Body>
    </Html>
  );
}