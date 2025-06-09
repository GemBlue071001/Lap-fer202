import { useTheme } from './context/ThemeContext';
import HomePage from './pages/HomePage';

function App() {
  const { isLightTheme } = useTheme();
  return (
    <div style={{
      minHeight: '100vh',
      background: isLightTheme ? '#fff' : '#181a1b',
      color: isLightTheme ? '#222' : '#fff',
      transition: 'background 0.3s, color 0.3s'
    }}>
      <HomePage />

    </div>
  );
}

export default App;
