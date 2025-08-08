"use client"

import * as React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCards } from "@/components/features/dashboard/StatsCards";
import { FileUploadZone } from "@/components/features/file-management/FileUploadZone";
import { FileTable } from "@/components/features/file-management/FileTable";
import { ChatInterface } from "@/components/features/chat/ChatInterface";
import { mockFiles, mockChatMessages, navigationItems } from "@/lib/mock-data";
import { FileItem, ChatMessage } from "@/types";

/**
* 메인 대시보드 페이지 컴포넌트
* 
* 주요 기능:
* 1. PDF 파일 업로드 및 관리
* 2. 파일 목록 표시 및 조작 (보기/다운로드/삭제)
* 3. AI 채팅 인터페이스로 문서 질의응답
* 4. 사용자 통계 정보 표시
*/
export default function Dashboard() {
 // === 상태 관리 ===
 
 /**
  * 업로드된 파일 목록 상태
  * FileItem[] 타입으로 파일 정보(이름, 크기, 상태 등)를 관리
  */
 const [files, setFiles] = React.useState<FileItem[]>(mockFiles);
 
 /**
  * 채팅 메시지 목록 상태
  * 사용자와 AI 어시스턴트 간의 대화 기록을 관리
  */
 const [chatMessages, setChatMessages] = React.useState<ChatMessage[]>(mockChatMessages);
 
 /**
  * 컴포넌트 마운트 상태
  * 서버사이드 렌더링과 클라이언트 렌더링 간의 불일치를 방지
  * (hydration mismatch 방지용)
  */
 const [mounted, setMounted] = React.useState(false);

 // === 생명주기 관리 ===
 
 /**
  * 컴포넌트가 마운트된 후 실행
  * 클라이언트에서만 렌더링되도록 보장
  */
 React.useEffect(() => {
   setMounted(true);
 }, []);

 // === 파일 관련 이벤트 핸들러 ===
 
 /**
  * 파일 선택/업로드 처리
  * @param fileList - 사용자가 선택한 파일들 (FileList 객체)
  * 
  * 실제 구현 시:
  * - 파일 유효성 검사 (크기, 형식)
  * - 서버로 파일 업로드
  * - 업로드 진행률 표시
  * - 파일 목록 상태 업데이트
  */
 const handleFileSelect = (fileList: FileList) => {
   console.log("Files selected:", fileList);
   // TODO: 실제 파일 업로드 로직 구현
   // - FormData 생성
   // - API 엔드포인트로 POST 요청
   // - 업로드 성공 시 files 상태 업데이트
 };

 /**
  * 파일 미리보기/열기 처리
  * @param file - 보려는 파일 정보 (FileItem 객체)
  * 
  * 실제 구현 시:
  * - PDF 뷰어 모달 열기
  * - 또는 새 탭에서 파일 열기
  */
 const handleFileView = (file: FileItem) => {
   console.log("View file:", file.name);
   // TODO: 파일 뷰어 구현
   // - PDF.js 등을 사용한 인라인 뷰어
   // - 또는 브라우저 기본 PDF 뷰어 활용
 };

 /**
  * 파일 다운로드 처리
  * @param file - 다운로드할 파일 정보 (FileItem 객체)
  * 
  * 실제 구현 시:
  * - 서버에서 파일 URL 가져오기
  * - 브라우저 다운로드 트리거
  */
 const handleFileDownload = (file: FileItem) => {
   console.log("Download file:", file.name);
   // TODO: 파일 다운로드 구현
   // - 서버 API 호출로 다운로드 URL 생성
   // - window.open() 또는 <a> 태그로 다운로드 실행
 };

 /**
  * 파일 삭제 처리
  * @param file - 삭제할 파일 정보 (FileItem 객체)
  * 
  * 현재: 로컬 상태에서만 제거
  * 실제 구현 시: 서버에서도 파일 삭제 필요
  */
 const handleFileDelete = (file: FileItem) => {
   console.log("Delete file:", file.name);
   // 로컬 상태에서 해당 파일 제거
   setFiles(files.filter(f => f.id !== file.id));
   // TODO: 서버에서도 파일 삭제
   // - DELETE API 호출
   // - 성공 시에만 로컬 상태 업데이트
 };

 // === 채팅 관련 이벤트 핸들러 ===
 
 /**
  * 사용자 메시지 전송 처리
  * @param message - 사용자가 입력한 메시지 텍스트
  * 
  * 플로우:
  * 1. 사용자 메시지를 채팅 목록에 추가
  * 2. AI API 호출하여 응답 생성
  * 3. AI 응답을 채팅 목록에 추가
  */
 const handleSendMessage = (message: string) => {
   // 1. 사용자 메시지 객체 생성
   const newMessage: ChatMessage = {
     id: chatMessages.length + 1,           // 고유 ID (실제로는 UUID 등 사용 권장)
     type: "user",                          // 메시지 타입: 사용자
     message,                               // 메시지 내용
     timestamp: new Date().toLocaleTimeString([], { 
       hour: '2-digit', 
       minute: '2-digit' 
     })
   };
   
   // 2. 채팅 목록에 사용자 메시지 추가
   setChatMessages([...chatMessages, newMessage]);
   
   // 3. AI 응답 시뮬레이션 (실제로는 API 호출)
   setTimeout(() => {
     const aiResponse: ChatMessage = {
       id: chatMessages.length + 2,
       type: "assistant",                    // 메시지 타입: AI 어시스턴트
       message: "I'm processing your question about the documents...",
       timestamp: new Date().toLocaleTimeString([], { 
         hour: '2-digit', 
         minute: '2-digit' 
       })
     };
     
     // 이전 메시지들 + 새 AI 응답 추가
     setChatMessages(prev => [...prev, aiResponse]);
   }, 1000);
   
   // TODO: 실제 AI API 호출 구현
   // - OpenAI, Anthropic 등의 API 호출
   // - 업로드된 문서 컨텍스트와 함께 질문 전송
   // - 스트리밍 응답 처리
 };

 // === 검색 관련 이벤트 핸들러 ===
 
 /**
  * 전역 검색 처리
  * @param query - 검색어
  * 
  * 실제 구현 시:
  * - 파일 이름, 내용으로 검색
  * - 검색 결과 필터링
  * - 검색 히스토리 저장
  */
 const handleSearch = (query: string) => {
   console.log("Search query:", query);
   // TODO: 검색 기능 구현
   // - 파일 메타데이터 검색
   // - 파일 내용 전문 검색 (서버 API 필요)
   // - 검색 결과로 files 상태 필터링
 };

 // === 렌더링 조건부 처리 ===
 
 /**
  * 컴포넌트가 아직 마운트되지 않았으면 null 반환
  * 이는 서버사이드 렌더링과 클라이언트 렌더링 간의 차이를 방지
  * (Next.js의 hydration 과정에서 발생할 수 있는 불일치 해결)
  */
 if (!mounted) {
   return null;
 }

 // === 메인 렌더링 ===
 return (
   <DashboardLayout 
     navigationItems={navigationItems}  // 사이드바 네비게이션 아이템들
     onSearch={handleSearch}            // 검색 기능 콜백
   >
     {/* === 상단 통계 카드 영역 === */}
     {/* 파일 수, 처리 상태, 사용량 등의 요약 정보 표시 */}
     <StatsCards />

     {/* === 메인 콘텐츠 그리드 레이아웃 === */}
     {/* 
       lg:grid-cols-3: 큰 화면에서 3열 그리드
       - 왼쪽 2열: 파일 업로드 및 관리
       - 오른쪽 1열: 채팅 인터페이스
     */}
     <div className="grid gap-4 lg:grid-cols-3">
       
       {/* === 왼쪽 열: 파일 관리 영역 (2/3 너비) === */}
       <div className="lg:col-span-2 space-y-4">
         
         {/* 파일 업로드 드롭존 */}
         {/* 
           드래그 앤 드롭으로 파일 업로드 가능한 영역
           onFileSelect: 파일이 선택되었을 때 호출될 콜백 함수
         */}
         <FileUploadZone onFileSelect={handleFileSelect} />

         {/* 파일 목록 테이블 */}
         {/* 
           업로드된 파일들을 테이블 형태로 표시
           각 파일별로 보기/다운로드/삭제 액션 제공
         */}
         <FileTable 
           files={files}                     // 표시할 파일 목록
           onView={handleFileView}           // 파일 보기 콜백
           onDownload={handleFileDownload}   // 파일 다운로드 콜백
           onDelete={handleFileDelete}       // 파일 삭제 콜백
         />
       </div>

       {/* === 오른쪽 열: 채팅 영역 (1/3 너비) === */}
       <div className="lg:col-span-1">
         {/* 
           AI 채팅 인터페이스
           업로드된 문서에 대해 질문하고 답변을 받을 수 있는 영역
         */}
         <ChatInterface 
           messages={chatMessages}        // 표시할 채팅 메시지 목록
           onSendMessage={handleSendMessage} // 메시지 전송 콜백
         />
       </div>
     </div>
   </DashboardLayout>
 );
}