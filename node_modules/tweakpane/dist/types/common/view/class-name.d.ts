/**
 * A utility function for generating BEM-like class name.
 * @param viewName The name of the view. Used as part of the block name.
 * @return A class name generator function.
 */
export declare function ClassName(viewName: string): (opt_elementName?: string | undefined, opt_modifier?: string | undefined) => string;
