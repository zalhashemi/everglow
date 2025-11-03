import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      background: string;
      primary: string;
      secondary: string;
      white: string;
      black: string;
      gray: {
        light: string;
        medium: string;
        dark: string;
      };
    };
    spacing: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
    borderRadius: {
      small: string;
      medium: string;
      large: string;
      round: string;
    };
    typography: {
      fontFamily: string;
      fontSizes: {
        small: string;
        medium: string;
        large: string;
        xlarge: string;
        xxlarge: string;
      };
    };
  }
}