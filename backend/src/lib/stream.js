import {StreamChat} from "stream-chat";
import {ENV} from "./env.js"
import {StreamClient} from "@stream-io/node-sdk";
const apiKey = ENV.STREAM_API_KEY;
const apiSecret = ENV.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
    console.error("Please provide both STREAM_API_KEY and STREAM_API_SECRET");
    
}

export const chatClient = StreamChat.getInstance(apiKey, apiSecret)
export const streamClient = new StreamClient(apiKey, apiSecret)
    
export const upsertStreamUser = async(userData) => {
    
    try {
        const response = await chatClient.upsertUser(userData)
    } catch (error) {
        console.error("Error upserting stream user", error);
    }
}

export const deleteUserFromStream = async(userData) => {
    const {clerkId} = userData;
    try {
        const response = await chatClient.deleteUser(clerkId);
    } catch (error) {
        console.error("Error deleting stream user", error);
    }
}   