import { Toaster as SonnerToaster } from 'sonner';
import { useTheme } from '../../context/ThemeContext.jsx';

export function Toaster(props) {
  const { theme } = useTheme();
  return <SonnerToaster theme={theme} position="bottom-right" richColors closeButton duration={2500} {...props} />;
}
