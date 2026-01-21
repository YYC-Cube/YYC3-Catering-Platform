/**
 * @file 多端适配策略
 * @description 实现Web端、移动端、小程序等多终端的一致用户体验
 * @module integration
 * @author YYC³
 * @version 1.0.0
 * @created 2026-01-21
 */

import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * 设备类型枚举
 */
export enum DeviceType {
  DESKTOP = 'desktop',
  TABLET = 'tablet',
  MOBILE = 'mobile',
  UNKNOWN = 'unknown',
}

/**
 * 屏幕断点
 */
export const BREAKPOINTS = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

/**
 * 响应式断点类型
 */
export type Breakpoint = keyof typeof BREAKPOINTS;

/**
 * 设备信息接口
 */
export interface DeviceInfo {
  type: DeviceType;
  width: number;
  height: number;
  orientation: 'portrait' | 'landscape';
  isTouch: boolean;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  pixelRatio: number;
}

/**
 * 平台信息接口
 */
export interface PlatformInfo {
  name: 'web' | 'mobile' | 'miniprogram' | 'app';
  os: 'ios' | 'android' | 'windows' | 'macos' | 'linux' | 'unknown';
  browser: 'chrome' | 'safari' | 'firefox' | 'edge' | 'unknown';
  version: string;
}

/**
 * 响应式配置接口
 */
export interface ResponsiveConfig {
  xs?: any;
  sm?: any;
  md?: any;
  lg?: any;
  xl?: any;
  '2xl'?: any;
}

/**
 * 获取设备类型
 */
export function getDeviceType(width: number): DeviceType {
  if (width < BREAKPOINTS.sm) {
    return DeviceType.MOBILE;
  } else if (width < BREAKPOINTS.lg) {
    return DeviceType.TABLET;
  } else {
    return DeviceType.DESKTOP;
  }
}

/**
 * 获取设备信息
 */
export function getDeviceInfo(): DeviceInfo {
  if (typeof window === 'undefined') {
    return {
      type: DeviceType.UNKNOWN,
      width: 0,
      height: 0,
      orientation: 'portrait',
      isTouch: false,
      isMobile: false,
      isTablet: false,
      isDesktop: false,
      pixelRatio: 1,
    };
  }

  const width = window.innerWidth;
  const height = window.innerHeight;
  const type = getDeviceType(width);
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  return {
    type,
    width,
    height,
    orientation: width > height ? 'landscape' : 'portrait',
    isTouch,
    isMobile: type === DeviceType.MOBILE,
    isTablet: type === DeviceType.TABLET,
    isDesktop: type === DeviceType.DESKTOP,
    pixelRatio: window.devicePixelRatio || 1,
  };
}

/**
 * 获取平台信息
 */
export function getPlatformInfo(): PlatformInfo {
  if (typeof window === 'undefined') {
    return {
      name: 'web',
      os: 'unknown',
      browser: 'unknown',
      version: '',
    };
  }

  const userAgent = navigator.userAgent.toLowerCase();
  let name: PlatformInfo['name'] = 'web';
  let os: PlatformInfo['os'] = 'unknown';
  let browser: PlatformInfo['browser'] = 'unknown';
  let version = '';

  if (/miniprogram/i.test(userAgent)) {
    name = 'miniprogram';
  } else if (/android/i.test(userAgent)) {
    os = 'android';
  } else if (/iphone|ipad|ipod/i.test(userAgent)) {
    os = 'ios';
  } else if (/windows/i.test(userAgent)) {
    os = 'windows';
  } else if (/macintosh|mac os x/i.test(userAgent)) {
    os = 'macos';
  } else if (/linux/i.test(userAgent)) {
    os = 'linux';
  }

  if (/chrome/i.test(userAgent) && !/edge|opr|brave/i.test(userAgent)) {
    browser = 'chrome';
    const match = userAgent.match(/chrome\/(\d+\.\d+\.\d+\.\d+)/);
    version = match ? match[1] : '';
  } else if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) {
    browser = 'safari';
    const match = userAgent.match(/version\/(\d+\.\d+\.\d+)/);
    version = match ? match[1] : '';
  } else if (/firefox/i.test(userAgent)) {
    browser = 'firefox';
    const match = userAgent.match(/firefox\/(\d+\.\d+)/);
    version = match ? match[1] : '';
  } else if (/edge/i.test(userAgent)) {
    browser = 'edge';
    const match = userAgent.match(/edge\/(\d+\.\d+\.\d+\.\d+)/);
    version = match ? match[1] : '';
  }

  return {
    name,
    os,
    browser,
    version,
  };
}

