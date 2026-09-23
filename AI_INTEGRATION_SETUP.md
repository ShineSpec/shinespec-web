# AI Integration Setup Guide

## Overview
The "Choose for me" feature now includes AI-powered explanations for worker selection. The system works with or without OpenAI API - if no API key is provided, it uses intelligent rule-based explanations.

## What's Been Implemented

### Frontend Changes (`BookingFlow.jsx`)
1. ✅ Added AI selection modal that shows the selected worker with explanation
2. ✅ "Choose for me" button now shows a modal instead of directly proceeding
3. ✅ Users can accept or reject the AI-selected worker
4. ✅ Fallback explanation system if AI is unavailable

### Backend Changes

#### New Endpoint (`/api/workers/ai-explanation`)
- **Method**: POST
- **Auth**: Required (Bearer token)
- **Body**: 
  ```json
  {
    "workerData": {
      "fullName": "string",
      "rating": number,
      "jobsCompleted": number,
      "serviceTypes": ["string"],
      "city": "string",
      "province": "string",
      "skills": "string",
      "reviews": []
    },
    "bookingDetails": {
      "serviceType": "string",
      "hoursNeeded": number,
      "scheduledDate": "string",
      "scheduledTime": "string"
    }
  }
  ```
- **Response**: 
  ```json
  {
    "explanation": "AI-generated or rule-based explanation"
  }
  ```

## Setup Instructions

### Option 1: With OpenAI API (Recommended for best results)

1. **Get OpenAI API Key**:
   - Sign up at https://platform.openai.com/
   - Create an API key from your dashboard
   - Copy your API key

2. **Add to Backend `.env` file**:
   ```bash
   OPENAI_API_KEY=your_openai_api_key_here
   ```

3. **Install OpenAI package** (if not already installed):
   ```bash
   cd backend
   npm install openai
   ```
   
   Note: The current implementation uses `axios` to call OpenAI API directly. If you prefer using the official SDK, you can update the code.

### Option 2: Without OpenAI API (Rule-based explanations)

The system will automatically use intelligent rule-based explanations that consider:
- Worker rating (95%+ = excellent, 90%+ = strong, etc.)
- Jobs completed (100+ = extensive, 50+ = solid, etc.)
- Service type matching
- Review count and quality
- Location proximity

**No additional setup required** - it works out of the box!

## How It Works

1. User clicks "Choose for me" button
2. System selects best worker based on:
   - Service type match
   - Rating (highest first)
   - Jobs completed (most first)
3. System generates explanation:
   - **With OpenAI**: Uses GPT-3.5-turbo to create personalized explanation
   - **Without OpenAI**: Uses rule-based logic to create explanation
4. Modal shows:
   - Selected worker profile
   - AI-generated explanation
   - Accept/Reject buttons
5. User can:
   - Accept and continue to payment
   - Reject and choose manually

## Testing

### Test with OpenAI:
1. Add `OPENAI_API_KEY` to `.env`
2. Click "Choose for me"
3. Should see AI-generated explanation

### Test without OpenAI:
1. Remove or don't set `OPENAI_API_KEY`
2. Click "Choose for me"
3. Should see rule-based explanation

## Cost Considerations

- **OpenAI GPT-3.5-turbo**: ~$0.001-0.002 per explanation (very cheap)
- **Rule-based**: Free (no API costs)

## Future Enhancements

Possible improvements:
- Use worker availability for better matching
- Consider distance from booking address
- Factor in worker's past performance for similar services
- Add sentiment analysis of reviews
- Consider booking time preferences

## Troubleshooting

### If AI explanations aren't working:
1. Check `OPENAI_API_KEY` is set correctly in `.env`
2. Verify API key has credits/access
3. Check backend logs for errors
4. System will automatically fallback to rule-based explanations

### If rule-based explanations seem generic:
- This is expected - they're designed to be informative but consistent
- For more personalized explanations, use OpenAI API

