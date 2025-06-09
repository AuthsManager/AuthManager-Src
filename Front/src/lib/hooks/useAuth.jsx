import { useContext } from "react";
import { useLocation } from "react-router-dom";
import { UserContext } from "@/lib/contexts/userContext";
import { BASE_API, API_VERSION } from "../../config.json";
import useSWR from 'swr';
import Loader from "@/components/Loader";
import Login from "../../routes/auth/Login";
import Banned from "@/components/Banned";
import Layout from "@/components/ui/layout";

export function useAuth() {
	return useContext(UserContext);
}

export function AuthWrapper({ children }) {
	const { user, updateUser } = useAuth();
	const location = useLocation();
	const auth = localStorage.getItem('token');
  
	const shouldFetchUser = (location.pathname.startsWith('/dash') || location.pathname.startsWith('/admin')) && auth && !(user && user.id);
	const fetcher = async (url) => {
		const response = await fetch(url, {
			method: 'GET', 
			headers: { Authorization: `${location.pathname.includes('admin') ? 'Admin' : 'User'} ${auth}` }
		});
		
		if (!response.ok) {
			const error = new Error('Request failed');
			error.status = response.status;
			const data = await response.json().catch(() => ({}));
			error.data = data;
			throw error;
		}
		
		return response.json();
	};
	
	const { isLoading, error } = useSWR(shouldFetchUser ? `${BASE_API}/v${API_VERSION}/users/@me` : null, fetcher, {
		onSuccess: (data) => {
			if (data?.id) updateUser(data);
		},
		onError: (error) => {
			if (error?.status === 403) {
				localStorage.removeItem('token');
			}
		},
		revalidateOnFocus: false,
		revalidateIfStale: false,
		revalidateOnReconnect: false
	});

	// if (location.pathname.startsWith('/auth/') && auth) return window.location.replace('/dash/dashboard');
  
	if (!location.pathname.startsWith('/dash') && !location.pathname.startsWith('/admin')) {
	  	return <>{children}</>;
	}
  
	if (!auth) {
	  	return <Login />;
	}
  
	if (isLoading) {
	  	return <Loader />;
	}

	if (error?.status === 403 || (user && user.banned)) {
		return <Banned />;
	}

	if (location.pathname.startsWith('/admin') && user && !['Admin', 'Founder'].includes(user.subscription.plan)) return <Login />;
    
	return user && user.id ? <Layout>{children}</Layout> : <Login />;
}


// export function AuthWrapper({ children }) {
// 	const [isLoading, setIsLoading] = useState(false);
// 	const { user, updateUser } = useAuth();
// 	const location = useLocation();
	
// 	const auth = localStorage.getItem('token');
// 	// if (location.pathname.startsWith('/auth/') && auth) return window.location.replace('/dash/dashboard');

// 	useEffect(() => {
// 		if (!location.pathname.startsWith('/dash') && !location.pathname.startsWith('/admin') || !auth || (user && user.id)) return;
// 		setIsLoading(true);

// 		async function getUser() {
// 			const data = await fetch(`${BASE_API}/v${API_VERSION}/users/@me`, { method: 'GET', headers: { 'Authorization': `${auth}` } }).then(response => response.json()).catch(() => null);

// 			if (data?.id) {
// 				updateUser(data);
// 			}
// 			setIsLoading(false);
// 		}

// 		getUser();
// 	}, []);

// 	if (!location.pathname.startsWith('/dash') && !location.pathname.startsWith('/admin')) return <>{children}</>;

// 	if (!auth) return <Login />;
// 	if (user && user.id) return <Layout>{children}</Layout>;
// 	if (isLoading) return <Loader />;

// 	return user ? <Layout>{children}</Layout> : <Login />;
// }