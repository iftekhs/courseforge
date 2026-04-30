import { AppSidebar } from './components/app-sidebar';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from './components/ui/sidebar';
import { TooltipProvider } from './components/ui/tooltip';
import { Separator } from './components/ui/separator';
import { Routes, Route, Outlet } from 'react-router-dom';
import CoursesPage from './pages/courses/page';
import CourseDetailsPage from './pages/courses/[id]/page';
import CoursePlayPage from './pages/courses/[id]/play/page';

import { TreeStateProvider } from './pages/courses/[id]/components/course-tree-context';
import { ThemeToggle } from './components/theme-toggle';

function AppLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-6"
            />
          </div>
          <div className="ml-auto mr-4">
            <ThemeToggle />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <TreeStateProvider>
            <Outlet />
          </TreeStateProvider>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

function App() {
  return (
    <TooltipProvider>
      <Routes>
        <Route element={<AppLayout />}>
          <Route
            index
            element={
              <div className="min-h-screen flex-1 rounded-xl bg-muted/50" />
            }
          />
          <Route path="courses" element={<CoursesPage />} />
          <Route path="courses/:courseId" element={<CourseDetailsPage />} />
          <Route path="courses/:courseId/play" element={<CoursePlayPage />} />
          
        </Route>
      </Routes>
    </TooltipProvider>
  );
}

export default App;
