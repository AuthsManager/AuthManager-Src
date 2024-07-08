import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthWrapper } from "@/lib/hooks/useAuth";
import { UserContextProvider } from "@/lib/contexts/userContext";
import { Toaster } from "@/components/ui/sonner";
import useRouter from "@/lib/hooks/useRouter";
import "boxicons";

export default function App() {
  const routes = useRouter();

  return (
    <BrowserRouter>
      <UserContextProvider>
        <AuthWrapper>
          <Routes>
            {routes.map(({ path, component: Component }) => (
              <Route key={path} path={path} element={<Component />} />
            ))}
            <Route path="*" element={<h1>404: Not found</h1>} />
          </Routes>
          <Toaster toastOptions={{
              unstyled: false,
              style: {
                background: 'black',
                padding: '0.5rem 1rem',
                gap: '1rem',
                borderRadius: '.75rem'
              },
              classNames: {
                title: 'text-white font-semibold',
                description: 'text-grey',
                info: 'text-blue-500',
                success: 'text-green-500',
                warning: 'text-yellow-500',
                error: 'text-red-500'
              }
            }} />
        </AuthWrapper>
      </UserContextProvider>
    </BrowserRouter>
  );
}