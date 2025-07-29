import { docClient, UpdateCommand, createResponse } from '/opt/nodejs/utils.mjs'; // Import from Layer

const tableName = process.env.tableName || "mytestTodoTable";

export const updateTodo = async (event) => {
    const { pathParameters, body } = event;

    const todoId = pathParameters?.id;
    if (!todoId)
        return createResponse(400, { error: "Missing todoId" });

    const { title, description, priority, completed } = JSON.parse(body || "{}");
    if (!title && !description && priority === undefined && completed === undefined)
        return createResponse(400, { error: "Nothing to update!" })

    // Build update expression parts
    let updateParts = [];
    if (title) updateParts.push("#title = :title");
    if (description !== undefined) updateParts.push("description = :description");
    if (priority !== undefined) updateParts.push("priority = :priority");
    if (completed !== undefined) updateParts.push("completed = :completed");
    
    // Always add updatedAt
    updateParts.push("updatedAt = :updatedAt");
    
    let updateExpression = `SET ${updateParts.join(", ")}`;

    try {

        const command = new UpdateCommand({
            TableName: tableName,
            Key: {
                todoId,
            },
            UpdateExpression: updateExpression,
            ...(title && {
                ExpressionAttributeNames: {
                    "#title": "title", // title might be a reserved keyword in DynamoDB
                },
            }),
            ExpressionAttributeValues: {
                ...(title && { ":title": title }),
                ...(description !== undefined && { ":description": description }),
                ...(priority !== undefined && { ":priority": priority }),
                ...(completed !== undefined && { ":completed": completed }),
                ":updatedAt": new Date().toISOString(),
            },
            ReturnValues: "ALL_NEW", // returns updated value as response
            ConditionExpression: "attribute_exists(todoId)", // ensures the item exists before updating
        });

        const response = await docClient.send(command);
        console.log(response);
        return response;

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