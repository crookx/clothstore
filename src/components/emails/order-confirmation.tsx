import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
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
      <Preview>Your Future Babies order confirmation</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Order Confirmation</Heading>
          
          <Section style={section}>
            <Text style={text}>Order ID: {order.id}</Text>
            <Text style={text}>Total: ${order.total.toFixed(2)}</Text>
          </Section>

          <Section style={section}>
            <Heading style={h2}>Items</Heading>
            {order.items.map((item) => (
              <Text key={item.id} style={text}>
                {item.quantity}x {item.name} - ${item.price.toFixed(2)}
              </Text>
            ))}
          </Section>

          <Section style={section}>
            <Heading style={h2}>Shipping Address</Heading>
            <Text style={text}>
              {order.shippingAddress.street}<br />
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
              {order.shippingAddress.country}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: '#ffffff',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
};

const h1 = {
  color: '#1a1a1a',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '1.25',
  marginBottom: '24px',
};

const h2 = {
  color: '#1a1a1a',
  fontSize: '20px',
  fontWeight: '600',
  lineHeight: '1.25',
  marginBottom: '16px',
};

const text = {
  color: '#4a4a4a',
  fontSize: '16px',
  lineHeight: '24px',
  marginBottom: '12px',
};

const section = {
  marginBottom: '32px',
};