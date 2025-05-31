/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",  // React 컴포넌트 파일 경로
        "./public/index.html"
    ],
    theme: {
        extend: {
            colors: {
                "main-color": "#2563EB",  // 파란색 (원하는 색으로 변경 가능)
                "bg-color": "#F3F4F6"     // 밝은 회색 배경
            }
        }
    },
    plugins: []
}
