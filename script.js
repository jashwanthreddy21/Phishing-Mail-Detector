// DOM Elements
const emailContent = document.getElementById('emailContent');
const analyzeBtn = document.getElementById('analyzeBtn');
const charCount = document.getElementById('charCount');
const analysisResults = document.getElementById('analysisResults');

// Character counter
emailContent.addEventListener('input', function() {
    const count = this.value.length;
    charCount.textContent = count;
    
    if (count > 10000) {
        charCount.style.color = '#dc2626';
    } else {
        charCount.style.color = '#6b7280';
    }
});

// Analyze button click handler
analyzeBtn.addEventListener('click', function() {
    const content = emailContent.value.trim();
    
    if (!content) {
        alert('Please enter email content to analyze.');
        return;
    }
    
    analyzeEmail(content);
});

// Main analysis function
async function analyzeEmail(content) {
    // Show loading state
    showLoadingState();
    
    // Simulate analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Perform analysis
    const result = performAnalysis(content);
    
    // Display results
    displayResults(result);
}

// Show loading state
function showLoadingState() {
    analyzeBtn.disabled = true;
    analyzeBtn.innerHTML = `
        <div class="loading-spinner"></div>
        <span>Analyzing...</span>
    `;
    
    analysisResults.innerHTML = `
        <div class="results-placeholder">
            <div class="loading-spinner" style="width: 3rem; height: 3rem; border-width: 4px;"></div>
            <p>Analyzing email content...</p>
        </div>
    `;
}

// Reset button state
function resetButtonState() {
    analyzeBtn.disabled = false;
    analyzeBtn.innerHTML = `
        <i class="fas fa-search"></i>
        <span>Analyze Email</span>
    `;
}

// Perform email analysis
function performAnalysis(content) {
    const indicators = [];
    let riskScore = 0;
    
    // Suspicious patterns to check
    const suspiciousPatterns = [
        {
            pattern: /urgent|immediate|act now|limited time|expires today|final notice/i,
            message: 'Urgent language detected',
            severity: 'medium'
        },
        {
            pattern: /verify.*account|confirm.*identity|update.*information|suspended.*account/i,
            message: 'Account verification request',
            severity: 'high'
        },
        {
            pattern: /click here|download now|open attachment|follow.*link/i,
            message: 'Suspicious call-to-action',
            severity: 'medium'
        },
        {
            pattern: /dear customer|dear user|dear valued|dear sir\/madam/i,
            message: 'Generic greeting (lacks personalization)',
            severity: 'low'
        },
        {
            pattern: /suspended|blocked|expired|locked|terminated|cancelled/i,
            message: 'Account threat language',
            severity: 'high'
        },
        {
            pattern: /congratulations|winner|prize|lottery|jackpot|selected/i,
            message: 'Prize/lottery scam indicators',
            severity: 'high'
        },
        {
            pattern: /bitcoin|cryptocurrency|investment opportunity|double your money/i,
            message: 'Financial scam indicators',
            severity: 'medium'
        },
        {
            pattern: /social security|ssn|credit card|bank account|routing number/i,
            message: 'Requests for sensitive information',
            severity: 'high'
        },
        {
            pattern: /irs|tax refund|government|federal|stimulus/i,
            message: 'Government impersonation attempt',
            severity: 'high'
        },
        {
            pattern: /paypal|amazon|microsoft|apple|google|facebook/i,
            message: 'Brand impersonation detected',
            severity: 'medium'
        },
        {
            pattern: /free|no cost|risk-free|guaranteed|100%/i,
            message: 'Too-good-to-be-true language',
            severity: 'low'
        },
        {
            pattern: /wire transfer|western union|money gram|gift card/i,
            message: 'Suspicious payment method',
            severity: 'high'
        }
    ];
    
    // Check for suspicious patterns
    suspiciousPatterns.forEach(({ pattern, message, severity }) => {
        if (pattern.test(content)) {
            indicators.push({ type: 'negative', message, severity });
            riskScore += severity === 'high' ? 30 : severity === 'medium' ? 20 : 10;
        }
    });
    
    // Positive indicators
    const positivePatterns = [
        {
            pattern: /dear [a-z]+ [a-z]+/i,
            message: 'Personalized greeting detected',
            severity: 'low'
        },
        {
            pattern: /unsubscribe|privacy policy|terms of service|contact us/i,
            message: 'Legitimate business language',
            severity: 'low'
        },
        {
            pattern: /thank you|regards|best wishes|sincerely|kind regards/i,
            message: 'Professional closing',
            severity: 'low'
        },
        {
            pattern: /https:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
            message: 'Secure HTTPS links found',
            severity: 'low'
        }
    ];
    
    // Check for positive indicators
    positivePatterns.forEach(({ pattern, message, severity }) => {
        if (pattern.test(content)) {
            indicators.push({ type: 'positive', message, severity });
            riskScore -= 5;
        }
    });
    
    // Additional checks
    
    // Check for multiple exclamation marks
    if (/!{2,}/.test(content)) {
        indicators.push({
            type: 'negative',
            message: 'Excessive punctuation detected',
            severity: 'low'
        });
        riskScore += 5;
    }
    
    // Check for ALL CAPS
    const capsWords = content.match(/\b[A-Z]{3,}\b/g);
    if (capsWords && capsWords.length > 3) {
        indicators.push({
            type: 'negative',
            message: 'Excessive use of capital letters',
            severity: 'low'
        });
        riskScore += 10;
    }
    
    // Check for suspicious domains
    const domains = content.match(/https?:\/\/([a-zA-Z0-9.-]+)/g);
    if (domains) {
        domains.forEach(domain => {
            if (/bit\.ly|tinyurl|t\.co|goo\.gl|ow\.ly/.test(domain)) {
                indicators.push({
                    type: 'negative',
                    message: 'Shortened URL detected',
                    severity: 'medium'
                });
                riskScore += 15;
            }
        });
    }
    
    // Check for spelling errors (simple check)
    const commonMisspellings = [
        'recieve', 'seperate', 'occured', 'neccessary', 'definately',
        'accomodate', 'begining', 'beleive', 'calender', 'cemetary'
    ];
    
    commonMisspellings.forEach(misspelling => {
        if (new RegExp(misspelling, 'i').test(content)) {
            indicators.push({
                type: 'negative',
                message: 'Spelling errors detected',
                severity: 'low'
            });
            riskScore += 5;
        }
    });
    
    // Determine risk level
    let riskLevel;
    if (riskScore <= 15) {
        riskLevel = 'safe';
    } else if (riskScore <= 50) {
        riskLevel = 'suspicious';
    } else {
        riskLevel = 'dangerous';
    }
    
    // Ensure minimum indicators for empty results
    if (indicators.length === 0) {
        indicators.push({
            type: 'positive',
            message: 'No obvious threat indicators detected',
            severity: 'low'
        });
    }
    
    return {
        riskLevel,
        score: Math.min(Math.max(riskScore, 0), 100),
        indicators: indicators.slice(0, 10) // Limit to 10 indicators
    };
}

