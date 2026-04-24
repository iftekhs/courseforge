import { AppSidebar } from './components/app-sidebar';
import { SidebarProvider } from './components/ui/sidebar';
import { TooltipProvider } from './components/ui/tooltip';
function App() {
  return (
    <>
      <section className="">
        <SidebarProvider>
          <TooltipProvider>
            <AppSidebar />
          </TooltipProvider>
        </SidebarProvider>
      </section>
    </>
  );
}

export default App;
