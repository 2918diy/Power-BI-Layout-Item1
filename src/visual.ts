import "./../style/visual.less";
import {
    event as d3Event,
    select as d3Select
} from "d3-selection";
import {
    scaleLinear,
    scaleBand
} from "d3-scale";
import * as d3 from "d3"

import { axisBottom,axisTop } from "d3-axis";

import powerbiVisualsApi from "powerbi-visuals-api";
import powerbi = powerbiVisualsApi;

type Selection<T1, T2 = T1> = d3.Selection<any, T1, any, T2>;
import ScaleLinear = d3.ScaleLinear;
const getEvent = () => require("d3-selection").event;

// powerbi.visuals
import DataViewCategoryColumn = powerbi.DataViewCategoryColumn;
import DataViewObjects = powerbi.DataViewObjects;
import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
import Fill = powerbi.Fill;
import ISandboxExtendedColorPalette = powerbi.extensibility.ISandboxExtendedColorPalette;
import ISelectionId = powerbi.visuals.ISelectionId;
import ISelectionManager = powerbi.extensibility.ISelectionManager;
import IVisual = powerbi.extensibility.IVisual;
import IVisualEventService = powerbi.extensibility.IVisualEventService;
import IVisualHost = powerbi.extensibility.visual.IVisualHost;
import PrimitiveValue = powerbi.PrimitiveValue;
import VisualObjectInstance = powerbi.VisualObjectInstance;
import VisualObjectInstanceEnumeration = powerbi.VisualObjectInstanceEnumeration;
import VisualTooltipDataItem = powerbi.extensibility.VisualTooltipDataItem;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;

// powerbi.extensibility.utils
import { createTooltipServiceWrapper, TooltipEventArgs, ITooltipServiceWrapper } from "powerbi-visuals-utils-tooltiputils";
import { textMeasurementService as tms } from "powerbi-visuals-utils-formattingutils";
import textMeasurementService = tms.textMeasurementService;

import { getLocalizedString } from "./localization/localizationHelper"

import {visualTransform,LayoutViewModel} from "./viewModel"
import {LayoutSetting} from "./viewSettings"

import { text, group, thresholdSturges } from "d3";




export class BarChart implements IVisual {

    private element: HTMLElement;
    private host: IVisualHost;
    private locale: string;
    private divBackground:Selection<any>;
    private layoutSettings:LayoutSetting;
    


    /**
     * Creates instance of BarChart. This method is only called once.
     *
     * @constructor
     * @param {VisualConstructorOptions} options - Contains references to the element that will
     *                                             contain the visual and a reference to the host
     *                                             which contains services.
     */
    constructor(options: VisualConstructorOptions) {
        this.host = options.host;
        this.element = options.element;
        this.divBackground = d3Select(options.element).append('div')
        this.divBackground.classed("grid-container",true).classed('grid-block',true)
        // this.divBackground.style('width',"100%").style('height',"100%")
        let  divColNav = this.divBackground.append('div').classed('grid-block',true).classed("col-nav",true)
        let  divCol1 = this.divBackground.append('div').classed('grid-block',true).classed("col-1",true)
        let  divCol2 = this.divBackground.append('div').classed('grid-block',true).classed("col-2",true)
        let  divCol3 = this.divBackground.append('div').classed('grid-block',true).classed("col-3",true)

        let  divNav1 = divColNav.append('div').classed("nav-1",true).classed('grid-cell',true).style('border','2px solid black')
        let  divNav2 = divColNav.append('div').classed("nav-2",true).classed('grid-cell',true).style('border','2px solid black')
        let  divNav3 = divColNav.append('div').classed("nav-3",true).classed('grid-cell',true).style('border','2px solid black')
        let  divNav4 = divColNav.append('div').classed("nav-4",true).classed('grid-cell',true).style('border','2px solid black')

        let divcol1row1 = divCol1.append('div').classed("row-1",true).classed('grid-cell',true).style('border','2px solid black')
        let divcol1row2 = divCol1.append('div').classed("row-2",true).classed('grid-cell',true).style('border','2px solid black')
        let divcol1row3 = divCol1.append('div').classed("row-3",true).classed('grid-cell',true).style('border','2px solid black')
        let divcol1row4 = divCol1.append('div').classed("row-4",true).classed('grid-cell',true).style('border','2px solid black')

        let divcol2row1 = divCol2.append('div').classed("row-1",true).classed('grid-cell',true).style('border','2px solid black')
        let divcol2row2 = divCol2.append('div').classed("row-2",true).classed('grid-cell',true).style('border','2px solid black')
        let divcol2row3 = divCol2.append('div').classed("row-3",true).classed('grid-cell',true).style('border','2px solid black')

        let divcol3row1 = divCol3.append('div').classed("row-1",true).classed('grid-cell',true).style('border','2px solid black')
        let divcol3row2 = divCol3.append('div').classed("row-2",true).classed('grid-cell',true).style('border','2px solid black')
        let divcol3row3 = divCol3.append('div').classed("row-3",true).classed('grid-cell',true).style('border','2px solid black')
        
                
    }

    /**
     * Updates the state of the visual. Every sequential databinding and resize will call update.
     *
     * @function
     * @param {VisualUpdateOptions} options - Contains references to the size of the container
     *                                        and the dataView which contains all the data
     *                                        the visual had queried.
     */
    public update(options: VisualUpdateOptions) {
        

        let viewModel: LayoutViewModel = visualTransform(options, this.host);
        let settings = this.layoutSettings = viewModel.layoutSettings;
        this.divBackground.selectAll('.grid-cell').style('border',settings.layoutSetting.borderWidth+'px solid black')
        d3Select(this.element).selectAll("gird-block").style("grid-gap",40+"px")
        this.divBackground.style("opacity",settings.layoutSetting.opcty/100)
        
        
    }

    
    /**
     * Enumerates through the objects defined in the capabilities and adds the properties to the format pane
     *
     * @function
     * @param {EnumerateVisualObjectInstancesOptions} options - Map of defined objects
     */
    public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration {
        let objectName = options.objectName;
        let objectEnumeration: VisualObjectInstance[] = [];

        switch (objectName) {
            case 'layoutSetting':
            objectEnumeration.push({
                objectName: objectName,
                properties: {
                    borderWidth: this.layoutSettings.layoutSetting.borderWidth,
                    gridGap: this.layoutSettings.layoutSetting.gridGap,
                    opcty:this.layoutSettings.layoutSetting.opcty
                },
                selector: null
            });
            break;

        }

            return objectEnumeration;

    }

    /**
     * Destroy runs when the visual is removed. Any cleanup that the visual needs to
     * do should be done here.
     *
     * @function
     */
    public destroy(): void {
        // Perform any cleanup tasks here
    }
    
    
}
