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
async function doUpload(app, req, res) {

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
            res.status(500).send({ message: err.message });
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
    if(company_name === SYMINGTON){

        if(product === GRAPE) { 
            processUploadedDataGrape(jsonData);
        } else if(product === WINE) {
            processUploadedDataWine(jsonData);
        } else if(product === FINALBOTTLE) {
            processUploadedDataFinalBottle(jsonData);
        } else {
            //to-do: raise error 
        }
    } else if(company_name === AMORIM) {
        processUploadedDataCork(jsonData);
    } else if(company_name === BAGLASS) {
        processUploadedDataBottle(jsonData);
    } else {
        //to-do: raise error 
    }

}

//====================================================================================================
async function processUploadedDataGrape(jsonData) 
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
/*
        let error = doValidation(attrSerialNumber,
                                 attrBatchNumber,
                                 attrBatchManaged,
                                 attrManufacturer,
                                 attrAAS,
                                 attrMQTT);
        if (error != null)
        {
            throw error;
        }
*/
        let oProduceEvent = new productEvent(GRAPE);
        oProduceEvent.productId           = attrProductID;
        oProduceEvent.properties[0].value = attrProductType;
        oProduceEvent.properties[1].value = getDate(attrHarvestDate);
        oProduceEvent.creationDate        = getCurrentDate();
        oProduceEvent.quantities[0].value = attrWeight;
        oProduceEvent.batchId             = attrBatchNumber;
        oProduceEvent.productName         = attrProductName;
        
        oFinalPayload.PostMaterialTraceabilityEventNotification.eventPackage.produceEvents.push(oProduceEvent);

    });
    
    postMTPayload(oFinalPayload);
}

//====================================================================================================
async function processUploadedDataWine(jsonData) 
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
/*
        let error = doValidation(attrSerialNumber,
                                 attrBatchNumber,
                                 attrBatchManaged,
                                 attrManufacturer,
                                 attrAAS,
                                 attrMQTT);
        if (error != null)
        {
            throw error;
        }
*/
        let oProduceEvent = new productEvent(WINE);

        oProduceEvent.productId           = attrProductID;
        oProduceEvent.properties[0].value = getDate(attrStartFermentation);
        oProduceEvent.properties[1].value = getDate(attrEndFermentation);
        oProduceEvent.creationDate        = getCurrentDate();
        oProduceEvent.quantities[0].value = attrQuantity;
        oProduceEvent.batchId             = attrBatchNumber;
        oProduceEvent.productName         = attrProductName;

        let oComponent = new component();
        oComponent.batchId = attrGrapeBatchNumber;
        oComponent.productId = attrGrapeProductID;
        
        if(oFinalPayload.PostMaterialTraceabilityEventNotification.eventPackage.produceEvents.length > 0)
        {
            let isProduceExit = false;

            oFinalPayload.PostMaterialTraceabilityEventNotification.eventPackage.produceEvents.forEach(oProduceEvent => {
                if(oProduceEvent.productId == attrProductID && oProduceEvent.batchId == attrBatchNumber){
                    oProduceEvent.components.push(oComponent);
                    isProduceExit = true;
                }
            });

            if(!isProduceExit)
            {
                oProduceEvent.components.push(oComponent);
                oFinalPayload.PostMaterialTraceabilityEventNotification.eventPackage.produceEvents.push(oProduceEvent);
            }
        } else {
            oProduceEvent.components.push(oComponent);
            oFinalPayload.PostMaterialTraceabilityEventNotification.eventPackage.produceEvents.push(oProduceEvent);
        }
        
    });
    
    postMTPayload(oFinalPayload);
}

