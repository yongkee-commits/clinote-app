import { RouterProvider } from 'react-router';
import { router } from './routes';
import { ClinicProvider } from './context/ClinicContext';

function App() {
  return (
    <ClinicProvider>
      <RouterProvider router={router} />
    </ClinicProvider>
  );
}

export default App;