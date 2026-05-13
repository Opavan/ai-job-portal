const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});

// ── Connect MongoDB ──
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 10000,
  family: 4
})
  .then(() => console.log(" MongoDB connected"))
  .catch(err => console.error(" MongoDB error:", err.message));

// ── Gemini AI ──
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const geminiModelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const model = genAI.getGenerativeModel({ model: geminiModelName });

// ── Models ──
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  createdAt: { type: Date, default: Date.now }
});

const ResumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  text: String,
  analysis: Object,
  createdAt: { type: Date, default: Date.now }
});

const ApplicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  company: String,
  role: String,
  location: String,
  salary: String,
  status: { type: String, default: "applied" },
  notes: String,
  appliedDate: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model("User", UserSchema);
const Resume = mongoose.model("Resume", ResumeSchema);
const Application = mongoose.model("Application", ApplicationSchema);

// ── Auth Middleware ──
const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No token" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};

// ── Auth Routes ──
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "Email already exists" });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ success: true, token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Invalid credentials" });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ success: true, token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/auth/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Resume Routes ──
app.post("/api/resume/analyze", auth, upload.single("resumeFile"), async (req, res) => {
  try {
    const body = req.body || {};
    const prompt = `Analyze this resume carefully and return ONLY valid JSON with no markdown:
{
  "score": number 0-100,
  "summary": "2 sentence professional summary of the candidate",
  "strengths": ["specific strength 1", "specific strength 2", "specific strength 3"],
  "improvements": ["specific improvement 1", "specific improvement 2", "specific improvement 3"],
  "skills": ["skill1", "skill2", "skill3", "skill4", "skill5", "skill6"],
  "experience_level": "Junior" or "Mid-level" or "Senior",
  "best_roles": ["role 1", "role 2", "role 3"],
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]
}`;

    let result;
    let resumeText = typeof body.resumeText === "string" ? body.resumeText : "";

    if (req.file) {
      if (req.file.mimetype === "text/plain") {
        resumeText = req.file.buffer.toString("utf8");
        result = await model.generateContent(`${prompt}\nResume:\n${resumeText}`);
      } else if (req.file.mimetype === "application/pdf") {
        result = await model.generateContent([
          `${prompt}\nAnalyze the attached PDF resume.`,
          {
            inlineData: {
              data: req.file.buffer.toString("base64"),
              mimeType: req.file.mimetype
            }
          }
        ]);
        resumeText = `[Uploaded PDF] ${req.file.originalname}`;
      } else {
        return res.status(400).json({ error: "Only .txt and .pdf resume files are supported right now" });
      }
    } else {
      if (!resumeText.trim()) {
        return res.status(400).json({ error: "Resume text is required" });
      }
      result = await model.generateContent(`${prompt}\nResume:\n${resumeText}`);
    }

    const text = result.response.text();
    const clean = text.replace(/```json|```/g, "").trim();
    const data = JSON.parse(clean);

    // Save to DB
    await Resume.findOneAndUpdate(
      { userId: req.userId },
      { userId: req.userId, text: resumeText, analysis: data },
      { upsert: true }
    );

    res.json({ success: true, data });
  } catch (err) {
    console.error("Resume error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/resume", auth, async (req, res) => {
  try {
    const resume = await Resume.findOne({ userId: req.userId });
    res.json({ success: true, resume });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Job Match Route ──
app.post("/api/jobs/match", auth, async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;

    const prompt = `Compare this resume with the job description using keyword and skill matching.
Return ONLY valid JSON with no markdown:
{
  "match_score": number 0-100,
  "matched_skills": ["skill1", "skill2", "skill3"],
  "missing_skills": ["skill1", "skill2", "skill3"],
  "matched_keywords": ["keyword1", "keyword2"],
  "recommendation": "specific one sentence recommendation",
  "should_apply": true or false,
  "tips": ["specific tip 1", "specific tip 2", "specific tip 3"]
}
Resume: ${resumeText}
Job Description: ${jobDescription}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const clean = text.replace(/```json|```/g, "").trim();
    res.json({ success: true, data: JSON.parse(clean) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Cover Letter Route ──
app.post("/api/cover-letter", auth, async (req, res) => {
  try {
    const { resumeText, jobDescription, companyName, jobTitle } = req.body;
    const prompt = `Write a professional, personalized cover letter for this candidate.
Company: ${companyName}
Job Title: ${jobTitle}
Keep it to 3 focused paragraphs. Be specific, confident, and professional.
Do not use generic phrases. Reference specific skills from their resume that match the job.

Resume: ${resumeText}
Job Description: ${jobDescription}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    res.json({ success: true, coverLetter: text });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Application Routes ──
app.get("/api/applications", auth, async (req, res) => {
  try {
    const apps = await Application.find({ userId: req.userId }).sort({ appliedDate: -1 });
    res.json({ success: true, applications: apps });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/applications", auth, async (req, res) => {
  try {
    const app = await Application.create({ ...req.body, userId: req.userId });
    res.json({ success: true, application: app });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/applications/:id", auth, async (req, res) => {
  try {
    const app = await Application.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    res.json({ success: true, application: app });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/applications/:id", auth, async (req, res) => {
  try {
    await Application.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/", (req, res) => res.json({ status: " AI Job Portal API running!" }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
