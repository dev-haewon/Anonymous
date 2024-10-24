/* eslint-disable @typescript-eslint/no-explicit-any */
// src/types/velocity-animate.d.ts
declare module 'velocity-animate' {
    export interface VelocityOptions {
        duration?: number;
        complete?: () => void;
        [key: string]: any; // 추가적인 옵션들 허용
    }

    export interface AnimationProperties {
        [property: string]: any; // 애니메이션 속성들 허용
    }

    function Velocity(
        elements: HTMLElement | HTMLElement[],
        animation: AnimationProperties | string,
        options?: VelocityOptions
    ): Promise<void>;

    export default Velocity;
}
