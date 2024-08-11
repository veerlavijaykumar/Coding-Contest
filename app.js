const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const mongoose = require('mongoose');

const Problem = require('./models/problems');
const Screenshot = require('./models/screenshots');  // Import the Screenshot model

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Use multer's memory storage to keep the file in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Main database connection
const dburl = "mongodb+srv://vijaykumarveerla3377:test123@cluster0.86fpgaw.mongodb.net/contest?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(dburl, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("Connected to the contest database");
    app.listen(3000, () => {
        console.log("Server is running on port 3000");
    });
}).catch((err) => {
    console.log('Error connecting to the database:', err);
});

app.get('/ind', (req, res) => {
    res.render('index');
});

app.get('/login', async (req, res) => {
    try {
        const problems = await Problem.find({});
        res.render('upload', { problems: problems });
    } catch (err) {
        console.log('Error fetching problems:', err);
        res.status(500).send("Error fetching problems");
    }
});

app.post('/login', async (req, res) => {
    try {
        const problems = await Problem.find({});
        if (req.body.email === 'admin@gmail.com' && req.body.pass === 'admin') {
            res.render('upload', { problems: problems });
        } else {
            res.render('contest', { problems: problems });
        }
    } catch (err) {
        console.log('Error fetching problems:', err);
        res.status(500).send("Error fetching problems");
    }
});

app.get('/delete/:id', async (req, res) => {
    try {
        const result = await Problem.findByIdAndDelete(req.params.id);
        if (result) {
            console.log(`Document with ID ${req.params.id} was deleted.`);
            res.redirect('/login');
        } else {
            res.status(404).send("Document not found");
        }
    } catch (err) {
        console.log('Error deleting document:', err);
        res.status(500).send("Error deleting document");
    }
});

app.post('/upload1', (req, res) => {
    const pr = new Problem({
        problem_no: req.body.problem_no,
        problem_name: req.body.problem_name,
        problem_link: req.body.problem_link
    });
    pr.save().then(() => {
        res.redirect('/login');
    }).catch((err) => {
        console.log('Error saving problem:', err);
        res.status(500).send("Error saving problem");
    });
});

app.get('/screenshot', (req, res) => {
    res.render('screenshot');
});

app.post('/screenshot', upload.single('screenshot'), async (req, res) => {
    if (req.file) {
        try {
            const screenshot = new Screenshot({
                name: req.body.uname,
                screenshot: req.file.buffer // Save the screenshot as binary data
            });
            await screenshot.save();
            res.render("success");
        } catch (err) {
            console.log('Error saving screenshot:', err);
            res.status(500).send("Error saving screenshot");
        }
    } else {
        res.status(400).send('No file uploaded');
    }
});
app.get('/view-screenshots', async (req, res) => {
    try {
        const screenshots = await Screenshot.find({});
        res.render('view-screenshots', { screenshots: screenshots });
    } catch (err) {
        console.log('Error fetching screenshots:', err);
        res.status(500).send("Error fetching screenshots");
    }
});
app.get('/back',(req,res)=>
    {
        res.redirect('contest');
    });


