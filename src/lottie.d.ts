declare module 'lottie-web' {
  export interface AnimationItem {
    play(): void;
    pause(): void;
    stop(): void;
    setSpeed(speed: number): void;
    setDirection(direction: number): void;
    goToAndStop(value: number, isFrame?: boolean): void;
    goToAndPlay(value: number, isFrame?: boolean): void;
    setSubframe(useSubFrames: boolean): void;
    destroy(): void;
    getDuration(inFrames?: boolean): number;
    totalFrames: number;
    currentFrame: number;
    isPaused: boolean;
    playDirection: number;
    playSpeed: number;
  }

  export interface AnimationConfigWithPath {
    container: Element;
    renderer?: 'svg' | 'canvas' | 'html';
    loop?: boolean | number;
    autoplay?: boolean;
    path: string;
    rendererSettings?: any;
  }

  export interface AnimationConfigWithData {
    container: Element;
    renderer?: 'svg' | 'canvas' | 'html';
    loop?: boolean | number;
    autoplay?: boolean;
    animationData: any;
    rendererSettings?: any;
  }

  export type AnimationConfig = AnimationConfigWithPath | AnimationConfigWithData;

  export function loadAnimation(config: AnimationConfig): AnimationItem;
  export function destroy(): void;
  export function registerAnimation(element: Element, animationData?: any): AnimationItem;
  export function searchAnimations(animationData?: any, standalone?: boolean, renderer?: string): void;
}