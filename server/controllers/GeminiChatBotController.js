// controllers/chatbotController.js
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Comprehensive football keywords for validation
const footballKeywords = [
    // General terms
    'football', 'soccer', 'ball', 'goal', 'match', 'game', 'player', 'team', 'club',
    'league', 'season', 'tournament', 'championship', 'cup', 'trophy', 'stadium',
    'pitch', 'field', 'referee', 'coach', 'manager', 'transfer', 'contract',
    
    // Positions & Roles
    'striker', 'forward', 'midfielder', 'defender', 'goalkeeper', 'keeper', 'winger',
    'fullback', 'centerback', 'centre-back', 'playmaker', 'attacking', 'defensive',
    'captain', 'substitute', 'bench', 'starting eleven', 'lineup',
    
    // Actions & Terms
    'score', 'scoring', 'assist', 'tackle', 'pass', 'passing', 'shot', 'shooting',
    'save', 'dribble', 'dribbling', 'header', 'penalty', 'freekick', 'free kick',
    'corner', 'throw-in', 'offside', 'foul', 'yellow card', 'red card', 'booking',
    'substitution', 'injury time', 'stoppage time', 'half-time', 'full-time',
    
    // Leagues & Competitions
    'premier league', 'epl', 'la liga', 'serie a', 'bundesliga', 'ligue 1',
    'champions league', 'ucl', 'europa league', 'uel', 'world cup', 'euro',
    'euros', 'copa america', 'uefa', 'fifa', 'fa cup', 'copa del rey',
    'serie a', 'primera division', 'championship', 'league one', 'league two',
    
    // Popular Teams (Extended)
    'barcelona', 'barca', 'real madrid', 'madrid', 'manchester united', 'man utd',
    'manchester city', 'man city', 'liverpool', 'arsenal', 'gunners', 'chelsea',
    'blues', 'tottenham', 'spurs', 'psg', 'paris', 'juventus', 'juve', 'milan',
    'ac milan', 'inter', 'inter milan', 'bayern munich', 'bayern', 'borussia dortmund',
    'dortmund', 'bvb', 'atletico madrid', 'atletico', 'sevilla', 'valencia',
    'napoli', 'roma', 'lazio', 'ajax', 'porto', 'benfica', 'sporting',
    
    // Popular Players (Current & Legends)
    'messi', 'lionel messi', 'ronaldo', 'cristiano', 'mbappe', 'kylian mbappe',
    'haaland', 'erling haaland', 'neymar', 'lewandowski', 'benzema', 'modric',
    'kroos', 'salah', 'mo salah', 'mane', 'sadio mane', 'kdb', 'de bruyne',
    'kevin de bruyne', 'kane', 'harry kane', 'son', 'heung-min son', 'vinicius',
    'pedri', 'gavi', 'bellingham', 'jude bellingham', 'rashford', 'marcus rashford',
    'nunez', 'darwin nunez', 'antony', 'casemiro', 'bruno fernandes',
    
    // Legends
    'pele', 'maradona', 'zidane', 'ronaldinho', 'kaka', 'henry', 'bergkamp',
    'cantona', 'beckham', 'gerrard', 'lampard', 'scholes', 'giggs', 'rooney',
    
    // Stats & Records
    'stats', 'statistics', 'goals', 'assists', 'clean sheets', 'wins', 'losses',
    'draws', 'points', 'table', 'standings', 'ranking', 'top scorer', 'golden boot',
    'ballon dor', 'player of the year', 'most goals', 'hat trick', 'brace',
    
    // Tactics & Formations
    'formation', 'formations', 'tactics', 'strategy', '4-4-2', '4-3-3', '3-5-2',
    '4-2-3-1', '3-4-3', '5-3-2', 'counter attack', 'pressing', 'high press',
    'possession', 'tiki taka', 'park the bus', 'offside trap', 'man marking',
    'zonal marking', 'false nine', 'wingback', 'sweeper',
    
    // Other Football Terms
    'transfer window', 'injury', 'suspension', 'debut', 'retirement', 'youth academy',
    'loan', 'buyout clause', 'release clause', 'agent', 'scout', 'training',
    'fitness', 'pre-season', 'friendly', 'testimonial', 'derby', 'rivalry',
    'supporter', 'fan', 'ultras', 'chant', 'atmosphere', 'home advantage',
    
    // Specific to your site (ScoreSpar related)
    'live score', 'fixtures', 'results', 'scorespar', 'matchday', 'gameweek'
];

