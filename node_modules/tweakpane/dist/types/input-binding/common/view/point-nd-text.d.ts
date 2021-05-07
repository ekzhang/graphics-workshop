import { NumberTextView } from '../../../common/number/view/number-text';
import { View } from '../../../common/view/view';
interface Config {
    textViews: NumberTextView[];
}
/**
 * @hidden
 */
export declare class PointNdTextView implements View {
    readonly element: HTMLElement;
    readonly textViews: NumberTextView[];
    constructor(doc: Document, config: Config);
}
export {};
