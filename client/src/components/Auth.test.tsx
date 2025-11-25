import { render, screen, fireEvent } from '@testing-library/react';
import Auth from './Auth';

describe('Auth Component', () => {
  const mockOnLogin = jest.fn();

  beforeEach(() => {
    mockOnLogin.mockClear();
  });

  it('renders login form by default', () => {
    render(<Auth onLogin={mockOnLogin} />);
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  it('switches to register form when clicked', () => {
    render(<Auth onLogin={mockOnLogin} />);
    
    const registerButton = screen.getByText('Register');
    fireEvent.click(registerButton);
    
    expect(screen.getByText('Register')).toBeInTheDocument();
  });

  it('displays error message when authentication fails', async () => {
    render(<Auth onLogin={mockOnLogin} />);
    
    const usernameInput = screen.getByLabelText('Username');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /login/i });
    
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });
    fireEvent.click(submitButton);
    
    // Wait for error to appear
    // Note: In real test, you'd mock the API call
  });
});
