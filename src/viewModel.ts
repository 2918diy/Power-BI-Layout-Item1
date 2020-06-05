import powerbiVisualsApi from "powerbi-visuals-api";
import powerbi = powerbiVisualsApi;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisualHost = powerbi.extensibility.visual.IVisualHost;

import {LayoutSetting, applyLayoutSettings} from "./viewSettings"


/**
 * Interface for the view model.
 *
 * @interface
 * @property {LayoutSettings} layoutSettings    - Settings for data points.
 */
export interface LayoutViewModel {
    layoutSettings: LayoutSetting;
}


export function visualTransform(options: VisualUpdateOptions, host: IVisualHost):LayoutViewModel{


    return {
        layoutSettings: applyLayoutSettings(options,host)
    };
}




