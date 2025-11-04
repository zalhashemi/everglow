import React from 'react';
import styled from 'styled-components';

interface TextBoxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: ${props => props.theme.spacing.md};
`;

const Label = styled.label`
  font-family: ${props => props.theme.typography.fontFamily};
  font-size: ${props => props.theme.typography.fontSizes.small};
  color: ${props => props.theme.colors.secondary};
  margin-bottom: ${props => props.theme.spacing.xs};
  font-weight: 500;
`;

const StyledInput = styled.input<{ $hasError?: boolean }>`
  width: 100%;
  padding: ${props => props.theme.spacing.md};
  border: 1px solid
    ${props =>
      props.$hasError
        ? '#C85050' // warm muted red for error
        : props.theme.colors.gray.medium};
  border-radius: ${props => props.theme.borderRadius.medium};
  background-color: ${props => props.theme.colors.gray.light};
  color: ${props => props.theme.colors.secondary};
  font-family: ${props => props.theme.typography.fontFamily};
  font-size: ${props => props.theme.typography.fontSizes.medium};
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(118, 148, 159, 0.2); /* soft blue-gray focus */
    background-color: ${props => props.theme.colors.white};
  }

  &::placeholder {
    color: ${props => props.theme.colors.gray.dark};
    opacity: 0.7;
  }
`;

const ErrorText = styled.span`
  color: #c85050;
  font-size: ${props => props.theme.typography.fontSizes.small};
  margin-top: ${props => props.theme.spacing.xs};
`;

const TextBox: React.FC<TextBoxProps> = ({ label, error, ...props }) => {
  return (
    <Wrapper>
      {label && <Label htmlFor={props.id}>{label}</Label>}
      <StyledInput {...props} type={props.type || 'text'} $hasError={!!error} />
      {error && <ErrorText>{error}</ErrorText>}
    </Wrapper>
  );
};

export default TextBox;