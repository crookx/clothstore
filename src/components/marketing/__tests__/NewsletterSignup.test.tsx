import { render } from '@testing-library/react';
import { screen, waitFor } from '@testing-library/react/pure';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { NewsletterSignup } from '../NewsletterSignup';
import { subscribeToNewsletter } from '@/services/emailService';

// Mock dependencies
jest.mock('@/services/emailService');
jest.mock('@/components/ui/toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}));

describe('NewsletterSignup', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders newsletter signup form', () => {
    render(<NewsletterSignup />);
    
    expect(screen.getByRole('heading')).toHaveTextContent('Subscribe to Our Newsletter');
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveTextContent('Subscribe');
  });

  it('handles valid email submission', async () => {
    const mockSubscribe = subscribeToNewsletter as jest.Mock;
    mockSubscribe.mockResolvedValueOnce(true);

    render(<NewsletterSignup />);
    
    await userEvent.type(
      screen.getByRole('textbox'),
      'test@example.com'
    );
    
    await userEvent.click(screen.getByRole('button'));

    expect(mockSubscribe).toHaveBeenCalledWith('test@example.com');
    await waitFor(() => {
      expect(screen.getByRole('textbox')).toHaveValue('');
    });
  });

  it('displays error for invalid email', async () => {
    render(<NewsletterSignup />);
    
    await userEvent.type(
      screen.getByRole('textbox'),
      'invalid-email'
    );
    
    await userEvent.click(screen.getByRole('button'));

    expect(await screen.findByText('Please enter a valid email address')).toBeInTheDocument();
  });

  it('handles submission error', async () => {
    const mockSubscribe = subscribeToNewsletter as jest.Mock;
    mockSubscribe.mockRejectedValueOnce(new Error('Subscription failed'));

    render(<NewsletterSignup />);
    
    await userEvent.type(
      screen.getByRole('textbox'),
      'test@example.com'
    );
    
    await userEvent.click(screen.getByRole('button'));

    expect(mockSubscribe).toHaveBeenCalledWith('test@example.com');
    expect(await screen.findByText('Subscription failed')).toBeInTheDocument();
  });
});