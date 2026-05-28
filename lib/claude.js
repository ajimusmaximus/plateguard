const ANTHROPIC_API_KEY = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY

export async function generateMealIdeas(profile, preferences, pantryItems = []) {
  const prompt = buildMealPrompt(profile, preferences, pantryItems)
  
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }]
    })
  })

  const data = await response.json()
  return data.content[0].text
}

function buildMealPrompt(profile, preferences, pantryItems) {
  const conditions = profile.conditions.join(', ')
  const avoid = preferences.avoid.join(', ')
  const pantry = pantryItems.length > 0 
    ? `They currently have: ${pantryItems.join(', ')}.` 
    : ''

  return `You are a nutrition assistant for PlateGuard, a health-focused meal planning app.

Generate 5 meal ideas for a user with the following profile:
- Conditions: ${conditions}
- Foods to avoid: ${avoid}
- Age: ${profile.age}
- Goal: ${profile.goal}
${pantry}

For each meal provide:
1. Meal name
2. Why it is good for their specific conditions (1-2 sentences, warm and encouraging tone)
3. Estimated prep time
4. Key nutritional highlights (carbs, protein, sugar)

Keep the tone friendly, practical, and motivating. Never use medical jargon.
Return as a JSON array.`
}

export async function generateSnackIdeas(profile) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `Generate 3 homemade snack ideas for someone with ${profile.conditions.join(', ')}. 
        Include recipe steps, prep time, and why it suits their condition. 
        Friendly, encouraging tone. Return as JSON array.`
      }]
    })
  })

  const data = await response.json()
  return data.content[0].text
}

export async function explainMeal(mealName, profile) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 256,
      messages: [{
        role: 'user',
        content: `In 2-3 sentences, explain why "${mealName}" is a good choice for someone with ${profile.conditions.join(', ')}. 
        Warm, encouraging, plain English. No medical jargon.`
      }]
    })
  })

  const data = await response.json()
  return data.content[0].text
}