/**
 * React Hook - 使用设备信息
 */
export function useDeviceInfo() {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(getDeviceInfo());

  useEffect(() => {
    const handleResize = () => {
      setDeviceInfo(getDeviceInfo());
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return deviceInfo;
}

/**
 * React Hook - 使用平台信息
 */
export function usePlatformInfo() {
  const [platformInfo, setPlatformInfo] = useState<PlatformInfo>(getPlatformInfo());

  useEffect(() => {
    setPlatformInfo(getPlatformInfo());
  }, []);

  return platformInfo;
}

/**
 * React Hook - 使用响应式断点
 */
export function useBreakpoint(): Breakpoint {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('lg');

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;

      if (width < BREAKPOINTS.sm) {
        setBreakpoint('xs');
      } else if (width < BREAKPOINTS.md) {
        setBreakpoint('sm');
      } else if (width < BREAKPOINTS.lg) {
        setBreakpoint('md');
      } else if (width < BREAKPOINTS.xl) {
        setBreakpoint('lg');
      } else if (width < BREAKPOINTS['2xl']) {
        setBreakpoint('xl');
      } else {
        setBreakpoint('2xl');
      }
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);

    return () => {
      window.removeEventListener('resize', updateBreakpoint);
    };
  }, []);

  return breakpoint;
}

/**
 * React Hook - 使用响应式值
 */
export function useResponsive<T>(config: ResponsiveConfig): T | undefined {
  const breakpoint = useBreakpoint();

  const getValue = useCallback((): T | undefined => {
    const breakpoints: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
    const currentIndex = breakpoints.indexOf(breakpoint);

    for (let i = currentIndex; i >= 0; i--) {
      const bp = breakpoints[i];
      if (config[bp] !== undefined) {
        return config[bp] as T;
      }
    }

    return undefined;
  }, [breakpoint, config]);

  return getValue();
}

/**
 * React Hook - 使用媒体查询
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener('change', handler);

    return () => {
      mediaQuery.removeEventListener('change', handler);
    };
  }, [query]);

  return matches;
}

/**
 * React Hook - 使用触摸手势
 */
export function useTouchGesture(
  ref: React.RefObject<HTMLElement>,
  callbacks: {
    onSwipeLeft?: () => void;
    onSwipeRight?: () => void;
    onSwipeUp?: () => void;
    onSwipeDown?: () => void;
    onTap?: () => void;
    onLongPress?: () => void;
  }
) {
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      };

      if (callbacks.onLongPress) {
        longPressTimerRef.current = setTimeout(() => {
          callbacks.onLongPress!();
        }, 500);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }

      const touch = e.changedTouches[0];
      const start = touchStartRef.current;

      if (!start) return;

      const deltaX = touch.clientX - start.x;
      const deltaY = touch.clientY - start.y;
      const deltaTime = Date.now() - start.time;

      const minSwipeDistance = 50;
      const maxSwipeTime = 300;

      if (Math.abs(deltaX) < minSwipeDistance && Math.abs(deltaY) < minSwipeDistance) {
        if (deltaTime < maxSwipeTime && callbacks.onTap) {
          callbacks.onTap();
        }
        return;
      }

      if (deltaTime > maxSwipeTime) return;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > minSwipeDistance && callbacks.onSwipeRight) {
          callbacks.onSwipeRight();
        } else if (deltaX < -minSwipeDistance && callbacks.onSwipeLeft) {
          callbacks.onSwipeLeft();
        }
      } else {
        if (deltaY > minSwipeDistance && callbacks.onSwipeDown) {
          callbacks.onSwipeDown();
        } else if (deltaY < -minSwipeDistance && callbacks.onSwipeUp) {
          callbacks.onSwipeUp();
        }
      }
    };

    element.addEventListener('touchstart', handleTouchStart);
    element.addEventListener('touchmove', handleTouchMove);
    element.addEventListener('touchend', handleTouchEnd);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [ref, callbacks]);
}

/**
 * 响应式工具函数
 */
export const responsive = {
  isMobile: () => window.innerWidth < BREAKPOINTS.md,
  isTablet: () => window.innerWidth >= BREAKPOINTS.md && window.innerWidth < BREAKPOINTS.lg,
  isDesktop: () => window.innerWidth >= BREAKPOINTS.lg,
  isPortrait: () => window.innerHeight > window.innerWidth,
  isLandscape: () => window.innerWidth > window.innerHeight,
};

