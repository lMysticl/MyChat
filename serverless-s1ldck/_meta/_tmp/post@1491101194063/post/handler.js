'use strict';

var doc = require('dynamodb-doc');
var dynamo = new doc.DynamoDB();

// Require Serverless ENV vars
var ServerlessHelpers = require('serverless-helpers-js').loadEnv();

// Require Logic
var lib = require('../lib');

// Lambda Handler

module.exports.handler = function(event, context) {
    console.log('Received event:',JSON.stringify(event,null,2));
    console.log('Context:',JSON.stringify(context,null,2));

    var operation = event.operation;
    if(event.tableName) {
        event.payload.TableName = event.tableName;
    }

    switch(operation) {
        case 'create':
            var uuid = require('node-uuid');
            event.payload.Item.postId = uuid.v1();
            dynamo.putItem(event.payload,context.succeed({"postId":event.payload.Item.postId}));
            break;
        case 'read':
            putItemDynamoDB(event, context);
            break;
        case 'update':
            putItemDynamoDB(event, context);
            break;
        case 'delete':
            putItemDynamoDB(event, context);
            break;
        case 'list':
            putItemDynamoDB(event, context);
            break;
        default:
            context.fail(new Error('Unrecognized operation "' + operation + '"'));
    }
    function putItemDynamoDB(event, context) {
        dynamo.putItem(event.payload, context.done);
    }
};