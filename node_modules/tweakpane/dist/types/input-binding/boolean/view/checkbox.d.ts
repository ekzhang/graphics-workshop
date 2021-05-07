import { Value } from '../../../common/model/value';
import { ViewProps } from '../../../common/model/view-props';
import { View } from '../../../common/view/view';
interface Config {
    value: Value<boolean>;
    viewProps: ViewProps;
}
/**
 * @hidden
 */
export declare class CheckboxView implements View {
    readonly element: HTMLElement;
    readonly inputElement: HTMLInputElement;
    readonly value: Value<boolean>;
    constructor(doc: Document, config: Config);
    private update_;
    private onValueChange_;
}
export {};
