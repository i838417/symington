/** 
 * Provides utility for data upload
 */

'use strict'
const formidable = require('formidable');
const csvtojson = require('csvtojson');
const xlsx = require('xlsx');
const fs = require('fs-extra');
const path = require('path');
const util = require('./util');
const xsenv = require('@sap/xsenv');
const { v4: uuidv4 } = require('uuid');
const { exit } = require('process');

const SYMINGTON = "Symington";
const AMORIM = "Amorim";
const BAGLASS = "BA Glass";
const GRAPE = "Grape";
const WINE = "Wine";
const FINALBOTTLE = "Final Bottle";
const CORK = "Cork";
const BOTTLE = "Bottle";


//====================================================================================================
//  ----- MODULE EXPORTS -----
//====================================================================================================
module.exports = {
	doUpload, 
    doDownloadCSV, 
    doDownloadXLSX
}

//====================================================================================================
//  ----- MODULE FUNCTIONS (EXPORTS) -----
//====================================================================================================
async function doUpload(app, req, res) 
{
    const logger = app.get('logger');
    logger.info(`Starting data uploading....`);

    if (! req.authInfo.checkScope("$XSAPPNAME.MTUploadAppUser"))
    {
        res.status(403).send({message: "Forbidden"});
    }
    
    let sProduct = "";
    if(req.query && req.query.product)
    {
        sProduct= req.query.product;
    }
    let sCompany = getCompanyName();

    const form = new formidable.IncomingForm();
    form.on ('file', async (name, file) => { 

        try 
        {                   
            //logger.debug(`Starting data uploading....`);
            let jsonObj;             
            let filePath = file.path;
            let fileName = file.name;

            if(fileName.endsWith(".csv")) 
            {
                jsonObj = await csvtojson().fromFile(filePath);

            } else if (fileName.endsWith(".xlsx")) 
            {
                const workBook = xlsx.readFile(filePath);
                const workSheet = workBook.Sheets['Material-Traceability-Upload'];
                jsonObj = xlsx.utils.sheet_to_json(workSheet);

            }
            //logger.debug("file jsonObj >>> ", JSON.stringify(jsonObj));
            processUploadedData(jsonObj, sCompany, sProduct);
            res.status(200).send({message: "Upload successful"});
            return;
        } 
        catch (err) 
        {
            logger.debug(`err >>> ${err.message}`);
            res.status(500).send(err.message);
        }
    });
    
    form.on ('error', (err) => {
        //logger.debug(`err: ${err.message}`);
        res.status(500).json({ message: err.message })
        return;
    });

    form.on ('end', () => {
        //logger.debug(`end file upload`);
        return;
    });
        
    form.parse(req);

}
    
//====================================================================================================
async function doDownloadCSV(app, req, res)
{
    if (! req.authInfo.checkScope("$XSAPPNAME.CatenaXUser")) 
    {
        res.status(401).send({message: "Unauthorized"});
    }

    let fileName = "CatenaX_Template.csv";
    let filePath = PATH.join(__dirname, "../template_files/" + fileName);
    res.download(filePath, fileName, function (err) {
        if (err)
        {
            console.log("CSV Template File Download Error: " + err);
        }
    });
}

//====================================================================================================
async function doDownloadXLSX(app, req, res)
{
    if (! req.authInfo.checkScope("$XSAPPNAME.CatenaXUser"))
    {
        res.status(401).send({message: "Unauthorized"});
    }

    let fileName = "CatenaX_Template.xlsx";
    let filePath = PATH.join(__dirname, "../template_files/" + fileName);
    res.download(filePath, fileName, function (err) {
        if (err)
        {
            console.log("XLSX Template File Download Error: " + err);
        }
    });
}

//====================================================================================================
//  ----- HELPER FUNCTIONS -----
//====================================================================================================
function processUploadedData(jsonData, company_name, product) 
{
    let aMasterData = getMasterData(company_name, product);
    if(company_name === SYMINGTON)
    {
        if(product === GRAPE)
        { 
            processUploadedDataGrape(jsonData, aMasterData, company_name, product);
        } 
        else if(product === WINE) 
        {
            processUploadedDataWine(jsonData, aMasterData, company_name, product);
        } 
        else if(product === FINALBOTTLE) 
        {
            processUploadedDataFinalBottle(jsonData, aMasterData, company_name, product);
        } 
        else 
        {
            //to-do: raise error 
        }
    } 
    else if(company_name === AMORIM) 
    {
        processUploadedDataCork(jsonData, aMasterData, company_name, product);
    } 
    else if(company_name === BAGLASS) 
    {
        processUploadedDataBottle(jsonData, aMasterData, company_name, product);
    } 
    else 
    {
        //to-do: raise error 
    }
}

