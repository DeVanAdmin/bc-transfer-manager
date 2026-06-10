/*!
 * Copyright (C) Microsoft Corporation. All rights reserved.
 * This file is auto-generated. Do not modify it manually.
 * Changes to this file may be overwritten.
 */

export const dataSourcesInfo = {
  "dynamicssmbsaas": {
    "tableId": "",
    "version": "",
    "primaryKey": "",
    "dataSourceType": "Connector",
    "apis": {
      "GetDataSetsMetadataV2": {
        "path": "/{connectionId}/v2/$metadata.json/environments/{environment}/datasets",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "environment",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "GetProcedureV2": {
        "path": "/{connectionId}/v2/$metadata.json/environments/{environment}/datasets/{dataset}/procedures/{procedure}",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "environment",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "dataset",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "procedure",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "GetTableV2": {
        "path": "/{connectionId}/v2/$metadata.json/environments/{environment}/datasets/{dataset}/tables/{table}",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "environment",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "dataset",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "table",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "LegacyGetDataSetsV2": {
        "path": "/{connectionId}/v2/datasets",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "GetEnvironmentsV2": {
        "path": "/{connectionId}/v2/environments",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "GetDataSetsV2": {
        "path": "/{connectionId}/v2/environments/{environment}/datasets",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "environment",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "GetProceduresV2": {
        "path": "/{connectionId}/v2/environments/{environment}/datasets/{dataset}/procedures",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "environment",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "dataset",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "ExecuteProcedureV2": {
        "path": "/{connectionId}/v2/environments/{environment}/datasets/{dataset}/procedures/{procedure}",
        "method": "POST",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "environment",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "dataset",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "procedure",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "parameters",
            "in": "body",
            "required": true,
            "type": "object"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "GetTablesV2": {
        "path": "/{connectionId}/v2/environments/{environment}/datasets/{dataset}/tables",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "environment",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "dataset",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "DeleteSubscriptionV2": {
        "path": "/{connectionId}/v2/environments/{environment}/datasets/{dataset}/tables/{table}/{triggerType}/$subscriptions/{id}",
        "method": "DELETE",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "environment",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "dataset",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "table",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "triggerType",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "id",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "void"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "RenewSubscriptionV2": {
        "path": "/{connectionId}/v2/environments/{environment}/datasets/{dataset}/tables/{table}/{triggerType}/$subscriptions/{id}",
        "method": "PATCH",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "subscription",
            "in": "body",
            "required": true,
            "type": "object"
          },
          {
            "name": "environment",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "dataset",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "table",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "triggerType",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "id",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "GetItemsV2": {
        "path": "/{connectionId}/v2/environments/{environment}/datasets/{dataset}/tables/{table}/items",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "environment",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "dataset",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "table",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "$apply",
            "in": "query",
            "required": false,
            "type": "string"
          },
          {
            "name": "$filter",
            "in": "query",
            "required": false,
            "type": "string"
          },
          {
            "name": "$orderby",
            "in": "query",
            "required": false,
            "type": "string"
          },
          {
            "name": "$top",
            "in": "query",
            "required": false,
            "type": "integer"
          },
          {
            "name": "$skip",
            "in": "query",
            "required": false,
            "type": "integer"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "PostItemV2": {
        "path": "/{connectionId}/v2/environments/{environment}/datasets/{dataset}/tables/{table}/items",
        "method": "POST",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "environment",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "dataset",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "table",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "item",
            "in": "body",
            "required": true,
            "type": "object"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "GetItemV2": {
        "path": "/{connectionId}/v2/environments/{environment}/datasets/{dataset}/tables/{table}/items/{id}",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "environment",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "dataset",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "table",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "id",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "DeleteItemV2": {
        "path": "/{connectionId}/v2/environments/{environment}/datasets/{dataset}/tables/{table}/items/{id}",
        "method": "DELETE",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "environment",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "dataset",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "table",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "id",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "void"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "PatchItemV2": {
        "path": "/{connectionId}/v2/environments/{environment}/datasets/{dataset}/tables/{table}/items/{id}",
        "method": "PATCH",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "environment",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "dataset",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "table",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "id",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "item",
            "in": "body",
            "required": true,
            "type": "object"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "CreateOnChangedItemsSubscriptionV2": {
        "path": "/{connectionId}/v2/environments/{environment}/datasets/{dataset}/tables/{table}/onchangeditems/$subscriptions",
        "method": "POST",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "subscription",
            "in": "body",
            "required": true,
            "type": "object"
          },
          {
            "name": "environment",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "dataset",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "table",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "CreateOnDeletedItemsSubscriptionV2": {
        "path": "/{connectionId}/v2/environments/{environment}/datasets/{dataset}/tables/{table}/ondeleteditems/$subscriptions",
        "method": "POST",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "subscription",
            "in": "body",
            "required": true,
            "type": "object"
          },
          {
            "name": "environment",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "dataset",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "table",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "CreateOnNewItemsSubscriptionV2": {
        "path": "/{connectionId}/v2/environments/{environment}/datasets/{dataset}/tables/{table}/onnewitems/$subscriptions",
        "method": "POST",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "subscription",
            "in": "body",
            "required": true,
            "type": "object"
          },
          {
            "name": "environment",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "dataset",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "table",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "CreateOnUpdatedItemsSubscriptionV2": {
        "path": "/{connectionId}/v2/environments/{environment}/datasets/{dataset}/tables/{table}/onupdateditems/$subscriptions",
        "method": "POST",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "subscription",
            "in": "body",
            "required": true,
            "type": "object"
          },
          {
            "name": "environment",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "dataset",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "table",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "CreateCustomerApprovalWebHookV2": {
        "path": "/{connectionId}/v2/environments/{environment}/webhook/v1/datasets/{dataset}/customerapproval",
        "method": "POST",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "environment",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "dataset",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "subscription",
            "in": "body",
            "required": true,
            "type": "object"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "CreateGeneralJournalBatchApprovalWebHookV2": {
        "path": "/{connectionId}/v2/environments/{environment}/webhook/v1/datasets/{dataset}/generaljournalbatchapproval",
        "method": "POST",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "environment",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "dataset",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "subscription",
            "in": "body",
            "required": true,
            "type": "object"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "CreateGeneralJournalLineApprovalWebHookV2": {
        "path": "/{connectionId}/v2/environments/{environment}/webhook/v1/datasets/{dataset}/generaljournallineapproval",
        "method": "POST",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "environment",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "dataset",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "subscription",
            "in": "body",
            "required": true,
            "type": "object"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "CreateItemApprovalWebHookV2": {
        "path": "/{connectionId}/v2/environments/{environment}/webhook/v1/datasets/{dataset}/itemapproval",
        "method": "POST",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "environment",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "dataset",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "subscription",
            "in": "body",
            "required": true,
            "type": "object"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "CreatePurchaseDocumentApprovalWebHookV2": {
        "path": "/{connectionId}/v2/environments/{environment}/webhook/v1/datasets/{dataset}/purchasedocumentapproval",
        "method": "POST",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "environment",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "dataset",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "subscription",
            "in": "body",
            "required": true,
            "type": "object"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "CreateSalesDocumentApprovalWebHookV2": {
        "path": "/{connectionId}/v2/environments/{environment}/webhook/v1/datasets/{dataset}/salesdocumentapproval",
        "method": "POST",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "environment",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "dataset",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "subscription",
            "in": "body",
            "required": true,
            "type": "object"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "DeleteWebHookSubscriptionV2": {
        "path": "/{connectionId}/v2/environments/{environment}/webhook/v1/datasets/{dataset}/subscriptions/{id}",
        "method": "DELETE",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "environment",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "dataset",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "id",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "void"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "CreateVendorApprovalWebHookV2": {
        "path": "/{connectionId}/v2/environments/{environment}/webhook/v1/datasets/{dataset}/vendorapproval",
        "method": "POST",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "environment",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "dataset",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "subscription",
            "in": "body",
            "required": true,
            "type": "object"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "GetProcedureV3": {
        "path": "/{connectionId}/v3/$metadata.json/bcenvironments/{bcenvironment}/companies/{company}/datasets/{dataset}/procedures/{procedure}",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "bcenvironment",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "company",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "dataset",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "procedure",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "GetDataSetsMetadataV3": {
        "path": "/{connectionId}/v3/$metadata.json/bcenvironments/{bcenvironment}/datasets",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "bcenvironment",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "GetTableV3": {
        "path": "/{connectionId}/v3/$metadata.json/bcenvironments/{bcenvironment}/datasets/{dataset}/tables/{table}",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "bcenvironment",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "dataset",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "table",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "GetFieldsV3": {
        "path": "/{connectionId}/v3/$metadata.json/bcenvironments/{bcenvironment}/datasets/{dataset}/tables/{table}/fields",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "bcenvironment",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "dataset",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "table",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "array"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "PowerAppsGetDataSetsMetadataV3": {
        "path": "/{connectionId}/v3/$metadata.json/datasets",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "PowerAppsGetTableV3": {
        "path": "/{connectionId}/v3/$metadata.json/datasets/{dataset}/tables/{table}",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "dataset",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "table",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "GetAdaptiveCardV3": {
        "path": "/{connectionId}/v3/adaptivecard/forurl/{targeturl}/forapp/{targetapp}",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "targeturl",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "targetapp",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "GetEnvironmentsV3": {
        "path": "/{connectionId}/v3/bcenvironments",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "ListBusinessEventsV3": {
        "path": "/{connectionId}/v3/bcenvironments/{bcenvironment}/businessevents",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "bcenvironment",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "GetBusinessEventPayloadFieldsV3": {
        "path": "/{connectionId}/v3/bcenvironments/{bcenvironment}/businessevents/{businessevent}/payloadfields",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "bcenvironment",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "businessevent",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "CreateBusinessEventSubscriptionV3": {
        "path": "/{connectionId}/v3/bcenvironments/{bcenvironment}/businessevents/{businessevent}/subscriptions",
        "method": "POST",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "bcenvironment",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "subscription",
            "in": "body",
            "required": true,
            "type": "object"
          },
          {
            "name": "businessevent",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "company",
            "in": "query",
            "required": false,
            "type": "string"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "DeleteBusinessEventSubscriptionV3": {
        "path": "/{connectionId}/v3/bcenvironments/{bcenvironment}/businessevents/{businessevent}/subscriptions/{id}",
        "method": "DELETE",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "bcenvironment",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "businessevent",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "id",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "void"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "RenewBusinessEventSubscriptionV3": {
        "path": "/{connectionId}/v3/bcenvironments/{bcenvironment}/businessevents/{businessevent}/subscriptions/{id}",
        "method": "PATCH",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "bcenvironment",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "subscription",
            "in": "body",
            "required": true,
            "type": "object"
          },
          {
            "name": "businessevent",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "id",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "GetCompaniesV3": {
        "path": "/{connectionId}/v3/bcenvironments/{bcenvironment}/companies",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "bcenvironment",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "InvokeMCP": {
        "path": "/{connectionId}/v3/bcenvironments/{bcenvironment}/companies/{company}/configuration/{configurationName}/mcp",
        "method": "POST",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "bcenvironment",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "configurationName",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "company",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "Mcp-Session-Id",
            "in": "header",
            "required": false,
            "type": "string"
          },
          {
            "name": "queryRequest",
            "in": "body",
            "required": false,
            "type": "object"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "GetInvokeMCP": {
        "path": "/{connectionId}/v3/bcenvironments/{bcenvironment}/companies/{company}/configuration/{configurationName}/mcp",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "bcenvironment",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "configurationName",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "company",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "Mcp-Session-Id",
            "in": "header",
            "required": false,
            "type": "string"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object"
          },
          "201": {
            "type": "object"
          }
        }
      },
      "GetBlobFromNavigationV3": {
        "path": "/{connectionId}/v3/bcenvironments/{bcenvironment}/companies/{company}/datasets/{dataset}/blobnavigationpaths/{blobnavigationpath}/invokeget",
        "method": "POST",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "bcenvironment",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "company",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "dataset",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "blobnavigationpath",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "pathParameters",
            "in": "body",
            "required": true,
            "type": "object"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "string",
            "format": "binary"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "PatchBlobFromNavigationV3": {
        "path": "/{connectionId}/v3/bcenvironments/{bcenvironment}/companies/{company}/datasets/{dataset}/blobnavigationpaths/{blobnavigationpath}/invokepatch",
        "method": "POST",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "bcenvironment",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "company",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "dataset",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "blobnavigationpath",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "pathParameters",
            "in": "body",
            "required": true,
            "type": "object"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "void"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "GetBlobFullPathV3": {
        "path": "/{connectionId}/v3/bcenvironments/{bcenvironment}/companies/{company}/datasets/{dataset}/blobs/{blobfullpath}",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "bcenvironment",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "company",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "dataset",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "blobfullpath",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "string",
            "format": "binary"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "PatchBlobFullPathV3": {
        "path": "/{connectionId}/v3/bcenvironments/{bcenvironment}/companies/{company}/datasets/{dataset}/blobs/{blobfullpath}",
        "method": "PATCH",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "bcenvironment",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "company",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "dataset",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "blobfullpath",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "body",
            "in": "body",
            "required": true,
            "type": "object"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "void"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "GetPathParametersMetadata": {
        "path": "/{connectionId}/v3/bcenvironments/{bcenvironment}/companies/{company}/datasets/{dataset}/getpathparameters/{path}",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "bcenvironment",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "company",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "dataset",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "path",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "iseditrequest",
            "in": "query",
            "required": false,
            "type": "boolean"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "NavigatePicker": {
        "path": "/{connectionId}/v3/bcenvironments/{bcenvironment}/companies/{company}/datasets/{dataset}/navigatepicker/{path}",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "bcenvironment",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "company",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "dataset",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "path",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "iseditrequest",
            "in": "query",
            "required": false,
            "type": "boolean"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "array"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "OpenPicker": {
        "path": "/{connectionId}/v3/bcenvironments/{bcenvironment}/companies/{company}/datasets/{dataset}/openpicker",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "bcenvironment",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "company",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "dataset",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "iseditrequest",
            "in": "query",
            "required": false,
            "type": "boolean"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "array"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "GetProceduresV3": {
        "path": "/{connectionId}/v3/bcenvironments/{bcenvironment}/companies/{company}/datasets/{dataset}/procedures",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "bcenvironment",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "company",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "dataset",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "ExecuteProcedureV3": {
        "path": "/{connectionId}/v3/bcenvironments/{bcenvironment}/companies/{company}/datasets/{dataset}/procedures/{procedure}",
        "method": "POST",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "bcenvironment",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "company",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "dataset",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "procedure",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "parameters",
            "in": "body",
            "required": true,
            "type": "object"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "DeleteSubscriptionV3": {
        "path": "/{connectionId}/v3/bcenvironments/{bcenvironment}/companies/{company}/datasets/{dataset}/tables/{table}/{triggerType}/$subscriptions/{id}",
        "method": "DELETE",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "bcenvironment",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "company",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "dataset",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "table",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "triggerType",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "id",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "void"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "RenewSubscriptionV3": {
        "path": "/{connectionId}/v3/bcenvironments/{bcenvironment}/companies/{company}/datasets/{dataset}/tables/{table}/{triggerType}/$subscriptions/{id}",
        "method": "PATCH",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "bcenvironment",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "company",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "subscription",
            "in": "body",
            "required": true,
            "type": "object"
          },
          {
            "name": "dataset",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "table",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "triggerType",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "id",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "GetItemsV3": {
        "path": "/{connectionId}/v3/bcenvironments/{bcenvironment}/companies/{company}/datasets/{dataset}/tables/{table}/items",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "bcenvironment",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "company",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "dataset",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "table",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "$apply",
            "in": "query",
            "required": false,
            "type": "string"
          },
          {
            "name": "$filter",
            "in": "query",
            "required": false,
            "type": "string"
          },
          {
            "name": "$orderby",
            "in": "query",
            "required": false,
            "type": "string"
          },
          {
            "name": "$top",
            "in": "query",
            "required": false,
            "type": "integer"
          },
          {
            "name": "$skip",
            "in": "query",
            "required": false,
            "type": "integer"
          },
          {
            "name": "readOnlyConnection",
            "in": "query",
            "required": false,
            "type": "boolean"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "PostItemV3": {
        "path": "/{connectionId}/v3/bcenvironments/{bcenvironment}/companies/{company}/datasets/{dataset}/tables/{table}/items",
        "method": "POST",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "bcenvironment",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "company",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "dataset",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "table",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "item",
            "in": "body",
            "required": true,
            "type": "object"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "GetItemV3": {
        "path": "/{connectionId}/v3/bcenvironments/{bcenvironment}/companies/{company}/datasets/{dataset}/tables/{table}/items/{id}",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "bcenvironment",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "company",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "dataset",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "table",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "id",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "readOnlyConnection",
            "in": "query",
            "required": false,
            "type": "boolean"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "DeleteItemV3": {
        "path": "/{connectionId}/v3/bcenvironments/{bcenvironment}/companies/{company}/datasets/{dataset}/tables/{table}/items/{id}",
        "method": "DELETE",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "bcenvironment",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "company",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "dataset",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "table",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "id",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "void"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "PatchItemV3": {
        "path": "/{connectionId}/v3/bcenvironments/{bcenvironment}/companies/{company}/datasets/{dataset}/tables/{table}/items/{id}",
        "method": "PATCH",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "bcenvironment",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "company",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "dataset",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "table",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "id",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "item",
            "in": "body",
            "required": true,
            "type": "object"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "GetFirstItemV3": {
        "path": "/{connectionId}/v3/bcenvironments/{bcenvironment}/companies/{company}/datasets/{dataset}/tables/{table}/items/first",
        "method": "POST",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "bcenvironment",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "company",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "dataset",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "table",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "body",
            "in": "body",
            "required": true,
            "type": "object"
          },
          {
            "name": "readOnlyConnection",
            "in": "query",
            "required": false,
            "type": "boolean"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "CreateOnChangedItemsSubscriptionV3": {
        "path": "/{connectionId}/v3/bcenvironments/{bcenvironment}/companies/{company}/datasets/{dataset}/tables/{table}/onchangeditems/$subscriptions",
        "method": "POST",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "bcenvironment",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "company",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "subscription",
            "in": "body",
            "required": true,
            "type": "object"
          },
          {
            "name": "dataset",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "table",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "CreateOnDeletedItemsSubscriptionV3": {
        "path": "/{connectionId}/v3/bcenvironments/{bcenvironment}/companies/{company}/datasets/{dataset}/tables/{table}/ondeleteditems/$subscriptions",
        "method": "POST",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "bcenvironment",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "company",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "subscription",
            "in": "body",
            "required": true,
            "type": "object"
          },
          {
            "name": "dataset",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "table",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "CreateOnNewItemsSubscriptionV3": {
        "path": "/{connectionId}/v3/bcenvironments/{bcenvironment}/companies/{company}/datasets/{dataset}/tables/{table}/onnewitems/$subscriptions",
        "method": "POST",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "bcenvironment",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "company",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "subscription",
            "in": "body",
            "required": true,
            "type": "object"
          },
          {
            "name": "dataset",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "table",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "CreateOnUpdatedItemsSubscriptionV3": {
        "path": "/{connectionId}/v3/bcenvironments/{bcenvironment}/companies/{company}/datasets/{dataset}/tables/{table}/onupdateditems/$subscriptions",
        "method": "POST",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "bcenvironment",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "company",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "subscription",
            "in": "body",
            "required": true,
            "type": "object"
          },
          {
            "name": "dataset",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "table",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "GetTablesForWebhookV3": {
        "path": "/{connectionId}/v3/bcenvironments/{bcenvironment}/companies/{company}/datasets/{dataset}/tablesfor/webhooks",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "bcenvironment",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "company",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "dataset",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "GetUrlV3": {
        "path": "/{connectionId}/v3/bcenvironments/{bcenvironment}/companies/{company}/pages/{page}/items/{id}/url",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "bcenvironment",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "company",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "page",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "id",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "CreateCustomerApprovalWebHookV3": {
        "path": "/{connectionId}/v3/bcenvironments/{bcenvironment}/companies/{company}/webhook/v1/customerapproval",
        "method": "POST",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "bcenvironment",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "company",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "subscription",
            "in": "body",
            "required": true,
            "type": "object"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "GetCustomerApprovalEntityPropertiesV3": {
        "path": "/{connectionId}/v3/bcenvironments/{bcenvironment}/companies/{company}/webhook/v1/customerapproval/entityproperties",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "bcenvironment",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "company",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "array"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "CreateGeneralJournalBatchApprovalWebHookV3": {
        "path": "/{connectionId}/v3/bcenvironments/{bcenvironment}/companies/{company}/webhook/v1/generaljournalbatchapproval",
        "method": "POST",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "bcenvironment",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "company",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "subscription",
            "in": "body",
            "required": true,
            "type": "object"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "GetGeneralJournalBatchApprovalEntityPropertiesV3": {
        "path": "/{connectionId}/v3/bcenvironments/{bcenvironment}/companies/{company}/webhook/v1/generaljournalbatchapproval/entityproperties",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "bcenvironment",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "company",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "array"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "CreateGeneralJournalLineApprovalWebHookV3": {
        "path": "/{connectionId}/v3/bcenvironments/{bcenvironment}/companies/{company}/webhook/v1/generaljournallineapproval",
        "method": "POST",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "bcenvironment",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "company",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "subscription",
            "in": "body",
            "required": true,
            "type": "object"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "GetGeneralJournalLineApprovalEntityPropertiesV3": {
        "path": "/{connectionId}/v3/bcenvironments/{bcenvironment}/companies/{company}/webhook/v1/generaljournallineapproval/entityproperties",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "bcenvironment",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "company",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "array"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "CreateItemApprovalWebHookV3": {
        "path": "/{connectionId}/v3/bcenvironments/{bcenvironment}/companies/{company}/webhook/v1/itemapproval",
        "method": "POST",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "bcenvironment",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "company",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "subscription",
            "in": "body",
            "required": true,
            "type": "object"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "GetItemApprovalEntityPropertiesV3": {
        "path": "/{connectionId}/v3/bcenvironments/{bcenvironment}/companies/{company}/webhook/v1/itemapproval/entityproperties",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "bcenvironment",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "company",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "array"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "CreatePurchaseDocumentApprovalWebHookV3": {
        "path": "/{connectionId}/v3/bcenvironments/{bcenvironment}/companies/{company}/webhook/v1/purchasedocumentapproval",
        "method": "POST",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "bcenvironment",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "company",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "subscription",
            "in": "body",
            "required": true,
            "type": "object"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "GetPurchaseDocumentApprovalHeaderEntityPropertiesV3": {
        "path": "/{connectionId}/v3/bcenvironments/{bcenvironment}/companies/{company}/webhook/v1/purchasedocumentapproval/headerentityproperties",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "bcenvironment",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "company",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "array"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "GetPurchaseDocumentApprovalLineEntityPropertiesV3": {
        "path": "/{connectionId}/v3/bcenvironments/{bcenvironment}/companies/{company}/webhook/v1/purchasedocumentapproval/lineentityproperties",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "bcenvironment",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "company",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "array"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "CreateSalesDocumentApprovalWebHookV3": {
        "path": "/{connectionId}/v3/bcenvironments/{bcenvironment}/companies/{company}/webhook/v1/salesdocumentapproval",
        "method": "POST",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "bcenvironment",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "company",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "subscription",
            "in": "body",
            "required": true,
            "type": "object"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "GetSalesDocumentApprovalHeaderEntityPropertiesV3": {
        "path": "/{connectionId}/v3/bcenvironments/{bcenvironment}/companies/{company}/webhook/v1/salesdocumentapproval/headerentityproperties",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "bcenvironment",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "company",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "array"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "GetSalesDocumentApprovalLineEntityPropertiesV3": {
        "path": "/{connectionId}/v3/bcenvironments/{bcenvironment}/companies/{company}/webhook/v1/salesdocumentapproval/lineentityproperties",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "bcenvironment",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "company",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "array"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "DeleteWebHookSubscriptionV3": {
        "path": "/{connectionId}/v3/bcenvironments/{bcenvironment}/companies/{company}/webhook/v1/subscriptions/{id}",
        "method": "DELETE",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "bcenvironment",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "company",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "id",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "void"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "CreateVendorApprovalWebHookV3": {
        "path": "/{connectionId}/v3/bcenvironments/{bcenvironment}/companies/{company}/webhook/v1/vendorapproval",
        "method": "POST",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "bcenvironment",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "company",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "subscription",
            "in": "body",
            "required": true,
            "type": "object"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "GetVendorApprovalEntityPropertiesV3": {
        "path": "/{connectionId}/v3/bcenvironments/{bcenvironment}/companies/{company}/webhook/v1/vendorapproval/entityproperties",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "bcenvironment",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "company",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "array"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "GetDataSetsV3": {
        "path": "/{connectionId}/v3/bcenvironments/{bcenvironment}/datasets",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "bcenvironment",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "excludeworkflowendpoints",
            "in": "query",
            "required": false,
            "type": "boolean"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "GetTablesV3": {
        "path": "/{connectionId}/v3/bcenvironments/{bcenvironment}/datasets/{dataset}/tables",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "bcenvironment",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "dataset",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "GetTablesForDeleteV3": {
        "path": "/{connectionId}/v3/bcenvironments/{bcenvironment}/datasets/{dataset}/tablesfor/delete",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "bcenvironment",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "dataset",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "GetTablesForInsertV3": {
        "path": "/{connectionId}/v3/bcenvironments/{bcenvironment}/datasets/{dataset}/tablesfor/insert",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "bcenvironment",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "dataset",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "GetTablesForUpdateV3": {
        "path": "/{connectionId}/v3/bcenvironments/{bcenvironment}/datasets/{dataset}/tablesfor/update",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "bcenvironment",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "dataset",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "GetMcpConfigurationsV3": {
        "path": "/{connectionId}/v3/bcenvironments/{bcenvironment}/mcp/configurations",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "bcenvironment",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "PowerAppsGetDataSetsV3": {
        "path": "/{connectionId}/v3/datasets",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "PowerAppsGetTablesV3": {
        "path": "/{connectionId}/v3/datasets/{dataset}/tables",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "dataset",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "PowerAppsGetItemsV3": {
        "path": "/{connectionId}/v3/datasets/{dataset}/tables/{table}/items",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "dataset",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "table",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "$apply",
            "in": "query",
            "required": false,
            "type": "string"
          },
          {
            "name": "$filter",
            "in": "query",
            "required": false,
            "type": "string"
          },
          {
            "name": "$orderby",
            "in": "query",
            "required": false,
            "type": "string"
          },
          {
            "name": "$top",
            "in": "query",
            "required": false,
            "type": "integer"
          },
          {
            "name": "$skip",
            "in": "query",
            "required": false,
            "type": "integer"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "PowerAppsPostItemV3": {
        "path": "/{connectionId}/v3/datasets/{dataset}/tables/{table}/items",
        "method": "POST",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "dataset",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "table",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "item",
            "in": "body",
            "required": true,
            "type": "object"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "PowerAppsGetItemV3": {
        "path": "/{connectionId}/v3/datasets/{dataset}/tables/{table}/items/{id}",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "dataset",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "table",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "id",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "PowerAppsDeleteItemV3": {
        "path": "/{connectionId}/v3/datasets/{dataset}/tables/{table}/items/{id}",
        "method": "DELETE",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "dataset",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "table",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "id",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "void"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "PowerAppsPatchItemV3": {
        "path": "/{connectionId}/v3/datasets/{dataset}/tables/{table}/items/{id}",
        "method": "PATCH",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "dataset",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "table",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "id",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "item",
            "in": "body",
            "required": true,
            "type": "object"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "ForASelectedRecordV3": {
        "path": "/{connectionId}/v3/hybridtriggers/foraselectedrecord",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "bcenvironment",
            "in": "query",
            "required": false,
            "type": "string"
          },
          {
            "name": "company",
            "in": "query",
            "required": false,
            "type": "string"
          },
          {
            "name": "context",
            "in": "query",
            "required": false,
            "type": "string"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "TestConnectionV3": {
        "path": "/{connectionId}/v3/testconnection",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "void"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "LegacyGetTablesV2": {
        "path": "/{connectionId}/v2/datasets/{dataset}/tables",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "dataset",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "LegacyGetItemsV2": {
        "path": "/{connectionId}/v2/datasets/{dataset}/tables/{table}/items",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "dataset",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "table",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "$apply",
            "in": "query",
            "required": false,
            "type": "string"
          },
          {
            "name": "$filter",
            "in": "query",
            "required": false,
            "type": "string"
          },
          {
            "name": "$orderby",
            "in": "query",
            "required": false,
            "type": "string"
          },
          {
            "name": "$top",
            "in": "query",
            "required": false,
            "type": "integer"
          },
          {
            "name": "$skip",
            "in": "query",
            "required": false,
            "type": "integer"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "LegacyPostItemV2": {
        "path": "/{connectionId}/v2/datasets/{dataset}/tables/{table}/items",
        "method": "POST",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "dataset",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "table",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "item",
            "in": "body",
            "required": true,
            "type": "object"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "LegacyGetItemV2": {
        "path": "/{connectionId}/v2/datasets/{dataset}/tables/{table}/items/{id}",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "dataset",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "table",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "id",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "LegacyDeleteItemV2": {
        "path": "/{connectionId}/v2/datasets/{dataset}/tables/{table}/items/{id}",
        "method": "DELETE",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "dataset",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "table",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "id",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "void"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "LegacyPatchItemV2": {
        "path": "/{connectionId}/v2/datasets/{dataset}/tables/{table}/items/{id}",
        "method": "PATCH",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "dataset",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "table",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "id",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "item",
            "in": "body",
            "required": true,
            "type": "object"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "LegacyGetDataSetsMetadataV2": {
        "path": "/{connectionId}/v2/$metadata.json/datasets",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "LegacyGetTableV2": {
        "path": "/{connectionId}/v2/$metadata.json/datasets/{dataset}/tables/{table}",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "dataset",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "table",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "ReceiveNotificationPayloadSwaggerOnlyV2": {
        "path": "/{dummyConnectionId}/v2/environments/{environment}/datasets/{dataset}/tables/{table}/{triggerType}/webhooks",
        "method": "POST",
        "parameters": [
          {
            "name": "payload",
            "in": "body",
            "required": true,
            "type": "object"
          },
          {
            "name": "environment",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "dummyConnectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "dataset",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "table",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "triggerType",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "validationToken",
            "in": "query",
            "required": false,
            "type": "string"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "ReceiveBusinessEventNotificationSwaggerOnlyV3": {
        "path": "/{dummyConnectionId}/v3/bcenvironments/{bcenvironment}/businessevents/notifications",
        "method": "POST",
        "parameters": [
          {
            "name": "bcenvironment",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "payload",
            "in": "body",
            "required": true,
            "type": "object"
          },
          {
            "name": "dummyConnectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "validationToken",
            "in": "query",
            "required": false,
            "type": "string"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "ReceiveNotificationPayloadSwaggerOnlyV3": {
        "path": "/{dummyConnectionId}/v3/bcenvironments/{bcenvironment}/companies/{company}/datasets/{dataset}/tables/{table}/{triggerType}/webhooks",
        "method": "POST",
        "parameters": [
          {
            "name": "bcenvironment",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "company",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "payload",
            "in": "body",
            "required": true,
            "type": "object"
          },
          {
            "name": "dummyConnectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "dataset",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "table",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "triggerType",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "validationToken",
            "in": "query",
            "required": false,
            "type": "string"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "ReceiveNotificationPayloadV2": {
        "path": "/v2/environments/{environment}/datasets/{dataset}/tables/{table}/{triggerType}/webhooks",
        "method": "POST",
        "parameters": [
          {
            "name": "payload",
            "in": "body",
            "required": true,
            "type": "object"
          },
          {
            "name": "environment",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "dataset",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "table",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "triggerType",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "validationToken",
            "in": "query",
            "required": false,
            "type": "string"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "void"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "ReceiveBusinessEventNotificationV3": {
        "path": "/v3/bcenvironments/{bcenvironment}/businessevents/notifications",
        "method": "POST",
        "parameters": [
          {
            "name": "bcenvironment",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "payload",
            "in": "body",
            "required": true,
            "type": "object"
          },
          {
            "name": "validationToken",
            "in": "query",
            "required": false,
            "type": "string"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "void"
          },
          "default": {
            "type": "void"
          }
        }
      },
      "ReceiveNotificationPayloadV3": {
        "path": "/v3/bcenvironments/{bcenvironment}/companies/{company}/datasets/{dataset}/tables/{table}/{triggerType}/webhooks",
        "method": "POST",
        "parameters": [
          {
            "name": "bcenvironment",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "company",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "payload",
            "in": "body",
            "required": true,
            "type": "object"
          },
          {
            "name": "dataset",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "table",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "triggerType",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "validationToken",
            "in": "query",
            "required": false,
            "type": "string"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "void"
          },
          "default": {
            "type": "void"
          }
        }
      }
    }
  }
};
