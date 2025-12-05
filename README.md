# Dukem Learning

An AI-powered learning platform that helps students study more effectively through intelligent document processing, flashcard generation, quizzes, and interactive AI chat.


![Docker](https://img.shields.io/badge/docker-ready-brightgreen.svg)
![React](https://img.shields.io/badge/react-19-61dafb.svg)
![Node](https://img.shields.io/badge/node-20-339933.svg)
![AWS](https://img.shields.io/badge/aws-ec2-orange.svg)

## Live Demo
[https://dukem-learning.xyz](https://dukem-learning.xyz)
![alt text](image.png)

## 🚀 Features

- **📄 Document Upload & Processing**: Upload PDF and Markdown files for automatic text extraction and chunking
- ![alt text](image-1.png)
- **🤖 AI-Powered Study Tools**:
  - Generate flashcards automatically from your documents
  - Create custom quizzes with multiple-choice questions
  - Get AI-generated summaries of complex materials
  - Interactive chat with document context (RAG)
- **Smart Flashcards**: Review, star favorites, and track progress with spaced repetition
- ![alt text](image-2.png)
- **Quiz System**: Take quizzes, get instant feedback, and track scores
- **Progress Dashboard**: Monitor your study statistics, streaks, and achievements
- **Secure Authentication**: JWT-based user authentication and authorization

![alt text](image-3.png)

##  Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for fast development and optimized builds
- **Tailwind CSS v4** for modern, responsive styling
- **React Router v7** for client-side routing
- **Axios** for API communication
- **React Hot Toast** for notifications

### Backend
- **Node.js** with Express 5
- **TypeScript** for type safety
- **MongoDB Atlas** for cloud database
- **Mongoose** for object modeling
- **JWT** for authentication
- **Multer** for file uploads
- **Helmet** for security headers

### AI Integration
- **Google Gemini AI** for content generation
- **RAG (Retrieval-Augmented Generation)** for context-aware responses
- **Text Chunking** for efficient document processing
- **PDF Parser** for text extraction

### DevOps
- **Docker** & **Docker Compose** for containerization
- **Nginx** for reverse proxy and static file serving
- **Let's Encrypt** for SSL certificates (production)
- **GitHub Actions** ready for CI/CD

##  Prerequisites

- **Node.js** 20.x or higher
- **Docker** & **Docker Compose**
- **MongoDB Atlas** account (or local MongoDB)
- **Google Gemini API** key

##  Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/vvduth/dukem-learning.git
cd dukem-learning
```

### 2. Set Up Environment Variables

Create a `.env` file in the project root:

```env
# MongoDB Connection
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# JWT Secret (generate a strong random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Google Gemini API Key
GOOGLE_API_KEY=your-google-gemini-api-key
```

### 3. Run with Docker Compose (Recommended)

```bash
# Build and start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

**Access the application:**
- Frontend: `http://localhost`
- Backend API: `http://localhost:5000`

### 4. Run Locally (Development)

**Backend:**
```bash
cd backend
npm install
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**Access the application:**
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

## 🐳 Docker Deployment

### Build and Push Images

```bash
# Build images
docker build -t vvduth/dukem-learning-backend:latest ./backend
docker build -t vvduth/dukem-learning-frontend:latest ./frontend

# Push to Docker Hub
docker push vvduth/dukem-learning-backend:latest
docker push vvduth/dukem-learning-frontend:latest
```

### Deploy to EC2 (Production)

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions including:
- AWS EC2 setup
- Domain configuration
- SSL certificate setup
- Performance optimization for t3.micro instances

## 📁 Project Structure

```
dukem-learning/
├── backend/                 # Node.js Express backend
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Auth & error handling
│   │   ├── utils/          # AI services & helpers
│   │   └── index.ts        # Entry point
│   ├── uploads/            # File storage
│   └── Dockerfile
│
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service layer
│   │   ├── context/       # React context (Auth)
│   │   ├── utils/         # Axios instance, helpers
│   │   └── types/         # TypeScript definitions
│   ├── nginx.conf         # Nginx configuration
│   └── Dockerfile
│
├── docker-compose.yml     # Docker orchestration
├── .env.example           # Environment template
└── README.md
```

## 🔑 Key Features Explained

### RAG (Retrieval-Augmented Generation)

The platform uses RAG to provide context-aware AI responses:

1. **Document Upload**: PDFs/Markdown files are uploaded and text is extracted
2. **Text Chunking**: Documents are split into manageable chunks
3. **Semantic Search**: Relevant chunks are retrieved based on user queries
4. **AI Generation**: Google Gemini uses retrieved context to generate accurate responses

### Document Processing Flow

```
Upload → Parse (PDF/MD) → Extract Text → Chunk → Store → AI Process
```

### Authentication Flow

```
Register → JWT Token → Store in localStorage → Auto-attach to requests
```

## 🔧 Configuration

### Backend Configuration

Edit `backend/src/index.ts` for:
- CORS origins
- Port settings
- Middleware configuration
- Static file serving

### Frontend Configuration

Edit `frontend/src/utils/apiPaths.ts` for:
- API base URL
- Endpoint paths

### Nginx Configuration

Edit `frontend/nginx.conf` for:
- Reverse proxy settings
- SSL certificates (production)
- Caching rules

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/change-password` - Change password

### Documents
- `POST /api/documents/upload` - Upload document
- `GET /api/documents` - Get all documents
- `GET /api/documents/:id` - Get document by ID
- `DELETE /api/documents/:id` - Delete document

### AI Services
- `POST /api/ai/generate-flashcards` - Generate flashcards
- `POST /api/ai/generate-quiz` - Generate quiz
- `POST /api/ai/generate-summary` - Generate summary
- `POST /api/ai/chat` - Chat with document context
- `POST /api/ai/explain-concept` - Explain concept

### Flashcards
- `GET /api/flashcards/:documentId` - Get flashcards by document
- `POST /api/flashcards/:cardId/review` - Mark card as reviewed
- `POST /api/flashcards/:cardId/star` - Toggle star
- `DELETE /api/flashcards/:setId` - Delete flashcard set

### Quizzes
- `GET /api/quizzes/:documentId` - Get quizzes by document
- `GET /api/quizzes/quiz/:id` - Get quiz by ID
- `POST /api/quizzes/:id/submit` - Submit quiz answers
- `GET /api/quizzes/:id/results` - Get quiz results

### Progress
- `GET /api/progress/dashboard` - Get dashboard statistics



## Monitoring

```bash
# View container stats
docker stats

# Check logs
docker-compose logs -f

# Monitor system resources
htop
free -h
df -h
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Duc Thai**
- GitHub: [@vvduth](https://github.com/vvduth)
- Docker Hub: [vvduth](https://hub.docker.com/u/vvduth)

## 🙏 Acknowledgments

- Google Gemini AI for powerful language model capabilities
- MongoDB Atlas for reliable cloud database hosting
- React team for the excellent frontend framework
- Docker for simplifying deployment

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check [DEPLOYMENT.md](DEPLOYMENT.md) for deployment help
- Review `.github/copilot-instructions.md` for AI coding guidelines

## 🔄 Updates

See [CHANGELOG.md](CHANGELOG.md) for version history and updates.

---

**Live Demo**: [https://dukem-learning.xyz](https://dukem-learning.xyz)

**Deployed on**: AWS EC2 (t3.micro) with Docker containers
