interface StepKeys {
    altKey: boolean;
    downKey: boolean;
    shiftKey: boolean;
    upKey: boolean;
}
/**
 * @hidden
 */
export declare function getStepForKey(baseStep: number, keys: StepKeys): number;
/**
 * @hidden
 */
export declare function getVerticalStepKeys(ev: KeyboardEvent): StepKeys;
/**
 * @hidden
 */
export declare function getHorizontalStepKeys(ev: KeyboardEvent): StepKeys;
/**
 * @hidden
 */
export declare function isVerticalArrowKey(key: string): boolean;
/**
 * @hidden
 */
export declare function isArrowKey(key: string): boolean;
export {};
