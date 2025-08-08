// lib/firebase.ts
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, Auth } from 'firebase/auth';

// 개발환경에서 사용할 더미 설정
const isDevelopment = process.env.NODE_ENV === 'development';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || (isDevelopment ? 'dev-dummy-key' : ''),
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || (isDevelopment ? 'dev-dummy-domain.firebaseapp.com' : ''),
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || (isDevelopment ? 'dev-dummy-project' : ''),
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || (isDevelopment ? 'dev-dummy-bucket.appspot.com' : ''),
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || (isDevelopment ? '123456789' : ''),
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || (isDevelopment ? '1:123456789:web:dummy-app-id' : ''),
};

// 타입 명시적 선언
let app: ReturnType<typeof initializeApp> | null = null;
let auth: Auth | null = null;
let googleProvider: GoogleAuthProvider | null = null;

try {
  // Initialize Firebase (중복 초기화 방지)
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
  
  // Google Provider 설정
  googleProvider.setCustomParameters({
    prompt: 'select_account'
  });
} catch (error) {
  console.warn('Firebase 초기화 실패 (개발환경에서는 정상):', error);
  
  // 개발환경에서는 null로 유지 (AuthContext에서 처리)
  if (isDevelopment) {
    console.log('개발환경 - Firebase Auth는 AuthContext에서 처리됩니다');
  }
}

export { auth, googleProvider };
export default app;