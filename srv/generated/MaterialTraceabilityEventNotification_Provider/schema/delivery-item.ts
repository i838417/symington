/*
 * Copyright (c) 2022 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
    
    /**
     * Data about a delivered item.
     */
    export type DeliveryItem = {
      /**
       * The delivery number used by the vendor.
       * @example "VRAW-S001"
       * Max Length: 35.
       */
      'vendorDeliveryId': string;
      /**
       * The batch/lot number used by the vendor (this data is part of the batch key, which is used to identify the batch).
       * @example "BAT-S001"
       * Max Length: 30.
       */
      'vendorBatchId': string;
      /**
       * The country/region where the vendor is registered (ISO 3166 / Alpha 2).
       * @example "IN"
       * Max Length: 2.
       */
      'vendorCountry': string;
      /**
       * The post code or zip code of the vendor.
       * @example "530068"
       * Max Length: 10.
       */
      'vendorPostalCode': string;
      /**
       * The purchase order number used by the purchaser.
       * @example "PO-001"
       * Max Length: 35.
       */
      'purchaseOrderId': string;
      /**
       * The purchase order item used by the purchaser.
       * @example "I001"
       * Max Length: 6.
       */
      'purchaseOrderItem': string;
      /**
       * The date of purchase (YYYYMMDD).
       * @example "20180501"
       * Format: "date".
       */
      'purchaseOrderDate': string;
      /**
       * The date when the delivered item arrived at one of your plants (YYYYMMDD). Note, this is not part of the batch key.
       * @example "20180603"
       * Format: "date".
       */
      'goodsReceiptDate'?: string;
    } | Record<string, any>;