// Display analysis results
function displayResults(result) {
    resetButtonState();
    
    const riskConfig = {
        safe: {
            icon: 'fas fa-check-circle',
            class: 'safe',
            title: 'Safe Email'
        },
        suspicious: {
            icon: 'fas fa-exclamation-triangle',
            class: 'suspicious',
            title: 'Suspicious Email'
        },
        dangerous: {
            icon: 'fas fa-times-circle',
            class: 'dangerous',
            title: 'Dangerous Email'
        }
    };
    
    const config = riskConfig[result.riskLevel];
    
    const indicatorsHtml = result.indicators.map(indicator => {
        const iconClass = indicator.type === 'positive' ? 'fas fa-check-circle' : 'fas fa-exclamation-triangle';
        const itemClass = indicator.type === 'positive' ? 'positive' : `negative ${indicator.severity}`;
        
        return `
            <div class="indicator-item ${itemClass}">
                <i class="${iconClass}"></i>
                <span class="indicator-text">${indicator.message}</span>
                <span class="severity-badge">${indicator.severity}</span>
            </div>
        `;
    }).join('');
    
    analysisResults.innerHTML = `
        <div class="analysis-results">
            <div class="risk-indicator ${config.class}">
                <i class="${config.icon}"></i>
                <div class="risk-info">
                    <h3>${config.title}</h3>
                    <p>Risk Score: ${result.score}/100</p>
                </div>
            </div>
            
            <div class="detection-results">
                <h4>Detection Results</h4>
                <div class="indicators-list">
                    ${indicatorsHtml}
                </div>
            </div>
        </div>
    `;
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add some sample email content for testing
function loadSampleEmail(type) {
    const samples = {
        phishing: `Subject: URGENT: Your Account Will Be Suspended

Dear Customer,

Your account has been temporarily suspended due to suspicious activity. You must verify your identity immediately to avoid permanent closure.

Click here to verify your account: http://bit.ly/verify-now

You have 24 hours to complete this process or your account will be permanently deleted.

Thank you,
Security Team`,
        
        legitimate: `Subject: Welcome to Our Newsletter

Dear John Smith,

Thank you for subscribing to our monthly newsletter. We're excited to share valuable insights and updates with you.

You can manage your subscription preferences or unsubscribe at any time by visiting our preference center.

Best regards,
The Marketing Team
Company Name

Privacy Policy | Terms of Service | Contact Us`,
        
        suspicious: `Subject: Congratulations! You've Won $1,000,000!

Dear Winner,

CONGRATULATIONS!!! You have been selected as our GRAND PRIZE WINNER in our international lottery program.

To claim your prize of $1,000,000 USD, please provide:
- Full name
- Address
- Phone number
- Bank account details

Act now! This offer expires in 48 hours.

Contact us immediately at winner@lottery-claim.com

Best of luck,
International Lottery Commission`
    };
    
    return samples[type] || samples.phishing;
}

// Add sample buttons (optional - for testing)
function addSampleButtons() {
    const controlButtons = document.querySelector('.control-buttons');
    
    const sampleBtn = document.createElement('button');
    sampleBtn.className = 'btn btn-outline';
    sampleBtn.innerHTML = '<i class="fas fa-file-alt"></i><span>Load Sample</span>';
    sampleBtn.addEventListener('click', () => {
        emailContent.value = loadSampleEmail('phishing');
        emailContent.dispatchEvent(new Event('input'));
    });
    
    controlButtons.appendChild(sampleBtn);
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Add sample buttons for testing
    // addSampleButtons();
    
    // Set initial character count
    charCount.textContent = emailContent.value.length;
    
    console.log('PhishGuard Email Analyzer initialized successfully!');
});