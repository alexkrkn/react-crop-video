import { HomePage } from './pages/home'
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  components: {
    'MuiButton': {
      defaultProps: {
        disableElevation: true,
      }
    },
    'MuiButtonBase': {
      defaultProps: {
        disableRipple: true,
      }
    },
  },
  palette: {
    primary: {
      main: '#242825',
    },
  },
});

function App() {

  return (
    <ThemeProvider theme={theme}>
      <HomePage />
    </ThemeProvider>
  );
}

export default App
