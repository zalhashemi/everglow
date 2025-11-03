import styled from 'styled-components';

interface TextBoxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const StyledInput = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.gray.medium};
  border-radius: ${props => props.theme.borderRadius.medium};
  font-family: ${props => props.theme.typography.fontFamily};
  font-size: ${props => props.theme.typography.fontSizes.medium};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const ErrorText = styled.span`
  color: red;
  font-size: ${props => props.theme.typography.fontSizes.small};
  margin-top: ${props => props.theme.spacing.xs};
`;

const TextBox: React.FC<TextBoxProps> = ({ error, ...props }) => {
  return (
    <div>
      <StyledInput {...props} type={props.type || 'text'} />
      {error && <ErrorText>{error}</ErrorText>}
    </div>
  );
};

export default TextBox;