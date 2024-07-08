import { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BASE_API, API_VERSION } from "../../config.json";

export default function Register() {
    // const [datas, setDatas] = useState({ username: '', email: '', password: '', license: '' });
    const [datas, setDatas] = useState({ username: '', email: '', password: '', confirmPassword: '' });
    const [error, setError] = useState('');

    async function register() {
        if (!datas.username) return setError('Username is required.');
        if (!datas.email) return setError('Email is required.');
        if (!datas.password) return setError('Password is required.');
        if (!datas.confirmPassword) return setError('Password is required.');
        if (datas.password !== datas.confirmPassword) return setError('Passwords are not matching.');

        setError('');

        fetch(`${BASE_API}/v${API_VERSION}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datas)
        })
            .then(response => response.json())
            .then(json => {
                if (json.token) {
                    localStorage.setItem('token', json.token);
                    window.location.replace('/dash/dashboard');
                } else {
                    setError(json.message || 'An error occured.');
                }
            })
        .catch(() => setError('An error occured.'));
    }

    return (
        <div className="flex flex-col items-center justify-center w-full h-screen bg-background text-black">
            <div className="w-full max-w-sm bg-white rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-center text-white bg-blue-600 rounded-t-lg py-4">Registration</h1>
                {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
                <div className="px-8 py-4 space-y-4">
                    <div className="relative">
                        <Input
                            className="w-full px-4 py-2 border rounded-lg bg-white border-[#e5e7eb] focus:ring focus:ring-blue-500"
                            type="text"
                            name="username"
                            id="username"
                            placeholder="Username"
                            value={datas.username}
                            onChange={(e) => setDatas({ ...datas, username: e.target.value })}
                        />
                    </div>
                    <div className="relative">
                        <Input
                            className="w-full px-4 py-2 border rounded-lg bg-white border-[#e5e7eb] focus:ring focus:ring-blue-500"
                            type="email"
                            name="email"
                            id="email"
                            placeholder="Email"
                            value={datas.email}
                            onChange={(e) => setDatas({ ...datas, email: e.target.value })}
                        />
                    </div>
                    <div className="relative">
                        <Input
                            className="w-full px-4 py-2 border rounded-lg bg-white border-[#e5e7eb] focus:ring focus:ring-blue-500"
                            type="password"
                            name="password"
                            id="password"
                            placeholder="Password"
                            value={datas.password}
                            onChange={(e) => setDatas({ ...datas, password: e.target.value })}
                        />
                    </div>
                    <div className="relative">
                        <Input
                            className="w-full px-4 py-2 border rounded-lg bg-white border-[#e5e7eb] focus:ring focus:ring-blue-500"
                            type="password" name="confirmPassword" id="confirmPassword"
                            placeholder="Confirm password"
                            onChange={(e) => setDatas(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        />
                    </div>
                    <div className="relative">
                        <Input
                            className="w-full px-4 py-2 border rounded-lg bg-white border-[#e5e7eb] focus:ring focus:ring-blue-500"
                            type="text"
                            name="license"
                            id="license"
                            placeholder="License"
                            value={datas.license}
                            onChange={(e) => setDatas({ ...datas, license: e.target.value })}
                        />
                    </div>
                    <Button
                        className="w-full py-2 text-white bg-blue-600 rounded-xl hover:bg-blue-700"
                        onClick={register}
                    >
                        Register
                    </Button>
                </div>
                <p className="py-4 text-center">
                    Already registered? <Link to="/auth/login" className="text-blue-600">Login here</Link>
                </p>
            </div>
        </div>
    );
}
