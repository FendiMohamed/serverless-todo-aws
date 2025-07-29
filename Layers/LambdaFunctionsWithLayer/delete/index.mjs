import { docClient, DeleteCommand, createResponse } from '/opt/nodejs/utils.mjs'; // Import from Layer

const tableName = process.env.tableName || "mytestTodoTable";

export const deleteTodo = async (event) => {
    const { pathParameters } = event;
    const todoId = pathParameters?.id;
    if (!todoId)
        return createResponse(400, { error: "Missing todoId" });

    try {
        const command = new DeleteCommand({
            TableName: tableName,
            Key: {
                todoId,
            },
            ReturnValues: "ALL_OLD", // returns deleted value as response
            ConditionExpression: "attribute_exists(todoId)", // ensures the item exists before deleting
        });

        const response = await docClient.send(command);
        return createResponse(200, { message: "Item Deleted Successfully!", response });
    }
    catch (err) {
        if (err.message === "The conditional request failed")
            return createResponse(404, { error: "Item does not exists!" });
        return createResponse(500, {
            error: "Internal Server Error!",
            message: err.message,
        });
    }
}