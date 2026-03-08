import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HomePage } from './pages/Home.page';
import { Main } from './pages/Main';
import { DocsPanel } from './components/DocsPanel/DocsPanel';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/main',
    element: <Main />,
  },
  {
    path: '/docs',
    element: <DocsPanel />,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