//====================================================================================================
function processUploadedDataGrape(jsonData, aMasterData, company_name, product) 
{   
    let oFinalPayload = new finalPayload();

    jsonData.forEach(rec => {
        
        let attrProductID       = getAttribute(rec, "Product_ID" , true , "" ); 
        let attrProductType     = getAttribute(rec, "Grape_Type " , false, "" );
        let attrHarvestDate     = getAttribute(rec, "Harvest_Date", false, "" ); 
        let attrWeight          = getAttribute(rec, "Weight" , false, "" ); 
        let attrVineyardFarm    = getAttribute(rec, "Vineyard_Farm"  , true , "" ); 
        let attrBatchNumber     = getAttribute(rec, "Grape_Batch_No" , true, "" ); 
        let attrProductName     = getAttribute(rec, "Product_Name" , false, "" ); 

        doValidationBatchAttributes(attrBatchNumber, 
                                    attrProductID, 
                                    null, 
                                    null,
                                    null,
                                    null,
                                    null,
                                    null);
        doValidationGrapeProperties(attrHarvestDate, attrWeight);


        let oMasterDate = retrieveMasterData(aMasterData, attrVineyardFarm, company_name, product);

        let oProduceEvent = new productEvent(GRAPE, attrProductID, attrBatchNumber, attrProductName);       
        oProduceEvent.properties[0].value = attrProductType;
        oProduceEvent.properties[1].value = getDate(attrHarvestDate);
        
        oProduceEvent.properties[2].value = oMasterDate.VINEYARD;
        oProduceEvent.properties[3].value = oMasterDate.GEOLOCATION_DATA;
        oProduceEvent.properties[4].value = oMasterDate.TOTAL_QUANTITY_PRODUCED_GRAPE;
        oProduceEvent.properties[5].value = oMasterDate.ELECTRICITY;
        oProduceEvent.properties[6].value = oMasterDate.DIESEL_AGRICULTURAL_MACHINERY;
        oProduceEvent.properties[7].value = oMasterDate.GASOLINE_AGRICULTURAL_MACHINERY;
        oProduceEvent.properties[8].value = oMasterDate.CO2_EMISSIONS_ENERGY;;
        oProduceEvent.properties[9].value = oMasterDate.CO2_EMISSIONS_PHYTOSANITARY;
        oProduceEvent.properties[10].value = oMasterDate.IRRIGATION_WATER_CONSUMPTION;
        oProduceEvent.properties[11].value = oMasterDate.CO2_EMISSIONS_GRAPE_TRANSPORT;
        oProduceEvent.properties[12].value = oMasterDate.USAGE_OF_COVER_CROPS;
        oProduceEvent.properties[13].value = oMasterDate.BIRD_POPULATION_BIODIVERSITY_PRT;
        oProduceEvent.properties[14].value = oMasterDate.RENEWABLE_ENERGY;
        oProduceEvent.properties[15].value = oMasterDate.REUSED_WATER_BY_APPLYING_TO_VINEYARDS;
        oProduceEvent.properties[16].value = oMasterDate.DRIP_IRRIGATION_SYSTEM;
        oProduceEvent.properties[17].value = oMasterDate.ADDED_ORGANIC_MANURE;

        oProduceEvent.location = oMasterDate.LOCATION;

        oProduceEvent.quantities[0].value = attrWeight;
        
        oFinalPayload.PostMaterialTraceabilityEventNotification.eventPackage.produceEvents.push(oProduceEvent);

    });
    
    postMTPayload(oFinalPayload);
}

