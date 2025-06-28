// =========================================================================
// == The Unified Server - Serving both LCG and Perfect APIs            ==
// =========================================================================
const express = require('express');
const cors = require('cors');
const { lcg, perfect } = require('./babel.js');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// --- LCG (Random Walk) API Endpoints ---
app.get('/api/lcg/page', (req, res) => {
    try {
        const address = { hex: req.query.hex||'0', wall:req.query.wall||1, shelf:req.query.shelf||1, book:req.query.book||1, page:req.query.page||1 };
        const content = lcg.getPageContent(address);
        res.json({ address, content });
    } catch (error) { res.status(500).json({ error: 'Failed to generate page.' }); }
});
app.get('/api/lcg/search', (req, res) => {
    try {
        const query = (req.query.q || '').toLowerCase();
        const address = lcg.searchText(query);
        res.json({ success: !!address, address });
    } catch (error) { res.status(500).json({ error: 'Search failed.' }); }
});

// --- Perfect (Base Conversion) API Endpoints ---
app.get('/api/perfect/page', (req, res) => {
    try {
        const address = { id: req.query.id || '0' };
        const content = perfect.getPageContent(address);
        res.json({ address, content });
    } catch (error) { res.status(500).json({ error: 'Failed to generate page.' }); }
});
app.get('/api/perfect/search', (req, res) => {
    try {
        const query = (req.query.q || '').toLowerCase();
        const address = perfect.searchText(query);
        res.json({ success: !!address, address });
    } catch (error) { res.status(500).json({ error: 'Search failed.' }); }
});

app.listen(PORT, () => {
    console.log(`Unified Babel backend listening on http://localhost:${PORT}`);
});