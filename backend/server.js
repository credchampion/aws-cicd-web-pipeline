const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'portfolio-backend'
    });
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // Validate input
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // In production, this would send email via AWS SES
        // For now, we'll just log it and return success
        console.log('Contact form submission:', {
            name,
            email,
            message,
            timestamp: new Date().toISOString()
        });

        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 1000));

        res.json({
            success: true,
            message: 'Message sent successfully!'
        });

    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again later.'
        });
    }
});

// Get portfolio projects (for dynamic content)
app.get('/api/projects', (req, res) => {
    const projects = [
        {
            id: 1,
            title: "E-Commerce Microservices",
            description: "Kubernetes-based microservices platform on AWS with Docker containers",
            technologies: ["Node.js", "Docker", "Kubernetes", "AWS EKS", "PostgreSQL"],
            github: "https://github.com/yourusername/aws-k8s-ecommerce-app",
            status: "completed"
        },
        {
            id: 2,
            title: "CI/CD Pipeline",
            description: "Automated deployment pipeline with AWS CodePipeline and Infrastructure as Code",
            technologies: ["AWS CodePipeline", "CloudFormation", "S3", "CloudFront"],
            github: "https://github.com/yourusername/aws-cicd-web-pipeline",
            status: "in-progress"
        }
    ];

    res.json({
        success: true,
        data: projects
    });
});

// Get skills/technologies
app.get('/api/skills', (req, res) => {
    const skills = {
        cloud: ["AWS", "Azure", "Google Cloud"],
        containers: ["Docker", "Kubernetes", "EKS"],
        programming: ["Node.js", "JavaScript", "Python"],
        infrastructure: ["Terraform", "CloudFormation", "CI/CD"],
        databases: ["PostgreSQL", "Redis", "MongoDB"]
    };

    res.json({
        success: true,
        data: skills
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'API endpoint not found'
    });
});

app.listen(PORT, () => {
    console.log(`Portfolio backend running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
});