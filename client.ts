import { DynamoDB } from 'aws-sdk';

class DynamoDBClient {
    private dynamoDB: DynamoDB;
    private tableName: string;

    constructor(tableName: string) {
        this.dynamoDB = new DynamoDB.DocumentClient();
        this.tableName = tableName;
    }
    public async insertItem(item: Record<string, any>): Promise<DynamoDB.DocumentClient.PutItemOutput> {
        const params: DynamoDB.DocumentClient.PutItemInput = {
            TableName: this.tableName,
            Item: item,
        };

        try {
            const result = await this.dynamoDB.put(params).promise();
            return result;
        } catch (error) {
            console.error('Error inserting item:', error);
            throw error;
        }
    }

    // Method to select items from the table
    public async selectItems(key: Record<string, any>): Promise<DynamoDB.DocumentClient.ItemList> {
        const params: DynamoDB.DocumentClient.QueryInput = {
            TableName: this.tableName,
            KeyConditionExpression: 'yourPartitionKey = :key', // Adjust for your schema
            ExpressionAttributeValues: {
                ':key': key, // Adjust this based on the key you are querying
            },
        };

        try {
            const result = await this.dynamoDB.query(params).promise();
            return result.Items || [];
        } catch (error) {
            console.error('Error selecting items:', error);
            throw error;
        }
    }
}

const client = new DynamoDBClient('YourTableName');

const itemToInsert = {
    id: '1', // Example primary key
    name: 'Test Item',
};

client.insertItem(itemToInsert)
    .then(result => console.log('Item inserted:', result))
    .catch(error => console.error('Insert error:', error));

client.selectItems('1') // Replace with the actual key value
    .then(items => console.log('Selected items:', items))
    .catch(error => console.error('Select error:', error));
