import React, { useState } from "react";
import axios from "axios";

export default function AdminLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const params = new URLSearchParams();
            params.append("username", email);
            params.append("password", password);
            await axios.post(`http://localhost:1271/admin/signin`, params, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            });

            window.location.href = "/admin/dashboard";
        } catch {
            setError("이메일 또는 비밀번호가 잘못되었습니다.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-bg-color px-4">
            <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl">
                <h2 className="mb-8 text-3xl font-bold text-center text-main-color">
                    관리자 로그인
                </h2>

                {error && (
                    <div className="mb-6 text-center text-sm text-red-600">{error}</div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label
                            htmlFor="email"
                            className="block mb-2 text-sm font-medium text-gray-700"
                        >
                            이메일
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-main-color"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="block mb-2 text-sm font-medium text-gray-700"
                        >
                            비밀번호
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-main-color"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 text-sm font-semibold text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 transition cursor-pointer"
                    >
                        로그인
                    </button>
                </form>
            </div>
        </div>
    );
}
