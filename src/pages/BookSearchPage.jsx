import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const BookSearchPage = () => {
    const [books, setBooks] = useState([]);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [sortField, setSortField] = useState('title');
    const [sortOrder, setSortOrder] = useState('asc');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState(null);
    const size = 10;
    const navigate = useNavigate();


    // 검색 디바운싱
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1); // 검색어 바뀌면 페이지 초기화
        }, 300);
        return () => clearTimeout(handler);
    }, [search]);

    // 도서 데이터 불러오기
    const fetchBooks = useCallback(async () => {
        setError(null);
        try {
            const response = await axios.get('http://localhost:1271/member/books', {
                params: {
                    search: debouncedSearch,
                    sortField,
                    sortOrder,
                    page,
                    size,
                },
            });
            const data = response.data;
            setBooks(Array.isArray(data.content) ? data.content : []);
            setTotalPages(typeof data.totalPages === 'number' ? data.totalPages : 1);
        } catch (e) {
            setError('데이터를 불러오는 데 실패했습니다.');
            setBooks([]);
            setTotalPages(1);
        }
    }, [debouncedSearch, sortField, sortOrder, page]);

    useEffect(() => {
        fetchBooks();
    }, [fetchBooks]);

    const handleSort = (field) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
    };

    const getSortIcon = (field) => {
        if (sortField !== field) return null;
        return sortOrder === 'asc'
            ? <ArrowUp className="w-4 h-4 text-cyan-600" />
            : <ArrowDown className="w-4 h-4 text-cyan-600" />;
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* 관리자 로그인 버튼 */}
            <button
                onClick={() => navigate('/admin/login')}
                className="absolute top-4 right-4 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md"
            >
                관리자 로그인
            </button>

            <h1 className="text-3xl font-semibold text-center mb-6 text-cyan-700">📚 도서 검색</h1>

            <input
                type="text"
                placeholder="제목, 저자, 출판사로 검색하세요"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg mb-6 focus:outline-none focus:ring-2 focus:ring-cyan-600"
            />

            {error && (
                <div className="text-red-600 mb-4 text-center">{error}</div>
            )}

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead>
                    <tr className="bg-gray-100 text-left text-gray-700">
                        {['title', 'author', 'publisher', 'year'].map((field) => (
                            <th
                                key={field}
                                className="px-4 py-3 cursor-pointer select-none"
                                onClick={() => handleSort(field)}
                            >
                                <div className="flex items-center gap-1">
                                    {{
                                        title: '제목',
                                        author: '저자',
                                        publisher: '출판사',
                                        year: '출간년도',
                                    }[field]}
                                    {getSortIcon(field)}
                                </div>
                            </th>
                        ))}
                        <th className="px-4 py-3">대출 여부</th>
                    </tr>
                    </thead>
                    <tbody>
                    {books.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="text-center px-4 py-6 text-gray-500">
                                검색 결과가 없습니다.
                            </td>
                        </tr>
                    ) : (
                        books.map((book) => (
                            <tr
                                key={book.id}
                                className="border-t border-gray-200 hover:bg-gray-50 text-gray-800"
                            >
                                <td className="px-4 py-3">{book.title}</td>
                                <td className="px-4 py-3">{book.author}</td>
                                <td className="px-4 py-3">{book.publisher}</td>
                                <td className="px-4 py-3">{book.year}</td>
                                <td className="px-4 py-3">
                                        <span
                                            className={`px-2 py-1 rounded-full text-sm font-medium ${
                                                book.available
                                                    ? 'bg-cyan-100 text-cyan-700'
                                                    : 'bg-gray-200 text-gray-500'
                                            }`}
                                        >
                                            {book.available ? '가능' : '불가'}
                                        </span>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

            {/* 페이지네이션 */}
            <div className="flex justify-center mt-6 space-x-2">
                {[...Array(totalPages)].map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setPage(i + 1)}
                        className={`px-4 py-2 rounded-md text-sm font-semibold ${
                            page === i + 1
                                ? 'bg-cyan-600 text-white'
                                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                        }`}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default BookSearchPage;