//====================================================================================================
function processUploadedDataWine(jsonData, aMasterData, company_name, product) 
{
    
    let oFinalPayload = new finalPayload();

    jsonData.forEach(rec => {
        
        let attrProductID       = getAttribute(rec, "Product_ID" , true , "" ); 
        let attrStartFermentation     = getAttribute(rec, "Start_Fermentation", false, "" ); 
        let attrEndFermentation     = getAttribute(rec, "End_Fermentation", false, "" ); 
        let attrQuantity          = getAttribute(rec, "Quantity" , true, "" ); 
        let attrWinery    = getAttribute(rec, "Winery"  , true , "" ); 
        let attrBatchNumber     = getAttribute(rec, "Wine_Batch_No" , true, "" ); 
        let attrGrapeBatchNumber     = getAttribute(rec, "Grape_Batch_No" , true, "" );
        let attrGrapeProductID     = getAttribute(rec, "Grape_Product_ID" , true, "" );
        let attrProductName     = getAttribute(rec, "Product_Name" , false, "" ); 

        doValidationBatchAttributes(attrBatchNumber, 
                                    attrProductID, 
                                    attrGrapeBatchNumber, 
                                    attrGrapeProductID,
                                    null,
                                    null,
                                    null,
                                    null);
        doValidationWineProperties(attrStartFermentation, attrEndFermentation, attrQuantity);

        let oProduceEvent = new productEvent(WINE, attrProductID, attrBatchNumber, attrProductName);
        oProduceEvent.properties[0].value = getDate(attrStartFermentation);
        oProduceEvent.properties[1].value = getDate(attrEndFermentation);

        let oMasterDate = retrieveMasterData(aMasterData, attrWinery, company_name, product);
        oProduceEvent.properties[2].value = oMasterDate.WINERY;
        oProduceEvent.properties[3].value = oMasterDate.TOTAL_QUANTITY_PRODUCED_WINE;
        oProduceEvent.properties[4].value = oMasterDate.ELECTRICITY_CONSUMPTION;
        oProduceEvent.properties[5].value = oMasterDate.RENEWABLE_ENERGY;
        oProduceEvent.properties[6].value = oMasterDate.PROPANE_GAS_LPG;
        oProduceEvent.properties[7].value = oMasterDate.DIESEL_STATIONARY_COMBUSTION;
        oProduceEvent.properties[8].value = oMasterDate.WATER_CONSUMPTION;
        oProduceEvent.properties[9].value = oMasterDate.CO2_EMISSIONS_WINE_PRODUCTION;
        oProduceEvent.properties[10].value = oMasterDate.FERMENTATION_BY_INDIGENEOUS_YEASTS_WINE;
        oProduceEvent.properties[11].value = oMasterDate.GMO_PRODUCTS_USED_WINE;

        oProduceEvent.quantities[0].value = attrQuantity;

        addComponent(attrBatchNumber, attrProductID, attrGrapeBatchNumber, attrGrapeProductID, oProduceEvent, oFinalPayload, GRAPE);
      
    });
    
    postMTPayload(oFinalPayload);
}

//====================================================================================================
function processUploadedDataFinalBottle(jsonData, aMasterData, company_name, product) 
{
    let oFinalPayload = new finalPayload();

    jsonData.forEach(rec => {        

        let attrProductID       = getAttribute(rec, "Product_ID" , true , "" ); 
        let attrBottlesInBatch     = getAttribute(rec, "Bottles_In_Batch", false, "" ); 
        let attrBottlingDate     = getAttribute(rec, "Bottling_Date", false, "" ); 
        let attrBottelery    = getAttribute(rec, "Bottelery"  , true , "" ); 
        let attrBatchNumber     = getAttribute(rec, "Final_Bottle_Batch_No" , true, "" ); 
        let attrProductName     = getAttribute(rec, "Product_Name" , false, "" );

        let attrWineBatchNumber     = getAttribute(rec, "Wine_Batch_No" , true, "" );
        let attrWineProductID     = getAttribute(rec, "Wine_Product_ID" , true, "" );

        let attrBottleBatchNumber     = getAttribute(rec, "Bottle_Batch_No" , true, "" );
        let attrBottleProductID     = getAttribute(rec, "Bottle_Product_ID" , true, "" );

        let attrCorkBatchNumber     = getAttribute(rec, "Cork_Batch_No" , true, "" );
        let attrCorkProductID     = getAttribute(rec, "Cork_Product_ID" , true, "" );

        doValidationBatchAttributes(attrBatchNumber, 
                                    attrProductID, 
                                    attrWineBatchNumber, 
                                    attrWineProductID, 
                                    attrBottleBatchNumber, 
                                    attrBottleProductID, 
                                    attrCorkBatchNumber, 
                                    attrCorkProductID);
        doValidationFinalBottleProperties(attrBottlingDate, attrBottlesInBatch);

        let oProduceEvent = new productEvent(FINALBOTTLE, attrProductID, attrBatchNumber, attrProductName);
        oProduceEvent.properties[0].value = attrBottlesInBatch;
        oProduceEvent.properties[1].value = getDate(attrBottlingDate);

        let oMasterDate = retrieveMasterData(aMasterData, attrBottelery, company_name, product);
        oProduceEvent.properties[2].value = oMasterDate.BOTTLING_SITE;
        oProduceEvent.properties[3].value = oMasterDate.TOTAL_QUANTITY_PRODUCED_FIN_BOTTLE;
        oProduceEvent.properties[4].value = oMasterDate.GEOLOCATION;
        oProduceEvent.properties[5].value = oMasterDate.ELECTRICITY_CONSUMPTION;
        oProduceEvent.properties[6].value = oMasterDate.PROPANE_GAS_LPG;
        oProduceEvent.properties[7].value = oMasterDate.NATURAL_GAS;
        oProduceEvent.properties[8].value = oMasterDate.DIESEL_STATIONARY_COMBUSTION;
        oProduceEvent.properties[9].value = oMasterDate.WATER_CONSUMPTION_BOTTLING;
        oProduceEvent.properties[10].value = oMasterDate.CO2_EMISSIONS_BOTTLING;
        oProduceEvent.properties[11].value = oMasterDate.CERTIFICATION_A;
        oProduceEvent.properties[12].value = oMasterDate.CERTIFICATION_B;
        oProduceEvent.properties[13].value = oMasterDate.FERMENTATION_BY_INDIGENEOUS_YEASTS_FB;
        oProduceEvent.properties[14].value = oMasterDate.GMO_PRODUCTS_USED_FB;

        addComponent(attrBatchNumber, attrProductID, attrWineBatchNumber, attrWineProductID, oProduceEvent, oFinalPayload, WINE);

        addReceiveEvent(attrCorkBatchNumber, attrCorkProductID, oFinalPayload, CORK);
        addComponent(attrBatchNumber, attrProductID, attrCorkBatchNumber, attrCorkProductID, oProduceEvent, oFinalPayload, CORK);

        addReceiveEvent(attrBottleBatchNumber, attrBottleProductID, oFinalPayload, BOTTLE);
        addComponent(attrBatchNumber, attrProductID, attrBottleBatchNumber, attrBottleProductID, oProduceEvent, oFinalPayload, BOTTLE);

    });
    
    postMTPayload(oFinalPayload);
}