//====================================================================================================
async function processUploadedDataFinalBottle(jsonData) 
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
/*
        let error = doValidation(attrSerialNumber,
                                 attrBatchNumber,
                                 attrBatchManaged,
                                 attrManufacturer,
                                 attrAAS,
                                 attrMQTT);
        if (error != null)
        {
            throw error;
        }
*/
        let oProduceEvent = new productEvent(FINALBOTTLE);

        oProduceEvent.productId           = attrProductID;
        oProduceEvent.properties[0].value = attrBottlesInBatch;
        oProduceEvent.properties[1].value = getDate(attrBottlingDate);
        oProduceEvent.creationDate        = getCurrentDate();
        oProduceEvent.batchId             = attrBatchNumber;
        oProduceEvent.productName         = attrProductName;

        let oComponent = new component();
        oComponent.batchId = attrWineBatchNumber;
        oComponent.productId = attrWineProductID;
        
        if(oFinalPayload.PostMaterialTraceabilityEventNotification.eventPackage.produceEvents.length > 0)
        {
            let isProduceExit = false;

            oFinalPayload.PostMaterialTraceabilityEventNotification.eventPackage.produceEvents.forEach(oProduceEvent => {
                if(oProduceEvent.productId == attrProductID && oProduceEvent.batchId == attrBatchNumber){
                    oProduceEvent.components.push(oComponent);
                    isProduceExit = true;
                }
            });

            if(!isProduceExit)
            {
                oProduceEvent.components.push(oComponent);
                oFinalPayload.PostMaterialTraceabilityEventNotification.eventPackage.produceEvents.push(oProduceEvent);
            }
        } else {
            oProduceEvent.components.push(oComponent);
            oFinalPayload.PostMaterialTraceabilityEventNotification.eventPackage.produceEvents.push(oProduceEvent);
        }
        
    });
    
    postMTPayload(oFinalPayload);
}

//====================================================================================================
function getAttribute(attrs, attrName, isRequired, defaultValue)
{
    if (isRequired && (attrs[attrName] == undefined || attrs[attrName] == null))
    {
        throw new Error("Missing column '" + columnName + "'");;
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
            throw new Error("Missing mandatory data in column '" + columnName + "'");
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
function getCurrentDate() {
    const d = new Date();
    let day = d.getDate().toString();
    let month = (d.getMonth() +1).toString();
    let year = d.getFullYear().toString();
    let date = year + month + day;
    return date
}

function getDate(sInDate) {
    let sYear = sInDate.substr(6, 4).toString();
    let sMonth = sInDate.substr(3, 2).toString();
    let sDay = sInDate.substr(0, 2).toString();
    let sDate = sYear + sMonth + sDay;
    return sDate
}

function getSenderLBNId() {
    
    let senderLBNId = process.env.SENDER_LBN_ID;
    if(senderLBNId == null || senderLBNId == ""){
        //throw execption
    } else {
        return senderLBNId;
    }
}

function finalPayload(){

    let oFinalPayloadJason = require('../payload_json/final-payload.json');
    var oFinalPayload = JSON.parse(JSON.stringify(oFinalPayloadJason));

    oFinalPayload.PostMaterialTraceabilityEventNotification.eventPackage.receiveEvents = [];
    oFinalPayload.PostMaterialTraceabilityEventNotification.eventPackage.produceEvents = [];
    oFinalPayload.PostMaterialTraceabilityEventNotification.eventPackage.DeliverEvent = [];
    
    let sSenderLbnId = getSenderLBNId();
    oFinalPayload.PostMaterialTraceabilityEventNotification.senderLbnId = sSenderLbnId;
    oFinalPayload.PostMaterialTraceabilityEventNotification.senderSystemId = sSenderLbnId + "-SYS";
    oFinalPayload.PostMaterialTraceabilityEventNotification.messageId = uuidv4();
    return oFinalPayload;
}

function getCompanyName(){
    let sCompanyName = process.env.COMPANY_NAME;
    return sCompanyName;
}

function productEvent(product)
{
    let produceEventJson;
    let oProduceEvent;

    if(product == "Grape")
    {
        produceEventJson = require('../payload_json/product-event-grape.json');     
    } 
    else if (product == "Wine") 
    {
        produceEventJson = require('../payload_json/product-event-wine.json');
    } 
    else if (product == "Final Bottle") 
    {
        produceEventJson = require('../payload_json/product-event-final-bottle.json');
    } 
    else if (product == "Cork") 
    {

    } else if (product == "Bottle") 
    {

    } else {
        //error
        console.log("error");
    }
    oProduceEvent = JSON.parse(JSON.stringify(produceEventJson));
    return oProduceEvent;
}

function component(){
    let componentJson= require('../payload_json/component.json')
    let oComponent = JSON.parse(JSON.stringify(componentJson));
    return oComponent;
}
//====================================================================================================
async function postMTPayload(finalPayload) {

    const eventDataApi = require("./../generated/MaterialTraceabilityEventNotification_Provider/event-data-api");

    console.log("========================");  
    console.log(JSON.stringify(finalPayload));  
    console.log("========================");  

    try{
//debugger
        const responseData = await eventDataApi.EventDataApi.create(finalPayload).execute({ destinationName: 'DEST-MT-V2' });

    } catch (err) {

        console.log(err.stack);
        res.status(500).json(err.message);
    }
}

   

