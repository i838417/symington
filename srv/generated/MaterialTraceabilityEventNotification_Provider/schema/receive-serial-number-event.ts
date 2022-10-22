/*
 * Copyright (c) 2022 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
    import type { SerialNumber } from './serial-number';
    import type { ProductDetail } from './product-detail';
    import type { Quantity } from './quantity';
    import type { Property } from './property';
    /**
     * Provides data about the received serialized product.
     */
    export type ReceiveSerialNumberEvent = {
      /**
       * List of serial number IDs.
       * @example [
       *   {
       *     "serialId": "9HL2288090191"
       *   }
       * ]
       * Min Items: 1.
       */
      'serialNumbers': SerialNumber[];
      /**
       * The product/material number (part of serialized product key).
       * @example "CPU-Core-i9-VPro"
       * Max Length: 40.
       */
      'productId': string;
      /**
       * The system/namespace (part of serialized product key).
       * @example "PC-SYS"
       * Max Length: 60.
       */
      'systemId': string;
      /**
       * The received batch/lot number.
       * Max Length: 30.
       */
      'batchId'?: string;
      /**
       * The delivery number used by vendor.
       * @example "8000056082"
       * Max Length: 35.
       */
      'vendorDeliveryId': string;
      /**
       * The country/region where the vendor is registered (ISO 3166 / Alpha 2).
       * @example "DE"
       * Max Length: 2.
       */
      'vendorCountry': string;
      /**
       * The post code or zip code of the vendor.
       * @example "89655"
       * Max Length: 10.
       */
      'vendorPostalCode': string;
      /**
       * The purchase order number used by the purchaser.
       * @example "4500004023"
       * Max Length: 35.
       */
      'purchaseOrderId': string;
      /**
       * The purchase order item used by the purchaser.
       * @example "10"
       * Max Length: 6.
       */
      'purchaseOrderItem': string;
      /**
       * The date of purchase (YYYYMMDD).
       * @example "20210205"
       * Format: "date".
       */
      'purchaseOrderDate': string;
      /**
       * The date when the delivered item arrived at one of your plants (YYYYMMDD).
       * @example "20210215"
       * Format: "date".
       */
      'goodsReceiptDate'?: string;
      'productDetail'?: ProductDetail;
      /**
       * The received amount of serialized products, defined in terms of the qualifier.
       * @example [
       *   {
       *     "qualifier": "DISCRETE",
       *     "value": "1",
       *     "unit": "PC"
       *   }
       * ]
       */
      'quantities'?: Quantity[];
      /**
       * The attributes of the received serialized product.
       * @example [
       *   {
       *     "name": "POWER_REDUCTION",
       *     "value": "true"
       *   }
       * ]
       */
      'properties'?: Property[];
      /**
       * The creation day of the serialized product (YYYYMMDD).
       * @example "20210216"
       * Format: "date".
       */
      'creationDate': string;
      /**
       * The receiving plant where the serialized product was received.
       * @example "3001"
       * Max Length: 10.
       */
      'plant'?: string;
      /**
       * The status of the received serialized product.
       * @example "RELEASED"
       */
      'status': 'RELEASED' | 'ONHOLD' | 'RECALLED';
      /**
       * An explanation for why the serialized products have their current status.
       * Max Length: 255.
       */
      'statusComment'?: string;
    } | Record<string, any>;
