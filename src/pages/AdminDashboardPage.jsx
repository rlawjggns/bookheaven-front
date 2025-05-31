import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminDashboardPage() {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState('');
    const [memberData, setMemberData] = useState({ id: '', name: '', tel: '', memo: '' });
    const [bookData, setBookData] = useState({ id: '', title: '', author: '', publisher: '', publicationYear: '', price: '' });
    const [loanQuery, setLoanQuery] = useState({ memberId: '', bookId: '' });
    const [loanResults, setLoanResults] = useState(null); // 초기값 null로 변경
    const [message, setMessage] = useState({ error: '', success: '' });

    const token = localStorage.getItem('token');

    // 한글 컬럼명 매핑, 기존 컬럼명 + 대출 결과에 자주 나오는 필드 추가
    const columnLabelMap = {
        id: 'ID',
        name: '이름',
        tel: '전화번호',
        memo: '메모',
        bookId: '도서 ID',
        bookName: '도서명',
        bookAuthor: '저자',
        bookPublisher: '출판사',
        memberId: '회원 ID',
        memberName: '회원 이름',
        loanDate: '대출일',
        returnDate: '반납일',
        overdueStatus: '연체 여부',
        title: '제목',
        author: '저자',
        publisher: '출판사',
        publicationYear: '출판연도',
        price: '가격'
    };

    // 버튼 스타일 재사용
    const btnClass = "px-4 py-2 rounded-md font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400";
    const btnPrimary = btnClass + " bg-cyan-600 text-white hover:bg-cyan-700";
    const btnSecondary = btnClass + " bg-gray-300 text-gray-800 hover:bg-gray-400";
    const btnDanger = btnClass + " bg-red-500 text-white hover:bg-red-600";

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        navigate("/admin/login");
    };

    const openModal = (type) => {
        setModalType(type);
        setMessage({ error: '', success: '' });
        setLoanResults(null); // 모달 열 때 초기화 (null로)
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalType('');
        setMemberData({ id: '', name: '', tel: '', memo: '' });
        setBookData({ id: '', title: '', author: '', publisher: '', publicationYear: '', price: '' });
        setLoanQuery({ memberId: '', bookId: '' });
        setLoanResults(null);
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
            const headers = { Authorization: `Bearer ${token}` };
            setMessage({ error: '', success: '' });
            setLoanResults(null);

            switch (modalType) {
                case 'createMember':
                    if (!memberData.name || !memberData.tel) throw new Error('이름과 전화번호는 필수입니다.');
                    response = await axios.post('http://localhost:1271/admin/members', memberData, { headers });
                    setMessage({ success: response.data, error: '' });
                    break;
                case 'updateMember':
                    if (!memberData.id || !memberData.name || !memberData.tel) throw new Error('ID, 이름, 전화번호는 필수입니다.');
                    response = await axios.patch('http://localhost:1271/admin/members', memberData, { headers });
                    setMessage({ success: response.data, error: '' });
                    break;
                case 'createBook':
                    if (!bookData.title || !bookData.author || !bookData.publisher || !bookData.publicationYear || !bookData.price) {
                        throw new Error('모든 도서 정보를 입력해주세요.');
                    }
                    response = await axios.post('http://localhost:1271/admin/books', bookData, { headers });
                    setMessage({ success: response.data, error: '' });
                    break;
                case 'updateBook':
                    if (!bookData.id || !bookData.title || !bookData.author || !bookData.publisher || !bookData.publicationYear || !bookData.price) {
                        throw new Error('모든 도서 정보를 입력해주세요.');
                    }
                    response = await axios.patch('http://localhost:1271/admin/books', bookData, { headers });
                    setMessage({ success: response.data, error: '' });
                    break;
                case 'getMemberLoans':
                    if (!loanQuery.memberId) throw new Error('회원 ID를 입력해주세요.');
                    response = await axios.get(`http://localhost:1271/admin/members?memberId=${loanQuery.memberId}`, { headers });
                    setLoanResults(response.data.length > 0 ? response.data : []);
                    break;
                case 'getBookLoans':
                    if (!loanQuery.bookId) throw new Error('도서 ID를 입력해주세요.');
                    response = await axios.get(`http://localhost:1271/admin/books?bookId=${loanQuery.bookId}`, { headers });
                    setLoanResults(response.data.length > 0 ? response.data : []);
                    break;
                case 'loanBook':
                    if (!loanQuery.memberId || !loanQuery.bookId) throw new Error('회원 ID와 도서 ID를 모두 입력해주세요.');
                    response = await axios.post(`http://localhost:1271/admin/books/loan?bookId=${loanQuery.bookId}&memberId=${loanQuery.memberId}`, {}, { headers });
                    setMessage({ success: response.data, error: '' });
                    break;
                case 'returnBook':
                    if (!loanQuery.memberId || !loanQuery.bookId) throw new Error('회원 ID와 도서 ID를 모두 입력해주세요.');
                    response = await axios.post(`http://localhost:1271/admin/books/return?bookId=${loanQuery.bookId}&memberId=${loanQuery.memberId}`, {}, { headers });
                    setMessage({ success: response.data, error: '' });
                    break;
                default:
                    break;
            }
        } catch (err) {
            setLoanResults(null);
            setMessage({ error: err.response?.data?.message || err.message, success: '' });
        }
    };

    // 조회 결과용 테이블 컬럼 렌더링 (loanResults가 배열이고 첫 요소가 object인 경우만)
    const renderLoanResultsTable = () => {
        if (!loanResults) return null; // 결과 없음 상태면 아무것도 안 보여줌
        if (loanResults.length === 0) return <div className="text-gray-600 mt-2">결과가 없습니다.</div>;

        // 컬럼 추출(키)
        const columns = Object.keys(loanResults[0]);

        return (
            <div className="overflow-x-auto mt-4">
                <table className="w-full text-sm border border-gray-300 rounded">
                    <thead className="bg-gray-200">
                    <tr>
                        {columns.map((key) => (
                            <th key={key} className="border px-3 py-1 text-center font-medium">
                                {columnLabelMap[key] || key}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {loanResults.map((row, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                            {columns.map((col) => (
                                <td key={col} className="border px-3 py-1 text-center whitespace-nowrap">
                                    {typeof row[col] === 'boolean' ? (row[col] ? '예' : '아니오') : row[col]?.toString() || '-'}
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        );
    };

    const renderForm = () => {
        const inputClass = "w-full p-2 border border-gray-300 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-cyan-400";

        switch (modalType) {
            case 'createMember':
            case 'updateMember':
                return (
                    <>
                        {modalType === 'updateMember' && (
                            <>
                                <label>회원 ID</label>
                                <input name="id" value={memberData.id} onChange={(e) => handleInputChange(e, 'member')} className={inputClass} />
                            </>
                        )}
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
                        {modalType === 'updateBook' && (
                            <>
                                <label>도서 ID</label>
                                <input name="id" value={bookData.id} onChange={(e) => handleInputChange(e, 'book')} className={inputClass} />
                            </>
                        )}
                        <label>제목</label>
                        <input name="title" value={bookData.title} onChange={(e) => handleInputChange(e, 'book')} className={inputClass} />
                        <label>저자</label>
                        <input name="author" value={bookData.author} onChange={(e) => handleInputChange(e, 'book')} className={inputClass} />
                        <label>출판사</label>
                        <input name="publisher" value={bookData.publisher} onChange={(e) => handleInputChange(e, 'book')} className={inputClass} />
                        <label>출판연도</label>
                        <input name="publicationYear" value={bookData.publicationYear} onChange={(e) => handleInputChange(e, 'book')} className={inputClass} />
                        <label>가격</label>
                        <input name="price" value={bookData.price} onChange={(e) => handleInputChange(e, 'book')} className={inputClass} />
                    </>
                );
            case 'getMemberLoans':
                return (
                    <>
                        <label>회원 ID</label>
                        <input name="memberId" value={loanQuery.memberId} onChange={(e) => handleInputChange(e, 'loan')} className={inputClass} />
                    </>
                );
            case 'getBookLoans':
                return (
                    <>
                        <label>도서 ID</label>
                        <input name="bookId" value={loanQuery.bookId} onChange={(e) => handleInputChange(e, 'loan')} className={inputClass} />
                    </>
                );
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
                <button onClick={handleLogout} className={btnDanger}>로그아웃</button>
            </div>

            <div className="grid gap-10">
                {/* 사용자 관리 */}
                <section>
                    <h2 className="text-xl font-semibold mb-4">👤 사용자 관리</h2>
                    <div className="flex gap-4 flex-wrap">
                        <button onClick={() => openModal('createMember')} className={btnPrimary}>사용자 등록</button>
                        <button onClick={() => openModal('updateMember')} className={btnPrimary}>사용자 수정</button>
                        <button onClick={() => openModal('getMemberLoans')} className={btnPrimary}>사용자 대출현황</button>
                    </div>
                </section>

                {/* 도서 관리 */}
                <section>
                    <h2 className="text-xl font-semibold mb-4">📖 도서 관리</h2>
                    <div className="flex gap-4 flex-wrap">
                        <button onClick={() => openModal('createBook')} className={btnPrimary}>도서 등록</button>
                        <button onClick={() => openModal('updateBook')} className={btnPrimary}>도서 수정</button>
                        <button onClick={() => openModal('getBookLoans')} className={btnPrimary}>도서 대출이력</button>
                    </div>
                </section>

                {/* 대출/반납 관리 */}
                <section>
                    <h2 className="text-xl font-semibold mb-4">🔄 대출/반납 처리</h2>
                    <div className="flex gap-4 flex-wrap">
                        <button onClick={() => openModal('loanBook')} className={btnPrimary}>대출 처리</button>
                        <button onClick={() => openModal('returnBook')} className={btnPrimary}>반납 처리</button>
                    </div>
                </section>
            </div>

            {/* 모달 */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-20 z-50">
                    <div className="bg-white rounded-lg p-6 w-[480px] max-h-[80vh] overflow-y-auto shadow-lg">
                        <h3 className="text-2xl font-bold mb-4 text-cyan-700">
                            {{
                                createMember: '사용자 등록',
                                updateMember: '사용자 수정',
                                createBook: '도서 등록',
                                updateBook: '도서 수정',
                                getMemberLoans: '사용자 대출현황',
                                getBookLoans: '도서 대출이력',
                                loanBook: '도서 대출 처리',
                                returnBook: '도서 반납 처리',
                            }[modalType]}
                        </h3>

                        <form onSubmit={handleSubmit}>
                            {renderForm()}
                            <div className="flex justify-end gap-3 mt-4">
                                <button type="submit" className={btnPrimary}>확인</button>
                                <button type="button" onClick={closeModal} className={btnSecondary}>취소</button>
                            </div>
                        </form>

                        {/* 조회 결과 테이블 출력 - 대출 현황 조회 모달일 때만 */}
                        {(modalType === 'getMemberLoans' || modalType === 'getBookLoans') && renderLoanResultsTable()}

                        {/* 에러/성공 메시지 */}
                        {(message.error || message.success) && (
                            <div className={`mt-4 p-2 rounded ${
                                message.error ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'
                            }`}>
                                {message.error || message.success}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
