import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HomePage } from './pages/Home.page';
import { Main } from './pages/Main';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/main',
    element: <Main />,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
