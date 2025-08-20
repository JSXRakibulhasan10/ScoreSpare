// controllers/chatbotController.js
import { GoogleGenerativeAI } from '@google/generative-ai';


// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Simplified football keywords - focusing on most common terms
const FOOTBALL_KEYWORDS = new Set([
    'football', 'soccer', 'goal', 'match', 'player', 'team', 'league',
    'premier league', 'la liga', 'bundesliga', 'champions league',
    'messi', 'ronaldo', 'mbappe', 'haaland',
    'barcelona', 'madrid', 'manchester', 'liverpool', 'arsenal',
    'transfer', 'score', 'fixture', 'standings', 'stats'
]);

const createPrompt = (message) => `You are ScoreSpar's football expert chatbot.
Focus on: player stats, team info, matches, leagues, transfers, and tactics.
Keep responses concise (2-3 paragraphs).
Include specific facts when relevant.
User Question: "${message}"`;

const handleError = (error, res) => {
    console.error('Chatbot Error:', error);
    const errorMessages = {
        'API key': { status: 500, message: 'AI service configuration error' },
        'quota': { status: 429, message: 'Service temporarily unavailable' },
        'limit': { status: 429, message: 'Service temporarily unavailable' }
    };

    for (const [key, { status, message }] of Object.entries(errorMessages)) {
        if (error.message?.includes(key)) {
            return res.status(status).json({
                success: false,
                error: message,
                timestamp: new Date().toISOString()
            });
        }
    }

    return res.status(500).json({
        success: false,
        error: 'An error occurred while processing your question',
        timestamp: new Date().toISOString()
    });
};

/**
 * Handle chat message - Main controller function
 */
export const handleChatMessage = async (req, res) => {
    try {
        const { message } = req.body;
        
        if (!message?.trim() || message.length > 1000) {
            return res.status(400).json({
                success: false,
                error: 'Invalid message length or format'
            });
        }

        // Check if message contains any football keywords
        const isFootballRelated = message.toLowerCase()
            .split(' ')
            .some(word => FOOTBALL_KEYWORDS.has(word));

        if (!isFootballRelated) {
            return res.json({
                success: true,
                response: "I can only help with football-related questions! ⚽",
                isFootballRelated: false,
                timestamp: new Date().toISOString()
            });
        }

        const result = await model.generateContent(createPrompt(message.trim()));
        const response = result?.response?.text()?.trim();

        if (!response) throw new Error('Empty AI response');

        return res.json({
            success: true,
            response,
            isFootballRelated: true,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        return handleError(error, res);
    }
};

/**
 * Get chatbot status/health check
 */
export const getChatbotStatus = async (req, res) => {
    try {
        return res.json({
            success: true,
            status: 'online',
            message: 'ScoreSpar Football Chatbot is ready!',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        return handleError(error, res);
    }
};