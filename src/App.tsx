import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";
import Speaking from "./pages/Speaking";
import Contact from "./pages/Contact";
import StartHere from "./pages/StartHere";
import Resources from "./pages/Resources";
import VisibilityStarterKit from "./pages/VisibilityStarterKit";
import AdaptFramework from "./pages/AdaptFramework";
import WorkWithMe from "./pages/WorkWithMe";
import YouTubePage from "./pages/YouTubePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Navbar />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/start-here" element={<StartHere />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/resources/visibility-starter-kit" element={<VisibilityStarterKit />} />
          <Route path="/frameworks/adapt" element={<AdaptFramework />} />
          <Route path="/youtube" element={<YouTubePage />} />
          <Route path="/speaking" element={<Speaking />} />
          <Route path="/work-with-me" element={<WorkWithMe />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
