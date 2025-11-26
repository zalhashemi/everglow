import styled from 'styled-components';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  width?: string;
  backgroundColor?: string;
  onClick?: () => void;
}

const StyledButton = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  width: ${props => props.width || '990px'};
  border-radius: 10px;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: ${props => props.theme.colors.white};
  background-color: ${props => props.backgroundColor || '#4A5074'};
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  border: none;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 1024px) {
    width: ${props => props.width || '100%'};
    max-width: 700px;
  }

  @media (max-width: 768px) {
    width: 100%;
    height: 44px;
    font-size: 15px;
  }

  @media (max-width: 480px) {
    height: 42px;
    font-size: 14px;
    border-radius: 8px;
  }
`;

const Button: React.FC<ButtonProps> = ({
  width,
  backgroundColor,
  children,
  onClick,
  ...props
}) => {
  return (
    <StyledButton
      width={width}
      backgroundColor={backgroundColor}
      onClick={onClick}
      {...props}
    >
      {children}
    </StyledButton>
  );
};

export default Button;