//====================================================================================================
function processUploadedDataCork(jsonData, aMasterData, company_name, product) 
{
    
    let oFinalPayload = new finalPayload();

    jsonData.forEach(rec => {
        
        let attrProductID       = getAttribute(rec, "Product_ID" , true , "" ); 
        let attrBatchNumber     = getAttribute(rec, "Cork_Batch_No" , true, "" ); 
        let attrProductName     = getAttribute(rec, "Product_Name" , false, "" );
        let attrProductType     = getAttribute(rec, "Cork_Type" , false, "" );
        let attrManufacture     = getAttribute(rec, "Cork_Manufacture" , true, "" );

        doValidationBatchAttributes(attrBatchNumber, 
                                    attrProductID, 
                                    null, 
                                    null,
                                    null,
                                    null,
                                    null,
                                    null);
       // doValidationCorkProperties();

        let oProduceEvent = new productEvent(CORK, attrProductID, attrBatchNumber, attrProductName);
        oProduceEvent.properties[0].value = attrProductType;
        oFinalPayload.PostMaterialTraceabilityEventNotification.eventPackage.produceEvents.push(oProduceEvent);

        let oDeliverEvent = new deliverEvent(CORK, attrProductID, attrBatchNumber);
        oFinalPayload.PostMaterialTraceabilityEventNotification.eventPackage.deliverEvents.push(oDeliverEvent);
    });
    
    postMTPayload(oFinalPayload);
}

//====================================================================================================
function processUploadedDataBottle(jsonData, aMasterData, company_name, product) 
{
    
    let oFinalPayload = new finalPayload();

    jsonData.forEach(rec => {
        
        let attrProductID       = getAttribute(rec, "Product_ID" , true , "" ); 
        let attrBatchNumber     = getAttribute(rec, "Bottle_Batch_No" , true, "" ); 
        let attrProductName     = getAttribute(rec, "Product_Name" , false, "" );
        let attrProductType     = getAttribute(rec, "Bottle_Type" , false, "" );
        let attrManufacture     = getAttribute(rec, "Bottle_Manufacture" , true, "" );

        doValidationBatchAttributes(attrBatchNumber, 
                                    attrProductID, 
                                    null, 
                                    null,
                                    null,
                                    null,
                                    null,
                                    null);
        // doValidationBottleProperties();

        let oProduceEvent = new productEvent(BOTTLE, attrProductID, attrBatchNumber, attrProductName);
        oProduceEvent.properties[0].value = attrProductType;
        oFinalPayload.PostMaterialTraceabilityEventNotification.eventPackage.produceEvents.push(oProduceEvent);

        let oDeliverEvent = new deliverEvent(BOTTLE, attrProductID, attrBatchNumber);
        oFinalPayload.PostMaterialTraceabilityEventNotification.eventPackage.deliverEvents.push(oDeliverEvent);
    });
    
    postMTPayload(oFinalPayload);
}

