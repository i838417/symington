/*
 * Copyright (c) 2022 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
    import type { SerialNumberComponent } from './serial-number-component';
    /**
     * Components of a serialized product.
     */
    export type SerialNumberWithComponents = {
      /**
       * The serial number ID.
       * @example "R90A2B4U7"
       * Max Length: 30.
       */
      'serialId': string;
      /**
       * The components of a serialized product.
       */
      'componentSerialNumbers'?: SerialNumberComponent[];
    } | Record<string, any>;
