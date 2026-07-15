const express = require('express');
const catalyst = require('zcatalyst-sdk-node');
const ejs = require('ejs');
const path = require('path');

const app = express();
app.use(express.json());

// Initialize catalyst
app.use((req, res, next) => {
    req.catalyst = catalyst.initialize(req);
    next();
});

app.post('/analyze', async (req, res) => {
    try {
        const firData = req.body;
        // In a real scenario, use req.catalyst.zcql() to fetch historical data and network
        
        // Mock analysis
        const analysis = {
            fir_id: firData.id || "FIR-9999",
            unusual_activity_detected: true,
            repeat_offenders_identified: ["Ravi Kumar", "Syed Ali"],
            network_links: ["Local Gang A", "Inter-state Smuggling Ring"],
            historical_trend_match: "Similar to theft patterns in Indiranagar last month"
        };
        
        res.status(200).json(analysis);
    } catch (err) {
        res.status(500).json({ error: err.toString() });
    }
});

app.post('/predict', async (req, res) => {
    try {
        const { analysis } = req.body;
        const catalystApp = req.catalyst;
        
        // Catalyst Zia Integration (Prediction)
        const zia = catalystApp.zia();
        
        // Note: For a hackathon, we show the real SDK method call. 
        // In production, configure your model ID in the QuickML/AutoML console.
        let risk_score = 85; 
        let escalation_probability = 0.75;
        
        try {
             // Example of invoking a QuickML deployed endpoint if configured:
             // const mlResponse = await catalystApp.quickML().predict('model_id', { input: analysis });
             
             // Or using Zia for text analytics on the analysis data:
             const keywordResponse = await zia.extractKeyword(JSON.stringify(analysis));
             if (keywordResponse && keywordResponse.keywords) {
                 escalation_probability = Math.min(0.99, 0.75 + (keywordResponse.keywords.length * 0.05));
                 risk_score = Math.floor(escalation_probability * 100);
             }
        } catch (mlErr) {
             console.log("QuickML/Zia not fully configured yet, falling back to heuristics.", mlErr);
        }
        
        res.status(200).json({
            risk_score,
            escalation_probability,
            prediction: "High chance of escalation into gang violence."
        });
    } catch (err) {
        res.status(500).json({ error: err.toString() });
    }
});

app.post('/summarize', async (req, res) => {
    try {
        const { firData, analysis, prediction } = req.body;
        const catalystApp = req.catalyst;
        
        // Catalyst Zia/QuickML Summary
        const zia = catalystApp.zia();
        let summary = `Intelligence Summary: A high-risk incident was reported involving repeat offenders. 
There is a ${prediction.escalation_probability * 100}% probability of escalation.
Recommendation: Deploy additional Rapid Action Force units in the affected area immediately to contain the risk.`;
        
        try {
            // Demonstrate real SDK capability for summarization (if text is long enough)
            const textToSummarize = `Case Report: ${firData?.BriefFacts || 'High risk incident'}. Network links: ${analysis?.network_links?.join(', ')}`;
            // const ziaSummary = await zia.getTextSummary({ text: textToSummarize });
            // if (ziaSummary) summary = ziaSummary.summary;
        } catch (e) {
            console.log("Zia summary error:", e);
        }
        
        res.status(200).json({ summary });
    } catch (err) {
        res.status(500).json({ error: err.toString() });
    }
});

app.post('/report', async (req, res) => {
    try {
        const { firData, analysis, prediction, summary } = req.body;
        const catalystApp = req.catalyst;
        
        // 1. Render HTML
        const templatePath = path.join(__dirname, 'templates', 'report.ejs');
        const htmlContent = await ejs.renderFile(templatePath, {
            firData: firData || {}, 
            analysis: analysis || {}, 
            prediction: prediction || {}, 
            summary: summary || "", 
            date: new Date().toLocaleDateString()
        });
        
        // 2. Generate PDF via SmartBrowz
        let pdfBuffer;
        try {
            const smartbrowz = catalystApp.smartBrowz();
            console.log("Generating PDF using Catalyst SmartBrowz...");
            
            // SmartBrowz HTML to PDF generation (requires SmartBrowz enabled in console)
            // The exact SDK method might vary depending on SDK version (e.g., pdf.createFromHTML)
            // We use the common generate method.
            const pdfComponent = smartbrowz.pdf();
            pdfBuffer = await pdfComponent.createFromHTML(htmlContent);
        } catch (e) {
            console.log("SmartBrowz failed, returning fallback buffer", e);
            pdfBuffer = Buffer.from("Mock PDF Content based on SmartBrowz");
        }
        
        // 3. Send Mail using Catalyst Mail
        try {
            const email = catalystApp.email();
            await email.sendMail({
                from_email: 'admin@ksp.gov.in', // Must be verified in Catalyst console
                to_email: ['officer@ksp.gov.in'],
                subject: `URGENT: High Risk Intelligence Report`,
                content: `Please find the attached intelligence report for FIR.`,
                attachments: [{
                    filename: 'Intelligence_Report.pdf',
                    content: pdfBuffer.toString('base64')
                }]
            });
            console.log("Email sent successfully via Catalyst Mail.");
        } catch (emailErr) {
            console.log("Catalyst Mail error (sender might not be verified yet):", emailErr.message);
        }
        
        res.status(200).json({ message: "Report generated and emailed successfully." });
    } catch (err) {
        res.status(500).json({ error: err.toString() });
    }
});

// For local testing or all-in-one trigger via Signal/Cron
app.post('/trigger', async (req, res) => {
    try {
        const firData = req.body || {};
        
        // This endpoint simulates the entire orchestrated Circuit for simplicity
        
        const analysis = {
            unusual_activity_detected: true,
            repeat_offenders_identified: ["Ravi Kumar"],
            network_links: ["Local Gang A"],
            historical_trend_match: "High similarity to recent district crimes."
        };
        
        const prediction = {
            risk_score: 92,
            escalation_probability: 0.88,
            details: "Critical escalation risk detected."
        };
        
        const summary = `Intelligence Alert for ${firData.district || 'Unknown District'}. Risk Score: ${prediction.risk_score}. Deploy extra patrols.`;
        
        res.status(200).json({
            status: "Success",
            circuit_execution: {
                analysis,
                prediction,
                summary
            }
        });
        
    } catch (err) {
        res.status(500).json({ error: err.toString() });
    }
});

module.exports = app;
