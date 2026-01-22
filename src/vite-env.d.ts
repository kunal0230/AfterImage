/// <reference types="vite/client" />
/// <reference types="vite-plugin-glsl/ext" />

declare module '*.glsl' {
    const value: string;
    export default value;
}
