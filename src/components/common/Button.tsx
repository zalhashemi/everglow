import styled from 'styled-components';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
}

const StyledButton = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${props => props.theme.borderRadius.medium};
  font-family: ${props => props.theme.typography.fontFamily};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  
  ${props => {
    switch (props.size) {
      case 'small':
        return `
          padding: ${props.theme.spacing.xs} ${props.theme.spacing.sm};
          font-size: ${props.theme.typography.fontSizes.small};
        `;
      case 'large':
        return `
          padding: ${props.theme.spacing.md} ${props.theme.spacing.lg};
          font-size: ${props.theme.typography.fontSizes.large};
        `;
      default: // medium
        return `
          padding: ${props.theme.spacing.sm} ${props.theme.spacing.md};
          font-size: ${props.theme.typography.fontSizes.medium};
        `;
    }
  }}

  ${props => {
    switch (props.variant) {
      case 'secondary':
        return `
          background-color: ${props.theme.colors.secondary};
          color: ${props.theme.colors.white};
          border: none;
          &:hover {
            background-color: ${props.theme.colors.secondary}dd;
          }
        `;
      case 'outline':
        return `
          background-color: transparent;
          color: ${props.theme.colors.primary};
          border: 2px solid ${props.theme.colors.primary};
          &:hover {
            background-color: ${props.theme.colors.primary}11;
          }
        `;
      default: // primary
        return `
          background-color: ${props.theme.colors.primary};
          color: ${props.theme.colors.white};
          border: none;
          &:hover {
            background-color: ${props.theme.colors.primary}dd;
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  children,
  ...props
}) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      {...props}
    >
      {children}
    </StyledButton>
  );
};

export default Button;