/**
 * 平台适配器
 */
export class PlatformAdapter {
  private platformInfo: PlatformInfo;
  private deviceInfo: DeviceInfo;

  constructor() {
    this.platformInfo = getPlatformInfo();
    this.deviceInfo = getDeviceInfo();
  }

  isWeb(): boolean {
    return this.platformInfo.name === 'web';
  }

  isMobile(): boolean {
    return this.platformInfo.name === 'mobile';
  }

  isMiniProgram(): boolean {
    return this.platformInfo.name === 'miniprogram';
  }

  isIOS(): boolean {
    return this.platformInfo.os === 'ios';
  }

  isAndroid(): boolean {
    return this.platformInfo.os === 'android';
  }

  isTouchDevice(): boolean {
    return this.deviceInfo.isTouch;
  }

  getViewport(): { width: number; height: number } {
    return {
      width: this.deviceInfo.width,
      height: this.deviceInfo.height,
    };
  }

  getSafeArea(): { top: number; bottom: number; left: number; right: number } {
    if (typeof window === 'undefined') {
      return { top: 0, bottom: 0, left: 0, right: 0 };
    }

    const safeArea = (window as any).visualViewport;

    if (safeArea) {
      return {
        top: safeArea.offsetTop || 0,
        bottom: window.innerHeight - (safeArea.offsetTop + safeArea.height) || 0,
        left: safeArea.offsetLeft || 0,
        right: window.innerWidth - (safeArea.offsetLeft + safeArea.width) || 0,
      };
    }

    return { top: 0, bottom: 0, left: 0, right: 0 };
  }

  openURL(url: string): void {
    if (this.isMiniProgram()) {
      (window as any).wx.navigateTo({
        url,
      });
    } else {
      window.open(url, '_blank');
    }
  }

  share(content: { title: string; description: string; url: string }): void {
    if (this.isMiniProgram()) {
      (window as any).wx.shareAppMessage({
        title: content.title,
        path: content.url,
      });
    } else if (navigator.share) {
      navigator.share({
        title: content.title,
        text: content.description,
        url: content.url,
      });
    }
  }

  copyToClipboard(text: string): Promise<boolean> {
    if (navigator.clipboard) {
      return navigator.clipboard.writeText(text)
        .then(() => true)
        .catch(() => false);
    }

    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();

    try {
      document.execCommand('copy');
      document.body.removeChild(textarea);
      return Promise.resolve(true);
    } catch {
      document.body.removeChild(textarea);
      return Promise.resolve(false);
    }
  }

  vibrate(pattern: number | number[]): void {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  }

  requestNotificationPermission(): Promise<NotificationPermission> {
    if ('Notification' in window) {
      return Notification.requestPermission();
    }

    return Promise.resolve('denied');
  }

  showNotification(title: string, options?: NotificationOptions): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, options);
    }
  }
}

/**
 * 创建全局平台适配器实例
 */
export const platformAdapter = new PlatformAdapter();

/**
 * React Hook - 使用平台适配器
 */
export function usePlatformAdapter(): PlatformAdapter {
  return platformAdapter;
}

/**
 * 响应式样式生成器
 */
export function createResponsiveStyles<T extends Record<string, any>>(
  baseStyles: T,
  responsiveStyles: Partial<Record<Breakpoint, Partial<T>>>
): (breakpoint: Breakpoint) => T {
  return (breakpoint: Breakpoint): T => {
    const breakpoints: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
    const currentIndex = breakpoints.indexOf(breakpoint);

    let mergedStyles = { ...baseStyles };

    for (let i = currentIndex; i >= 0; i--) {
      const bp = breakpoints[i];
      if (responsiveStyles[bp]) {
        mergedStyles = {
          ...mergedStyles,
          ...responsiveStyles[bp],
        };
      }
    }

    return mergedStyles;
  };
}

/**
 * 导出所有多端适配功能
 */
export default {
  DeviceType,
  BREAKPOINTS,
  getDeviceInfo,
  getPlatformInfo,
  useDeviceInfo,
  usePlatformInfo,
  useBreakpoint,
  useResponsive,
  useMediaQuery,
  useTouchGesture,
  responsive,
  PlatformAdapter,
  platformAdapter,
  usePlatformAdapter,
  createResponsiveStyles,
};
