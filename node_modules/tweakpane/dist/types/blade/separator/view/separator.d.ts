import { ViewProps } from '../../../common/model/view-props';
import { View } from '../../../common/view/view';
interface Config {
    viewProps: ViewProps;
}
/**
 * @hidden
 */
export declare class SeparatorView implements View {
    readonly element: HTMLElement;
    constructor(doc: Document, config: Config);
}
export {};
