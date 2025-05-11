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

interface OrderConfirmationEmailProps {
  order: Order;
}

export function OrderConfirmationEmail({ order }: OrderConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your FutureBabies order confirmation</Preview>
      <Body>
        <Container>
          <Heading>Order Confirmation</Heading>
          <Text>Order ID: {order.id}</Text>
          <Text>Total: ${order.total.toFixed(2)}</Text>
          {/* Add more order details as needed */}
        </Container>
      </Body>
    </Html>
  );
}