//====================================================================================================
function getAttribute(attrs, attrName, isRequired, defaultValue)
{
    if (isRequired && (attrs[attrName] == undefined || attrs[attrName] == null))
    {
        throw new Error("Missing column or missing mandatory data: '" + attrName + "'");;
    }
    let attrValue = attrs[attrName];

    if(typeof attrValue == "number") 
    {
        attrValue = attrValue.toString();
    }

    if (typeof attrValue === "string")
    {
        if (isRequired && attrValue.trim() == "")
        {
            throw new Error("Missing mandatory data in column '" + attrName + "'");
        }
    }
    return (attrValue == undefined || attrValue == null || attrValue == "") ? defaultValue : attrValue;
}

//====================================================================================================
function retrieveAttributeData(excelRec, excelAttrName, attrValue, masterDataRec, masterDataAttrName) {

    if ((excelRec[excelAttrName] != undefined) && (excelRec[excelAttrName] != null)){
        if (attrValue !== ""){
            return attrValue;
        } else {
            if ((masterDataRec != null) && (masterDataRec[masterDataAttrName] != undefined) && (masterDataRec[masterDataAttrName] != null)) {
                return masterDataRec[masterDataAttrName];
            } else {
                return attrValue;
            }
        }
    } else {
        if ((masterDataRec != null) && (masterDataRec[masterDataAttrName] != undefined) && (masterDataRec[masterDataAttrName] != null)) {
            return masterDataRec[masterDataAttrName];
        } else {
            return attrValue;
        }
    }
}
//====================================================================================================
function addComponent(sBatchNumber, sProductID, sComponentBatchNumber, sComponentProductId, oProduceEvent, oFinalPayload, product) 
{
    let oComponent = new component(product);
    if(product == CORK || product == BOTTLE)
    {
        oComponent.batchId = "R-" + sComponentBatchNumber;
    }
    else
    {
        oComponent.batchId = sComponentBatchNumber;
    }
    oComponent.productId = sComponentProductId;
    
    if(oFinalPayload.PostMaterialTraceabilityEventNotification.eventPackage.produceEvents.length > 0)
    {
        let isProduceExit = false;
        let isComponentExist = false;

        for(var i=0; i < oFinalPayload.PostMaterialTraceabilityEventNotification.eventPackage.produceEvents.length; i++)
        {
            let loProduceEvent = oFinalPayload.PostMaterialTraceabilityEventNotification.eventPackage.produceEvents[i];
            if(loProduceEvent.productId == sProductID && loProduceEvent.batchId == sBatchNumber)
            {
                for(var j=0; j < loProduceEvent.components.length; j++)
                {
                    let loComponent = loProduceEvent.components[j];
                    if(loComponent.productId == sComponentProductId && loComponent.batchId == oComponent.batchId ){
                        isComponentExist = true;
                        break
                    }
                }
                if(isComponentExist)
                {
                    break;
                }
                else
                {
                    loProduceEvent.components.push(oComponent);
                    isProduceExit = true;
                    break;
                }
            }
        }
        
        if(!isProduceExit && !isComponentExist)
        {
            oProduceEvent.components.push(oComponent);
            oFinalPayload.PostMaterialTraceabilityEventNotification.eventPackage.produceEvents.push(oProduceEvent);
        }
    } 
    else 
    {
        oProduceEvent.components.push(oComponent);
        oFinalPayload.PostMaterialTraceabilityEventNotification.eventPackage.produceEvents.push(oProduceEvent);
    }
}
//====================================================================================================
function addReceiveEvent(sVendorBatchNumber, sVendorProductID, oFinalPayload, product)
{
    let oDeliveryItem = new deliveryItem(product, sVendorBatchNumber);
    let oReceiveEvent = new receiveEvent(product, sVendorProductID, sVendorBatchNumber);
    let sReceiveBatchNumber = "R-"+ sVendorBatchNumber;

    if(oFinalPayload.PostMaterialTraceabilityEventNotification.eventPackage.receiveEvents.length > 0)
    {
        let isReceiveExit = false;
        let isDeliveryItemExist = false;

        for(var i=0; i < oFinalPayload.PostMaterialTraceabilityEventNotification.eventPackage.receiveEvents.length; i++)
        {
            let loReceiveEvent = oFinalPayload.PostMaterialTraceabilityEventNotification.eventPackage.receiveEvents[i];
           
            if(loReceiveEvent.productId == sVendorProductID && loReceiveEvent.batchId == sReceiveBatchNumber)
            {
                for(var j=0; j < loReceiveEvent.deliveryItemKeys.length; j++)
                {
                    let loDeliveryItem = loReceiveEvent.deliveryItemKeys[j];
                    if(loDeliveryItem.vendorBatchId == sVendorBatchNumber){
                        isDeliveryItemExist = true;
                        break
                    }
                }
                if(isDeliveryItemExist)
                {
                    break;
                }
                else
                {
                    loReceiveEvent.deliveryItemKeys.push(oDeliveryItem);
                    isReceiveExit = true;
                    break;
                }
            }
        };
        if(!isReceiveExit && !isDeliveryItemExist)
        {
            oReceiveEvent.deliveryItemKeys.push(oDeliveryItem);
            oFinalPayload.PostMaterialTraceabilityEventNotification.eventPackage.receiveEvents.push(oReceiveEvent);
        }
    } 
    else 
    {
        oReceiveEvent.deliveryItemKeys.push(oDeliveryItem);
        oFinalPayload.PostMaterialTraceabilityEventNotification.eventPackage.receiveEvents.push(oReceiveEvent);
    }
}
//====================================================================================================
function getCurrentDate() 
{
    const d = new Date();
    let day = d.getDate().toString();
    let month = (d.getMonth() +1).toString();
    let year = d.getFullYear().toString();
    let date = year + month + day;
    return date
}

