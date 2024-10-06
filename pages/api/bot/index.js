import {
  LexRuntimeV2Client,
  RecognizeTextCommand,
} from "@aws-sdk/client-lex-runtime-v2";
import { v4 as uuidv4 } from "uuid";

// Create a Lex V2 client
const lexruntime = new LexRuntimeV2Client({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID, // Use environment variables
    secretAccessKey: process.env.SECRET_ACCESS_KEY, // Use environment variables
  },
});

// Helper function to send a message to Lex
async function sendMessageToLex(botId, botAliasId, sessionId, text) {
  const params = {
    botId: botId,
    botAliasId: botAliasId,
    localeId: "en_US", // Adjust based on your bot's locale
    sessionId: sessionId,
    text: text,
  };

  try {
    const command = new RecognizeTextCommand(params);
    const response = await lexruntime.send(command);
    return response;
  } catch (err) {
    console.error("Error sending message to Lex:", err);
    throw err;
  }
}

// Helper function to process Lex response
function processLexResponse(response) {
  let botResponses = [];

  if (response && response.messages) {
    response.messages.forEach((message) => {
      if (message.contentType === "ImageResponseCard") {
        const card = message.imageResponseCard || {};
        botResponses.push(card);
      } else if (message.content) {
        botResponses.push(message.content);
      }
    });
  }

  const sessionState = response.sessionState || {};
  const dialogState = sessionState.dialogAction
    ? sessionState.dialogAction.type
    : null;

  return { botResponses, dialogState };
}

// Next.js API route handler
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST method is allowed" });
  }

  const { userInput, sessionId: clientSessionId } = req.body;

  if (!userInput) {
    return res.status(400).json({ message: "User input is required" });
  }

  // Set botId and botAliasId from environment variables or static values
  const botId = process.env.LEX_BOT_ID; // Replace with actual bot ID
  const botAliasId = process.env.LEX_BOT_ALIAS_ID || "TSTALIASID"; // Replace with actual bot Alias ID

  const sessionId = clientSessionId || `session_${uuidv4()}`; // Generate a unique session ID if not provided

  try {
    const response = await sendMessageToLex(
      botId,
      botAliasId,
      sessionId,
      userInput
    );
    const { botResponses, dialogState } = processLexResponse(response);

    // Respond with bot message and session info
    return res.status(200).json({
      botResponses,
      dialogState,
      sessionId, // Pass back sessionId to continue the conversation
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error during conversation", error: err });
  }
}
