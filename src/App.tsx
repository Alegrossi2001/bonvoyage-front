import {
  ThemeProvider,
} from './assets/theme';
import { AppRouter } from './routes/AppRouter';

function App() {
  return (
    <ThemeProvider
      defaultMode="light"
      enableSystemPreference={true}
      persistTheme={true}
    >
      <AppRouter />
    </ThemeProvider >
  );
}

export default App;
