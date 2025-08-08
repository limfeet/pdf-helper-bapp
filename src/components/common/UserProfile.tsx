'use client';

import { User, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface UserProfileProps {
  userName?: string;
  userRole?: string;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  onLogoutClick?: () => void;
}

export function UserProfile({
  userName,
  userRole,
  onProfileClick,
  onSettingsClick,
  onLogoutClick
}: UserProfileProps) {
  const { user, signOut } = useAuth();
  const router = useRouter();

  console.log('🔍 UserProfile 렌더링됨');
  console.log('👤 user:', user);
  console.log('🔧 signOut 함수:', typeof signOut);

  // Firebase 사용자 정보 우선 사용
  const displayName = userName || user?.displayName || user?.email || "Guest";
  const displayRole = userRole || "User";

  const handleLogout = async () => {
    console.log('🔥 로그아웃 시작');
    
    try {
      // 사용자 정의 로그아웃 함수가 있으면 실행
      if (onLogoutClick) {
        console.log('📞 사용자 정의 로그아웃 함수 실행');
        onLogoutClick();
      }
      
      console.log('🚪 Firebase signOut 시작');
      // Firebase 로그아웃
      await signOut();
      console.log('✅ Firebase signOut 완료');
      
      console.log('🔄 로그인 페이지로 리다이렉트');
      // 로그인 페이지로 리다이렉트
      router.push('/login');
    } catch (error) {
      console.error('❌ 로그아웃 중 오류:', error);
    }
  };

  const handleProfileClick = () => {
    if (onProfileClick) {
      onProfileClick();
    } else {
      // 기본 동작: 프로필 페이지로 이동
      router.push('/profile');
    }
  };

  const handleSettingsClick = () => {
    if (onSettingsClick) {
      onSettingsClick();
    } else {
      // 기본 동작: 설정 페이지로 이동
      router.push('/settings');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 px-3">
          <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center overflow-hidden">
            {user?.photoURL ? (
              <Image 
                src={user.photoURL} 
                alt="Profile" 
                width={32}
                height={32}
                className="rounded-full object-cover"
                unoptimized // Google 프로필 이미지는 외부 도메인이므로
              />
            ) : (
              <User className="h-4 w-4" />
            )}
          </div>
          <div className="hidden md:flex flex-col items-start">
            <span className="text-sm font-medium">{displayName}</span>
            <span className="text-xs text-muted-foreground">{displayRole}</span>
          </div>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleProfileClick}>
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSettingsClick}>
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => {
          console.log('🎯 Log out 버튼 클릭됨!');
          handleLogout();
        }}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}