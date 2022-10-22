/*
 * Copyright (c) 2022 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { OpenApiRequestBuilder } from '@sap-cloud-sdk/openapi';
import type { MaterialTraceabilityEventNotification } from './schema';
/**
 * Representation of the 'EventDataApi'.
 * This API is part of the 'MaterialTraceabilityEventNotification_Provider' service.
 */
export const EventDataApi = {
  /**
   * Lets you create and update material genealogy data in a material traceability network. The data is structured in the API by the supply chain events produce, deliver, and receive. With this information, the material traceability option for SAP Logistics Business Network can build up a complete picture of the materials used throughout the supply chain. The API is described from the perspective of the material traceability option as the provider of the endpoint. This API uses client certificates as an authentication method. For more information, see [ Administration Guide - Connectivity - Certificates](https://help.sap.com/viewer/d42cfa0f03cf400f8952fff0da9635d2/LBN/en-US/52ff1d1e641248388d8415c1db2a9478.html)
   * @param body - Creates and updates an event in the network.
   * @returns The request builder, use the `execute()` method to trigger the request.
   */
  create: (body: MaterialTraceabilityEventNotification) => new OpenApiRequestBuilder<string>(
    'post',
    '/',
    {
          body
        }
  )
};
