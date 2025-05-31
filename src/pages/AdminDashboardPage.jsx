import React from "react";

export default function AdminDashboardPage() {
    return (
        <div className="min-h-screen p-8 bg-gray-50">
            <h1 className="mb-10 text-4xl font-bold text-center text-blue-600">관리자 대시보드</h1>

            {/* 사용자 관리 */}
            <section className="mb-12">
                <h2 className="mb-4 text-2xl font-semibold text-blue-600">사용자 관리</h2>
                <div className="flex flex-wrap gap-4">
                    <button className="px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition">
                        사용자 등록
                    </button>
                    <button className="px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition">
                        사용자 수정
                    </button>
                    <button className="px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition">
                        사용자 대출 현황 조회
                    </button>
                </div>
            </section>

            {/* 도서 관리 */}
            <section className="mb-12">
                <h2 className="mb-4 text-2xl font-semibold text-blue-600">도서 관리</h2>
                <div className="flex flex-wrap gap-4">
                    <button className="px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition">
                        도서 등록
                    </button>
                    <button className="px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition">
                        도서 수정
                    </button>
                    <button className="px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition">
                        도서 조회 (대출 현황 및 이력)
                    </button>
                </div>
            </section>

            {/* 대출/반납 관리 */}
            <section>
                <h2 className="mb-4 text-2xl font-semibold text-blue-600">대출/반납 관리</h2>
                <div className="flex flex-wrap gap-4">
                    <button className="px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition">
                        대출 처리 (도서 번호 + 사용자 번호)
                    </button>
                    <button className="px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition">
                        반납 처리 (도서 번호 + 사용자 번호)
                    </button>
                </div>
            </section>
        </div>
    );
}
