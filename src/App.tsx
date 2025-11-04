import React from 'react';
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';
import BusinessRegistration from './pages/auth/BusinessDetailsRegistration'; // ✅ make sure this path is correct

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      {/* ✅ Directly render the registration page */}
      <BusinessRegistration />
    </ThemeProvider>
  );
};

export default App;
