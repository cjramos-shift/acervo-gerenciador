import { createBrowserRouter, type RouteObject } from 'react-router'
import { AppShell } from '../ui/layout/AppShell'
import { ContentDetailsPage } from '../ui/pages/ContentDetailsPage'
import { ContentListPage } from '../ui/pages/ContentListPage'
import { HomePage } from '../ui/pages/HomePage'
import { NotFoundPage } from '../ui/pages/NotFoundPage'
import { SearchResultsPage } from '../ui/pages/SearchResultsPage'

export const routeDefinitions: RouteObject[] = [
  {
    element: <AppShell />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'grupos/:groupId', element: <ContentListPage /> },
      { path: 'grupos/:groupId/categorias/:categoryId', element: <ContentListPage /> },
      { path: 'busca', element: <SearchResultsPage /> },
      {
        path: 'conteudos/novo',
        lazy: async () => ({ Component: (await import('../ui/pages/ContentFormPage')).NewContentPage }),
      },
      { path: 'conteudos/:contentId', element: <ContentDetailsPage /> },
      {
        path: 'conteudos/:contentId/editar',
        lazy: async () => ({ Component: (await import('../ui/pages/ContentFormPage')).EditContentPage }),
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]

export const router = createBrowserRouter(routeDefinitions)