/**
 * Check if the message is football-related
 */
const isFootballRelated = (message) => {
    if (!message || typeof message !== 'string') return false;
    
    const lowerMessage = message.toLowerCase();
    
    // Check for exact matches and partial matches
    return footballKeywords.some(keyword => {
        return lowerMessage.includes(keyword.toLowerCase());
    });
};

/**
 * Create optimized prompt for football chatbot
 */
const createFootballPrompt = (userMessage) => {
    return `You are an expert football (soccer) chatbot for ScoreSpar, a football scores and information website. You ONLY answer questions related to football/soccer.

Your expertise covers:
- Player statistics, careers, and transfers
- Team information, history, and current form
- League standings, fixtures, and results
- Match analysis and tactical insights
- Football rules and regulations
- Historical records and achievements
- Current football news and trends
- Youth development and academies

Response Guidelines:
1. Keep responses informative but conversational (2-4 paragraphs max)
2. Use an enthusiastic, knowledgeable tone
3. Include specific stats, dates, or facts when relevant
4. If you're not certain about recent information, mention it
5. Focus on accuracy and helpfulness
6. End with a football emoji ⚽ when appropriate

User Question: "${userMessage}"

Please provide a comprehensive, accurate, and engaging response about this football topic.`;
};

/**
 * Handle chat message - Main controller function
 */
export const handleChatMessage = async (req, res) => {
    try {
        const { message } = req.body;
        
        // Validation
        if (!message || typeof message !== 'string' || !message.trim()) {
            return res.status(400).json({
                success: false,
                error: 'Message is required and must be a non-empty string'
            });
        }

        // Check if message exceeds reasonable length
        if (message.length > 1000) {
            return res.status(400).json({
                success: false,
                error: 'Message is too long. Please keep it under 1000 characters.'
            });
        }

        // Check if the message is football-related
        if (!isFootballRelated(message)) {
            return res.json({
                success: true,
                response: "I'm your dedicated football expert! I can only help with football-related questions. Ask me about players, teams, matches, leagues, transfers, tactics, stats, or anything else related to the beautiful game! ⚽",
                isFootballRelated: false,
                timestamp: new Date().toISOString()
            });
        }

        // Generate AI response
        const prompt = createFootballPrompt(message.trim());
        
        // Call Gemini API with error handling
        const result = await model.generateContent(prompt);
        
        if (!result || !result.response) {
            throw new Error('Invalid response from AI model');
        }

        const aiResponse = result.response.text();
        
        if (!aiResponse || aiResponse.trim() === '') {
            throw new Error('Empty response from AI model');
        }

        // Success response
        return res.json({
            success: true,
            response: aiResponse.trim(),
            isFootballRelated: true,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Chatbot Controller Error:', error);
        
        // Handle specific Gemini API errors
        if (error.message?.includes('API key')) {
            return res.status(500).json({
                success: false,
                error: 'AI service configuration error. Please try again later.',
                timestamp: new Date().toISOString()
            });
        }
        
        if (error.message?.includes('quota') || error.message?.includes('limit')) {
            return res.status(429).json({
                success: false,
                error: 'Service temporarily unavailable due to high demand. Please try again in a few minutes.',
                timestamp: new Date().toISOString()
            });
        }

        // Generic error response
        return res.status(500).json({
            success: false,
            error: 'Sorry, I encountered an error while processing your football question. Please try again!',
            timestamp: new Date().toISOString()
        });
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
            message: 'ScoreSpar Football Chatbot is ready to answer your football questions!',
            capabilities: [
                'Player information and statistics',
                'Team analysis and history',
                'League standings and fixtures',
                'Match results and analysis',
                'Transfer news and rumors',
                'Tactical insights',
                'Football trivia and records'
            ],
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Chatbot Status Error:', error);
        return res.status(500).json({
            success: false,
            error: 'Unable to check chatbot status',
            timestamp: new Date().toISOString()
        });
    }
};