//====================================================================================================
function getDate(sInDate) 
{
    let sYear = sInDate.substr(6, 4).toString();
    let sMonth = sInDate.substr(3, 2).toString();
    let sDay = sInDate.substr(0, 2).toString();
    let sDate = sYear + sMonth + sDay;
    return sDate
}

//====================================================================================================
function getSenderLBNId() 
{
    
    let senderLBNId = process.env.SENDER_LBN_ID;
    if(senderLBNId == null || senderLBNId == ""){
        //throw execption
    } else {
        return senderLBNId;
    }
}

//====================================================================================================
function finalPayload()
{
    let oFinalPayloadJason = require('../payload_json/final-payload.json');
    var oFinalPayload = JSON.parse(JSON.stringify(oFinalPayloadJason));

    oFinalPayload.PostMaterialTraceabilityEventNotification.eventPackage.receiveEvents = [];
    oFinalPayload.PostMaterialTraceabilityEventNotification.eventPackage.produceEvents = [];
    oFinalPayload.PostMaterialTraceabilityEventNotification.eventPackage.deliverEvents = [];
    
    let sSenderLbnId = getSenderLBNId();
    oFinalPayload.PostMaterialTraceabilityEventNotification.senderLbnId = sSenderLbnId;
    oFinalPayload.PostMaterialTraceabilityEventNotification.senderSystemId = sSenderLbnId + "-SYS";
    oFinalPayload.PostMaterialTraceabilityEventNotification.messageId = uuidv4();
    return oFinalPayload;
}

//====================================================================================================
function getCompanyName()
{
    let sCompanyName = process.env.COMPANY_NAME;
    return sCompanyName;
}

