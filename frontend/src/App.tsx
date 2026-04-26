import { Link } from 'react-router-dom';
import { AppSidebar } from './components/app-sidebar';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from './components/ui/sidebar';
import { TooltipProvider } from './components/ui/tooltip';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from './components/ui/breadcrumb';
import { Separator } from './components/ui/separator';
import { Routes, Route, Outlet, useLocation } from 'react-router-dom';
import CoursesPage from './pages/courses/page';
import CourseDetailsPage from './pages/courses/[id]/page';
import CoursePlayPage from './pages/courses/[id]/play/page';
import SettingsPage from './pages/settings/page';
import { TreeStateProvider } from './pages/courses/[id]/components/course-tree-context';
import { getBreadcrumbs } from './lib/breadcrumbs';

function Breadcrumbs() {
  const location = useLocation();
  const breadcrumbs = getBreadcrumbs(location.pathname);

  if (breadcrumbs.length === 0) return null;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((crumb, index) => (
          <li key={crumb.href} className="inline-flex items-center gap-1.5">
            {index > 0 && <BreadcrumbSeparator />}
            {index === breadcrumbs.length - 1 ? (
              <BreadcrumbItem>{crumb.title}</BreadcrumbItem>
            ) : (
              <BreadcrumbItem>
                <Link to={crumb.href} className="hover:underline">
                  {crumb.title}
                </Link>
              </BreadcrumbItem>
            )}
          </li>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function AppLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-6" />
            <Breadcrumbs />
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
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </TooltipProvider>
  );
}

export default App;