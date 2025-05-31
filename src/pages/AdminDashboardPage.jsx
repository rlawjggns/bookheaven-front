import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminDashboardPage() {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [memberData, setMemberData] = useState({
        name: '',
        tel: '',
        memo: ''
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        navigate("/admin/login");
    };

    const openModal = () => {
        setIsModalOpen(true);
        setErrorMessage('');
        setSuccessMessage('');
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setMemberData({
            name: '',
            tel: '',
            memo: ''
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setMemberData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!memberData.name || !memberData.tel) {
            setErrorMessage('이름과 전화번호는 필수 입력사항입니다.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                'http://localhost:1271/admin/members',
                memberData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            setSuccessMessage('사용자가 성공적으로 등록되었습니다.');
            setTimeout(() => {
                closeModal();
            }, 2000);
        } catch (error) {
            setErrorMessage('사용자 등록 중 오류가 발생했습니다: ' + (error.response?.data?.message || error.message));
        }
    };
    return (
        <div className="min-h-screen p-8 bg-gray-50">
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-4xl font-bold text-cyan-600">관리자 대시보드</h1>
                <button 
                    onClick={handleLogout}
                    className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 transition"
                >
                    로그아웃
                </button>
            </div>

            {/* 사용자 관리 */}
            <section className="mb-12">
                <h2 className="mb-4 text-2xl font-semibold text-cyan-600">사용자 관리</h2>
                <div className="flex flex-wrap gap-4">
                    <button 
                        onClick={openModal}
                        className="px-6 py-3 text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 transition">
                        사용자 등록
                    </button>
                    <button className="px-6 py-3 text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 transition">
                        사용자 수정
                    </button>
                    <button className="px-6 py-3 text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 transition">
                        사용자 대출 현황 조회
                    </button>
                </div>
            </section>

            {/* 도서 관리 */}
            <section className="mb-12">
                <h2 className="mb-4 text-2xl font-semibold text-cyan-600">도서 관리</h2>
                <div className="flex flex-wrap gap-4">
                    <button className="px-6 py-3 text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 transition">
                        도서 등록
                    </button>
                    <button className="px-6 py-3 text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 transition">
                        도서 수정
                    </button>
                    <button className="px-6 py-3 text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 transition">
                        도서 조회 (대출 현황 및 이력)
                    </button>
                </div>
            </section>

            {/* 대출/반납 관리 */}
            <section>
                <h2 className="mb-4 text-2xl font-semibold text-cyan-600">대출/반납 관리</h2>
                <div className="flex flex-wrap gap-4">
                    <button className="px-6 py-3 text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 transition">
                        대출 처리 (도서 번호 + 사용자 번호)
                    </button>
                    <button className="px-6 py-3 text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 transition">
                        반납 처리 (도서 번호 + 사용자 번호)
                    </button>
                </div>
            </section>

            {/* 사용자 등록 모달 */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 w-full max-w-md">
                        <h2 className="text-2xl font-semibold text-cyan-600 mb-4">사용자 등록</h2>

                        {errorMessage && (
                            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                                {errorMessage}
                            </div>
                        )}

                        {successMessage && (
                            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
                                {successMessage}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2" htmlFor="name">
                                    이름 *
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={memberData.name}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-cyan-500"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2" htmlFor="tel">
                                    전화번호 *
                                </label>
                                <input
                                    id="tel"
                                    name="tel"
                                    type="text"
                                    value={memberData.tel}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-cyan-500"
                                    required
                                    placeholder="010-0000-0000"
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-gray-700 mb-2" htmlFor="memo">
                                    메모
                                </label>
                                <textarea
                                    id="memo"
                                    name="memo"
                                    value={memberData.memo}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-cyan-500"
                                    rows="3"
                                    placeholder="부서나 기타 정보"
                                ></textarea>
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300 transition"
                                >
                                    취소
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-white bg-cyan-600 rounded hover:bg-cyan-700 transition"
                                >
                                    등록
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
