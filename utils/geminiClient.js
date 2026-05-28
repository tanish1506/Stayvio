const {GoogleGenerativeAI} = require('@google/generative-ai')
const ExpressError = require('./ExpressError');

//initializing gemini with APi key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({model : 'gemini-2.5-flash'});

const cleanJSON = (text) => {
    return text.replace(/```json\n?/g,"").replace(/```\n?/g,"").trim();
};

module.exports.generateItinerary = async(inputs , weatherSummary = null)=>{
    const {destination , totalBudget , duration , travelers , interests , sourceCity , transportPreference } = inputs;

    let prompt = `You are a budget-conscious travel planner for students and solo travelers in India.

Destination: ${destination}
Total Budget: ₹${totalBudget}
Duration: ${duration} days
Travelers: ${travelers}
Interests: ${interests.join(', ')}
`;

    if(sourceCity){
        prompt +=  `
Traveling FROM: ${sourceCity} TO: ${destination}
Transport Preference: ${transportPreference || 'no_preference'}

Day 1 must be a TRAVEL DAY. List real transport options (train/bus/flight) from ${sourceCity} to ${destination} with mode, cost per person in ₹, and travel duration.
Deduct the cheapest one-way travel cost from total budget before distributing remaining budget.
`;
    }

    if(weatherSummary){
        prompt += `
Weather forecast for trip dates:
${JSON.stringify(weatherSummary)}
Plan activities keeping this weather in mind.
`;
    }

    prompt += `
Distribute remaining budget as:
- 40% Accommodation
- 30% Food
- 20% Activities
- 10% Local Transport

Rules:
- Use REAL place names only
- Include local budget food spots
- Include local transport (auto, bus, metro)
- All costs in ₹
- India-specific suggestions only

Return ONLY valid JSON, no extra text, no markdown:
{
  "budgetBreakdown": {
    "travel": 0,
    "accommodation": 0,
    "food": 0,
    "activities": 0,
    "localTransport": 0
  },
  "travelDay": {
    "from": "",
    "to": "",
    "options": [{ "mode": "", "cost": 0, "duration": "" }]
  },
  "dailyItinerary": [
    {
      "day": 1,
      "title": "",
      "activities": [{ "name": "", "cost": 0, "duration": "" }],
      "food": [{ "place": "", "meal": "", "cost": 0 }],
      "localTransport": ""
    }
  ],
  "tips": []
}`

    try{
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const cleaned = cleanJSON(text);
        return JSON.parse(cleaned);
    } catch(err){
        if(err instanceof SyntaxError){
            throw new ExpressError(502,'Failed to parse AI response. Please try again.')
        }
        throw new ExpressError(502,'AI service unavailable. Please try again')
    }

};


//create packing list
module.exports.generatePackingList = async(inputs)=>{
    const {destination,duration,interests,travelDates} = inputs;

    const prompt = `Generate a smart packing list for a trip to ${destination} for ${duration} days.
Interests: ${interests.join(', ')}
${travelDates?.checkIn ? `Travel dates: ${travelDates.checkIn} to ${travelDates.checkOut}` : ''}

Return ONLY a valid JSON array of strings. Each string is one packing item. No extra text.
Example: ["sunscreen", "flip flops", "power bank"]`;

    try {   
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const cleaned = cleanJSON(text);
        return JSON.parse(cleaned);
    }catch(err){
        throw new ExpressError(502,'Failed to generate packing List');
    }

};

//AI chat follow up
module.exports.chatFollowUp = async(plan, userMessage) => {
    const prompt = `You are a travel assistant. The user has this trip plan:

Destination: ${plan.destination}
Budget: ₹${plan.totalBudget}
Duration: ${plan.duration} days
Travelers: ${plan.travelers}
Interests: ${plan.interests.join(', ')}
Itinerary: ${JSON.stringify(plan.itinerary)}

User question: ${userMessage}

Answer helpfully and concisely. Keep response under 200 words.`;
    try{
        const result = await model.generateContent(prompt);
        return result.response.text();
    }catch (err){
        throw new ExpressError(502,'AI service unavailable, PLease try again ');
    }

};
