/*
 * Copyright (c) 2022 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
    
    /**
     * A serialized product component used for production.
     */
    export type SerialNumberComponent = {
      /**
       * The serial number ID (part of the serialized product key).
       * @example "9HL2288090191"
       * Max Length: 30.
       */
      'serialId': string;
      /**
       * The product/material number (part of the serialized product key).
       * @example "CPU-Core-i9-VPro"
       * Max Length: 40.
       */
      'productId': string;
      /**
       * The system/namespace (part of the serialized product key).
       * @example "PC-SYS"
       * Max Length: 60.
       */
      'systemId': string;
    } | Record<string, any>;
