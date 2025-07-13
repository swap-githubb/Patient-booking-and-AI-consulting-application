const { Groq } = require('groq-sdk');

// Instantiate Groq client (SDK reads API key from GROQ_API_KEY env var)
const groq = new Groq();

async function chatCompletion(params) {

  const response = await groq.chat.completions.create({
    model: params.model || 'deepseek-r1-distill-llama-70b',
    messages: params.messages,
    temperature: params.temperature ?? 0.3,
    max_completion_tokens: params.max_tokens ?? 1500,
    top_p: params.top_p ?? 1.0,
    stream: false,
    stop: null
  });
  return response.choices?.[0]?.message?.content?.trim() || '';
}
 
async function generateSOAPNote(transcript) {
  const prompt = `Generate a detailed SOAP note from this doctor-patient conversation:\n\n${transcript}\n\nStructure the note with clear sections: Subjective, Objective, Assessment, and Plan. Use medical terminology and maintain professional formatting. Do not mention fields whose information is not available. Sign the document with Henry Stevens, MD.`;
  return await chatCompletion({ messages: [{ role: 'user', content: prompt }], temperature: 0.3 });
}

async function generateDifferentialDiagnosis(transcript) {
  const prompt = `Based on this doctor-patient conversation:\n\n${transcript}\n\nGenerate 3-5 differential diagnoses with:\n1. Most likely diagnosis with supporting evidence\n2. Plausible alternatives\n3. Less likely but important considerations\n4. Suggest some global medicines related to the diagnosis\nFormat as a numbered list with brief rationales.`;
  return await chatCompletion({ messages: [{ role: 'user', content: prompt }], temperature: 0.4 });
}

async function generateDoctorResponse(conversation) {
  const prompt = `You are Dr. Steve, a caring and methodical doctor engaged in a conversation with a patient. Based on the conversation below, ask a clarifying follow-up question to gather more details from the patient related to the problems described in the following conversation and that required to further breakdown their problem.\n\n${conversation}\n\nRespond with only one follow-up question. If you think that you have enough data in conversation then you may ask about previous physical examination results or previous diagnostic data. And if you think that now no questions are needed to be asked then you may simply ask the patient to click on Finish conversation button.`;
  return await chatCompletion({ messages: [{ role: 'user', content: prompt }], temperature: 0.3 });
}

module.exports = {
  generateSOAPNote,
  generateDifferentialDiagnosis,
  generateDoctorResponse
};

