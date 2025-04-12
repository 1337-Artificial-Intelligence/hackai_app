import { Engine } from "@tsparticles/engine";
import Particles from "./Particles";
export type { IParticlesProps, } from "./IParticlesProps";
export declare function initParticlesEngine(cb: (engine: Engine) => Promise<void>): Promise<void>;
export default Particles;
export { Particles };
