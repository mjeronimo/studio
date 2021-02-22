// Tells TypeScript how to treat file types that we import specially with WebPack loaders
// (see webpack.renderer.ts for details) 
declare module "*.bag" {
    const content: string;
    export default content;
}
declare module "*.bin" {
    const content: string;
    export default content;
}
declare module "*.md" {
    const content: string;
    export default content;
}
declare module "*.png" {
    const Path: string;
    export default Path;
}
declare module "*.module.scss" {
    const classes: { [key: string]: string };
    export default classes;
}
declare module "*.glb" {
    const content: string;
    export default content;
}