/*
 * Copyright (c) 2022 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
    import type { ReceiveEvent } from './receive-event';
    import type { DeliverEvent } from './deliver-event';
    import type { ProduceEvent } from './produce-event';
    import type { ReceiveSerialNumberEvent } from './receive-serial-number-event';
    import type { DeliverSerialNumberEvent } from './deliver-serial-number-event';
    import type { ProduceSerialNumberEvent } from './produce-serial-number-event';
    /**
     * A wrapper object that contains the event data that&#39;s sent to a material traceability network.
     */
    export type EventPackage = {
      /**
       * Contains data about the batches that were received at one of your plants.
       */
      'receiveEvents'?: ReceiveEvent[];
      /**
       * Contains data about the batches that were sent from one of your plants for delivery.
       */
      'deliverEvents'?: DeliverEvent[];
      /**
       * Contains data about the batches that were produced at one of your plants.
       */
      'produceEvents'?: ProduceEvent[];
      /**
       * Contains data about the receipt of serialized products.
       */
      'receiveSerialNumberEvents'?: ReceiveSerialNumberEvent[];
      /**
       * Contains data about the dispatch of serialized products.
       */
      'deliverSerialNumberEvents'?: DeliverSerialNumberEvent[];
      /**
       * Contains data about the creation of serialized products.
       */
      'produceSerialNumberEvents'?: ProduceSerialNumberEvent[];
    } | Record<string, any>;
