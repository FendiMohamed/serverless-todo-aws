import { docClient, PutCommand, createResponse } from '/opt/nodejs/utils.mjs'; // Import from Layer

const tableName = process.env.tableName || "mytestTodoTable";

export const createTodo = async (event) => {
    const { body } = event;
    const { todoId, title, description, priority, completed } = JSON.parse(body || "{}");

    console.log("values", todoId, title, description, priority, completed);

    if (!todoId || !title || priority === undefined) {
        return createResponse(409, { error: "Missing required attributes for the item: todoId, title, or priority." });
    }

    const command = new PutCommand({
        TableName: tableName,
        Item: {
            todoId,
            title,
            description: description || "",
            priority,
            completed: completed || false,
            createdAt: new Date().toISOString()
        },
        ConditionExpression: "attribute_not_exists(todoId)",
    });

    try {
        const response = await docClient.send(command);
        return createResponse(201, { message: "Item Created Successfully!", response });
    }
    catch (err) {
        if (err.message === "The conditional request failed")
            return createResponse(409, { error: "Item already exists!" });
        else
            return createResponse(500, {
                error: "Internal Server Error!",
                message: err.message,
            });
    }

}