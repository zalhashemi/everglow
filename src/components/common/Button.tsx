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
  width: ${props => props.width || '1280px'};
  border-radius: 10px;
  font-family: 'Inter', sans-serif;
  font-size: 18px;
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