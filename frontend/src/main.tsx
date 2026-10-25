import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router/dom'
import { UseCasesProvider } from './interface-adapters/controllers/useCasesContext'
import { createUseCases } from './frameworks/composition/compositionRoot'
import { router } from './frameworks/routing/routes'
import './frameworks/styles/tokens.css'
import './frameworks/styles/global.css'
import { ToastProvider } from './frameworks/ui/design-system/ToastProvider'
import { GroupTreeProvider } from './frameworks/ui/providers/GroupTreeProvider'

const useCases = createUseCases()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UseCasesProvider value={useCases}>
      <ToastProvider>
        <GroupTreeProvider>
          <RouterProvider router={router} />
        </GroupTreeProvider>
      </ToastProvider>
    </UseCasesProvider>
  </StrictMode>,
)
