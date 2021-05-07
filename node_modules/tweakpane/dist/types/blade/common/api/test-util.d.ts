import { View } from '../../../common/view/view';
import { BladeController } from '../controller/blade';
import { BladeApi } from './blade';
export declare function assertInitialState(api: BladeApi<BladeController<View>>): void;
export declare function assertDisposes(api: BladeApi<BladeController<View>>): void;
export declare function assertUpdates(api: BladeApi<BladeController<View>>): void;
