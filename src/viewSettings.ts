import powerbiVisualsApi from "powerbi-visuals-api";
import powerbi = powerbiVisualsApi;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisualHost = powerbi.extensibility.visual.IVisualHost;
import ISandboxExtendedColorPalette = powerbi.extensibility.ISandboxExtendedColorPalette;

import { getValue,getFillColor} from "./objectEnumerationUtility";



/**
 * Interface for Chart settings.
 *
 * @interface
 * @property {} layoutSetting 
 */
export interface LayoutSetting {

    layoutSetting: {
        opcty: number;
        borderWidth: number;
        gridGap:number;
    }

};


export function applyLayoutSettings(options: VisualUpdateOptions, host: IVisualHost):LayoutSetting{
    let dataViews = options.dataViews;
    let objects = dataViews[0].metadata.objects;
    let defaultSettings: LayoutSetting = {
        layoutSetting: {
            opcty: 5,
            borderWidth: 2,
            gridGap:10
        }
    };
    let layoutSetting: LayoutSetting = {
        layoutSetting: {
            opcty: getValue<number>(objects, 'layoutSetting', 'opcty', defaultSettings.layoutSetting.opcty),
            borderWidth: getValue<number>(objects, 'layoutSetting', 'borderWidth', defaultSettings.layoutSetting.borderWidth),
            gridGap: getValue<number>(objects, 'layoutSetting', 'gridGap', defaultSettings.layoutSetting.gridGap)
        }
    };
    return layoutSetting
}
