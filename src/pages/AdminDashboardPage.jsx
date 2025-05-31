import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminDashboardPage() {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState('');
    const [memberData, setMemberData] = useState({ name: '', tel: '', memo: '' });
    const [bookData, setBookData] = useState({ title: '', author: '', publisher: '', description: '' });
    const [loanQuery, setLoanQuery] = useState({ memberId: '', bookId: '' });
    const [loanResults, setLoanResults] = useState([]);
    const [message, setMessage] = useState({ error: '', success: '' });

    const token = localStorage.getItem('token');

    const modalTitleMap = {
        createMember: '사용자 등록',
        updateMember: '사용자 수정',
        getMemberLoans: '사용자 대출 현황',
        createBook: '도서 등록',
        updateBook: '도서 수정',
        getBookLoans: '도서 대출 이력',
        loanBook: '도서 대출 처리',
        returnBook: '도서 반납 처리',
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        navigate("/admin/login");
    };

    const openModal = (type) => {
        setModalType(type);
        setMessage({ error: '', success: '' });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalType('');
        setMemberData({ name: '', tel: '', memo: '' });
        setBookData({ title: '', author: '', publisher: '', description: '' });
        setLoanQuery({ memberId: '', bookId: '' });
        setLoanResults([]);
        setMessage({ error: '', success: '' });
    };

    const handleInputChange = (e, type) => {
        const { name, value } = e.target;
        if (type === 'member') {
            setMemberData(prev => ({ ...prev, [name]: value }));
        } else if (type === 'book') {
            setBookData(prev => ({ ...prev, [name]: value }));
        } else if (type === 'loan') {
            setLoanQuery(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let response;
            switch (modalType) {
                case 'createMember':
                    if (!memberData.name || !memberData.tel) throw new Error('이름과 전화번호는 필수 입력사항입니다.');
                    response = await axios.post('http://localhost:1271/admin/members', memberData, { headers: { Authorization: `Bearer ${token}` } });
                    setMessage({ success: response.data, error: '' });
                    break;
                case 'updateMember':
                    response = await axios.patch('http://localhost:1271/admin/members', memberData, { headers: { Authorization: `Bearer ${token}` } });
                    setMessage({ success: response.data, error: '' });
                    break;
                case 'createBook':
                    response = await axios.post('http://localhost:1271/admin/books', bookData, { headers: { Authorization: `Bearer ${token}` } });
                    setMessage({ success: response.data, error: '' });
                    break;
                case 'updateBook':
                    response = await axios.patch('http://localhost:1271/admin/books', bookData, { headers: { Authorization: `Bearer ${token}` } });
                    setMessage({ success: response.data, error: '' });
                    break;
                case 'getMemberLoans':
                    response = await axios.get(`http://localhost:1271/admin/members?memberId=${loanQuery.memberId}`, { headers: { Authorization: `Bearer ${token}` } });
                    setLoanResults(response.data);
                    break;
                case 'getBookLoans':
                    response = await axios.get(`http://localhost:1271/admin/books?bookId=${loanQuery.bookId}`, { headers: { Authorization: `Bearer ${token}` } });
                    setLoanResults(response.data);
                    break;
                case 'loanBook':
                    response = await axios.post(`http://localhost:1271/admin/books/loan?bookId=${loanQuery.bookId}&memberId=${loanQuery.memberId}`, {}, { headers: { Authorization: `Bearer ${token}` } });
                    setMessage({ success: response.data, error: '' });
                    break;
                case 'returnBook':
                    response = await axios.post(`http://localhost:1271/admin/books/return?bookId=${loanQuery.bookId}&memberId=${loanQuery.memberId}`, {}, { headers: { Authorization: `Bearer ${token}` } });
                    setMessage({ success: response.data, error: '' });
                    break;
                default:
                    break;
            }
        } catch (err) {
            setMessage({ error: err.response?.data?.message || err.message, success: '' });
        }
    };

    const renderForm = () => {
        const inputClass = "w-full p-2 border rounded mb-3";
        switch (modalType) {
            case 'createMember':
            case 'updateMember':
                return (
                    <>
                        <label>이름</label>
                        <input name="name" value={memberData.name} onChange={(e) => handleInputChange(e, 'member')} className={inputClass} />
                        <label>전화번호</label>
                        <input name="tel" value={memberData.tel} onChange={(e) => handleInputChange(e, 'member')} className={inputClass} />
                        <label>메모</label>
                        <input name="memo" value={memberData.memo} onChange={(e) => handleInputChange(e, 'member')} className={inputClass} />
                    </>
                );
            case 'createBook':
            case 'updateBook':
                return (
                    <>
                        <label>제목</label>
                        <input name="title" value={bookData.title} onChange={(e) => handleInputChange(e, 'book')} className={inputClass} />
                        <label>저자</label>
                        <input name="author" value={bookData.author} onChange={(e) => handleInputChange(e, 'book')} className={inputClass} />
                        <label>출판사</label>
                        <input name="publisher" value={bookData.publisher} onChange={(e) => handleInputChange(e, 'book')} className={inputClass} />
                        <label>설명</label>
                        <textarea name="description" value={bookData.description} onChange={(e) => handleInputChange(e, 'book')} className={inputClass} />
                    </>
                );
            case 'getMemberLoans':
            case 'getBookLoans':
            case 'loanBook':
            case 'returnBook':
                return (
                    <>
                        <label>회원 ID</label>
                        <input name="memberId" value={loanQuery.memberId} onChange={(e) => handleInputChange(e, 'loan')} className={inputClass} />
                        <label>도서 ID</label>
                        <input name="bookId" value={loanQuery.bookId} onChange={(e) => handleInputChange(e, 'loan')} className={inputClass} />
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen p-8 bg-gray-100 text-gray-800">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-cyan-700">📚 관리자 대시보드</h1>
                <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">로그아웃</button>
            </div>

            <div className="grid gap-10">
                <section>
                    <h2 className="text-xl font-semibold mb-4">👤 사용자 관리</h2>
                    <div className="flex gap-4 flex-wrap">
                        <button onClick={() => openModal('createMember')} className="px-4 py-2 bg-cyan-600 text-white rounded-lg shadow hover:bg-cyan-700 transition">사용자 등록</button>
                        <button onClick={() => openModal('updateMember')} className="px-4 py-2 bg-cyan-600 text-white rounded-lg shadow hover:bg-cyan-700 transition">사용자 수정</button>
                        <button onClick={() => openModal('getMemberLoans')} className="px-4 py-2 bg-cyan-600 text-white rounded-lg shadow hover:bg-cyan-700 transition">대출 현황 조회</button>
                    </div>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-4">📘 도서 관리</h2>
                    <div className="flex gap-4 flex-wrap">
                        <button onClick={() => openModal('createBook')} className="px-4 py-2 bg-cyan-600 text-white rounded-lg shadow hover:bg-cyan-700 transition">도서 등록</button>
                        <button onClick={() => openModal('updateBook')} className="px-4 py-2 bg-cyan-600 text-white rounded-lg shadow hover:bg-cyan-700 transition">도서 수정</button>
                        <button onClick={() => openModal('getBookLoans')} className="px-4 py-2 bg-cyan-600 text-white rounded-lg shadow hover:bg-cyan-700 transition">도서 대출 이력</button>
                    </div>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-4">🔄 대출/반납 관리</h2>
                    <div className="flex gap-4 flex-wrap">
                        <button onClick={() => openModal('loanBook')} className="px-4 py-2 bg-cyan-600 text-white rounded-lg shadow hover:bg-cyan-700 transition">대출 처리</button>
                        <button onClick={() => openModal('returnBook')} className="px-4 py-2 bg-cyan-600 text-white rounded-lg shadow hover:bg-cyan-700 transition">반납 처리</button>
                    </div>
                </section>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
                        <h2 className="text-lg font-semibold mb-4">{modalTitleMap[modalType]}</h2>
                        {message.error && <div className="text-red-500 mb-2">{message.error}</div>}
                        {message.success && <div className="text-green-500 mb-2">{message.success}</div>}
                        <form onSubmit={handleSubmit}>
                            {renderForm()}
                            <div className="mt-4 flex justify-end gap-2">
                                <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">취소</button>
                                <button type="submit" className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700">확인</button>
                            </div>
                        </form>

                        {loanResults.length > 0 && (
                            <div className="mt-6">
                                <h3 className="font-semibold mb-2">조회 결과</h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm border border-gray-300">
                                        <thead className="bg-gray-200">
                                        <tr>
                                            {Object.keys(loanResults[0]).map((key, idx) => (
                                                <th key={idx} className="border px-2 py-1">{key}</th>
                                            ))}
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {loanResults.map((item, idx) => (
                                            <tr key={idx}>
                                                {Object.values(item).map((val, i) => (
                                                    <td key={i} className="border px-2 py-1">{val?.toString()}</td>
                                                ))}
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