//====================================================================================================
function productEvent(product, sProductID, sBatchNumber, sProductName)
{
    let produceEventJson;
    let oProduceEvent;

    if(product == GRAPE)
    {
        produceEventJson = require('../payload_json/product-event-grape.json');     
    } 
    else if (product == WINE) 
    {
        produceEventJson = require('../payload_json/product-event-wine.json');
    } 
    else if (product == FINALBOTTLE) 
    {
        produceEventJson = require('../payload_json/product-event-final-bottle.json');
    } 
    else if (product == CORK) 
    {
        produceEventJson = require('../payload_json/product-event-cork.json');
    } 
    else if (product == BOTTLE) 
    {
        produceEventJson = require('../payload_json/product-event-bottle.json');
    } else {
        //error
        console.log("error");
    }
    oProduceEvent = JSON.parse(JSON.stringify(produceEventJson));
    oProduceEvent.productId = sProductID;
    oProduceEvent.creationDate = getCurrentDate();
    oProduceEvent.batchId = sBatchNumber;
    oProduceEvent.productName = sProductName;
    return oProduceEvent;
}
//====================================================================================================
function component(product)
{
    let componentJson;
    if(product == GRAPE)
    {
        componentJson = require('../payload_json/component-grape.json');
    }
    else if(product == WINE)
    {
        componentJson = require('../payload_json/component-wine.json');
    }
    else if(product == CORK)
    {
        componentJson = require('../payload_json/component-cork.json');
    }else if(product == BOTTLE)
    {
        componentJson = require('../payload_json/component-bottle.json');
    }
    else {
        console.log("compoenet not found");
//        throw error;
    }
    
    let oComponent = JSON.parse(JSON.stringify(componentJson));
    
    return oComponent;
}
//====================================================================================================
function receiveEvent(product, sProductID, sBatchNumber)
{
    let receiveEventJson;
    let oReceiveEvent;

    if (product == CORK) 
    {
        receiveEventJson = require('../payload_json/receive-event-cork.json');
    } 
    else if (product == BOTTLE) 
    {
        receiveEventJson = require('../payload_json/receive-event-bottle.json');
    } else {
        //error
        console.log("error");
    }
    oReceiveEvent = JSON.parse(JSON.stringify(receiveEventJson));

    oReceiveEvent.productId = sProductID;
    oReceiveEvent.batchId = "R-" + sBatchNumber;
    oReceiveEvent.productName = retrieveProductName(product, sProductID);
    oReceiveEvent.creationDate = getCurrentDate();

    return oReceiveEvent;
}
//====================================================================================================
function deliveryItem(product, sVendorBatchNumber)
{
    let deliveryItemJson;
    let oDeliveryItem;

    if (product == CORK) 
    {
        deliveryItemJson = require('../payload_json/deliveryItem-cork.json');
    } 
    else if (product == BOTTLE) 
    {
        deliveryItemJson = require('../payload_json/deliveryItem-bottle.json');
    } else {
        //error
        console.log("error");
    }
    oDeliveryItem = JSON.parse(JSON.stringify(deliveryItemJson));
    oDeliveryItem.vendorDeliveryId = "D-" + sVendorBatchNumber;
    oDeliveryItem.vendorBatchId = sVendorBatchNumber;

    return oDeliveryItem;
}
//====================================================================================================
function deliverEvent(product, sProductID, sBatchNumber)
{
    let deliverEventJson;
    let oDeliverEvent;

    if (product == CORK) 
    {
        deliverEventJson = require('../payload_json/deliver-event-cork.json');
    } 
    else if (product == BOTTLE) 
    {
        deliverEventJson = require('../payload_json/deliver-event-bottle.json');
    } else {
        //error
        console.log("error");
    }
    oDeliverEvent = JSON.parse(JSON.stringify(deliverEventJson));
    oDeliverEvent.vendorDeliveryId = "D-" + sBatchNumber;
    oDeliverEvent.vendorBatchId = sBatchNumber;
    oDeliverEvent.productId = sProductID;
    return oDeliverEvent;
}
//====================================================================================================
function getMasterData(company_name, product)
{
    let oMasterData = null;
    if(company_name === SYMINGTON)
    {
        if(product === GRAPE)
        { 
            oMasterData = process.env.GRAPE_MASTER_DATA;
        } 
        else if(product === WINE) 
        {
            oMasterData = process.env.WINE_MASTER_DATA;
        } 
        else if(product === FINALBOTTLE) 
        {
            oMasterData = process.env.FINAL_BOTTLE_MASTER_DATA;
        } 
        else 
        {
            //to-do: raise error 
        }
    } 
    else if(company_name === AMORIM) 
    {
        oMasterData = process.env.CORK_MASTER_DATA;
    } 
    else if(company_name === BAGLASS) 
    {
        oMasterData = process.env.BOTTLE_MASTER_DATA;
    } 
    else 
    {
        //to-do: raise error 
    }
    return oMasterData;
}
//====================================================================================================
function retrieveMasterData(aMasterData, sMasterDataKey, company_name, product)
{
    try
    {
        let aMasterDataJason = JSON.parse(aMasterData);
        let oMasterData;          
        if(company_name === SYMINGTON)
        {
            if(product === GRAPE)
            { 
                oMasterData = aMasterDataJason.find(item => item.VINEYARD === sMasterDataKey);
            } 
            else if(product === WINE) 
            {
                oMasterData = aMasterDataJason.find(item => item.WINERY === sMasterDataKey);
            } 
            else if(product === FINALBOTTLE) 
            {
                oMasterData = aMasterDataJason.find(item => item.BOTTLING_SITE === sMasterDataKey);
            } 
        } 
        else if(company_name === AMORIM) 
        {
            //TO-DO: change VINEYARD
            oMasterData = aMasterDataJason.find(item => item.VINEYARD === sMasterDataKey);
        } 
        else if(company_name === BAGLASS) 
        {
            //TO-DO: change VINEYARD
            oMasterData = aMasterDataJason.find(item => item.VINEYARD === sMasterDataKey);
        }     
        return oMasterData;
    }
    catch (err)
    {
        throw new Error("Could not find master data for '" + sMasterDataKey + "'");
    }
}
//====================================================================================================
function retrieveProductName(product, sProductID)
{
    let sProductIDName;
    try
    {
        if(product === CORK)
        { 
            sProductIDName = process.env.CORK_PRODUCT_ID_NAME;
            
        } 
        else if(product === BOTTLE) 
        {
            sProductIDName = process.env.BOTTLE_PRODUCT_ID_NAME;
        } 
        let aProductIDName = JSON.parse(sProductIDName);
        let oProductIDName = aProductIDName.find(item => item.PRODUCT_ID === sProductID);

        return oProductIDName.PRODUCT_NAME;
    }
    catch (err)
    {
        throw new Error("Could not find Product Name master data for Product ID '" + sProductID + "'");
    }
}
//====================================================================================================
function doValidationBatchAttributes(
    sBatchNumber,
    sProductID,
    sBatchNumber1,
    sProductID1,
    sBatchNumber2,
    sProductID2,
    sBatchNumber3,
    sProductID3)
{
    
    if (sBatchNumber.length > 28 )
    {
        throw new Error("Batch number: '"+ sBatchNumber + "' longer than max length allowed 28 characters");
    }
    if (sProductID.length > 40 )
    {
        throw new Error("Product ID: '"+ sProductID + "' longer than max length allowed 40 characters");
    }
    if (sBatchNumber1 != null && sBatchNumber1.length > 28 )
    {
        throw new Error("Batch number: '"+ sBatchNumber1 + "' longer than max length allowed 28 characters");
    }
    if (sProductID1 != null && sProductID1.length > 40 )
    {
        throw new Error("Product ID: '"+ sProductID1 + "' longer than max length allowed 40 characters");
    }
    if (sBatchNumber2 != null && sBatchNumber2.length > 28 )
    {
        throw new Error("Batch number: '"+ sBatchNumber2 + "' longer than max length allowed 28 characters");
    }
    if (sProductID2 != null && sProductID2.length > 40 )
    {
        throw new Error("Product ID: '"+ sProductID2 + "' longer than max length allowed 40 characters");
    }
    if (sBatchNumber3 != null &&  sBatchNumber3.length > 28 )
    {
        throw new Error("Batch number: '"+ sBatchNumber3 + "' longer than max length allowed 28 characters");
    }
    if (sProductID3 != null &&  sProductID3.length > 40 )
    {
        throw new Error("Product ID: '"+ sProductID3 + "' longer than max length allowed 40 characters");
    }

    return null;
}
//====================================================================================================
function doValidationGrapeProperties(attrHarvestDate, attrWeight)
{
    if(!validateDate(attrHarvestDate))
    {
        throw new Error("Harvest date: '"+ attrHarvestDate + "' is not a correct date");
    }
    if(!validateNumber(attrWeight))
    {
        throw new Error("Weight: '"+ attrWeight + "' is not a correct number");
    }
}
//====================================================================================================
function doValidationWineProperties(attrStartFermentation, attrEndFermentation, attrQuantity)
{
    if(!validateDate(attrStartFermentation))
    {
        throw new Error("Start fermentation date: '"+ attrStartFermentation + "' is not a correct date");
    }
    if(!validateDate(attrEndFermentation))
    {
        throw new Error("End fermentation date: '"+ attrEndFermentation + "' is not a correct date");
    }
    if(!validateNumber(attrQuantity))
    {
        throw new Error("Quantity: '"+ attrQuantity + "' is not a correct number");
    }
}
//====================================================================================================
function doValidationFinalBottleProperties(attrBottlingDate, attrBottlesInBatch)
{
    if(!validateDate(attrBottlingDate))
    {
        throw new Error("Bottling date: "+ attrBottlingDate + " is not a correct date");
    }
    if(!validateNumber(attrBottlesInBatch))
    {
        throw new Error("Bottle in batch: "+ attrBottlesInBatch + " is not a correct number");
    }
}
//====================================================================================================
function validateDate(sDate)
{
    if(sDate != null && sDate.length != 10 )
    {
        return false;
    }
    else {
        let sYear = sDate.substr(6, 4).toString();
        let sMonth = sDate.substr(3, 2).toString();
        let sDay = sDate.substr(0, 2).toString();
        if(isNaN(sYear) || isNaN(sMonth) || isNaN(sDay))
        {
            return false;
        }
    }
    return true;
}
//====================================================================================================
function validateNumber(sNumber)
{
    if(sNumber != null && isNaN(sNumber))
    {
        return false;
    }
    return true;
}
//====================================================================================================
async function postMTPayload(finalPayload) 
{
    const eventDataApi = require("./../generated/MaterialTraceabilityEventNotification_Provider/event-data-api");

    console.log("========================");  
    console.log(JSON.stringify(finalPayload));  
    console.log("========================");  

    try
    {
        const responseData = await eventDataApi.EventDataApi.create(finalPayload).execute({ destinationName: 'DEST-MT-V2' });
    } catch (err) {
        console.log(err.stack);
        res.status(500).json(err.message);
    }
}

   

