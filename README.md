# UnLonely - Your AI Companion 💙

A kind, minimal AI companion app designed to help lonely teenagers and students. UnLonely provides a safe space to chat with a supportive AI, track moods, and reflect on emotional journeys.

## ✨ Features

- **AI Companion Chat**: Talk with an empathetic AI that understands your feelings
- **Mood Tracking**: Log your emotions with optional journal notes
- **Emotional History**: View your mood patterns over time
- **Dark Mode Support**: Comfortable viewing in any lighting
- **Mobile Responsive**: Works beautifully on all devices
- **Privacy Focused**: Your conversations and moods are stored locally

## 🚀 Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Animations**: Framer Motion
- **Database**: SQLite with Prisma ORM
- **AI**: OpenRouter API with Mixtral-8x7B model
- **Deployment**: Vercel-ready

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ installed
- OpenRouter API key ([Get one here](https://openrouter.ai/))

### Installation

1. **Clone and install dependencies**:
   ```bash
   git clone <your-repo-url>
   cd unlonely
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your OpenRouter API key:
   ```
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   DATABASE_URL="file:./dev.db"
   ```

3. **Initialize the database**:
   ```bash
   npm run db:push
   npm run db:generate
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser** and navigate to `http://localhost:3000`

## 🎯 Usage

### Chat with AI Companion
- Navigate to the Chat page
- Share your thoughts and feelings
- Receive supportive, empathetic responses
- All conversations are stored in your browser session

### Track Your Mood
- Go to the Mood Tracker page
- Select how you're feeling (Happy, Meh, Sad)
- Optionally add a journal note
- View your emotional history over time

## 🔒 Privacy & Safety

- **Local Storage**: Chat messages are stored in browser session only
- **Mood Data**: Stored locally in SQLite database
- **No Personal Data**: We don't collect or store personal information
- **Crisis Support**: The AI is programmed to encourage seeking help from trusted adults for serious concerns

## 🚀 Deployment

### Deploy to Vercel

1. **Push your code to GitHub**

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables in Vercel dashboard

3. **Database Setup**:
   - For production, consider upgrading to PostgreSQL
   - Update `DATABASE_URL` in Vercel environment variables

## 🤝 Contributing

This project is designed to help young people feel less alone. Contributions that improve the supportive nature, accessibility, or user experience are welcome.

## 📝 License

MIT License - feel free to use this project to help others.

## 💙 Support

If you're struggling with mental health, please reach out to:
- **Crisis Text Line**: Text HOME to 741741
- **National Suicide Prevention Lifeline**: 988
- **Or speak with a trusted adult, counselor, or healthcare provider**

Remember: You are not alone, and it's okay to ask for help. 💙
