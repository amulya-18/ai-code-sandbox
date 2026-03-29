const express = require('express');
const router = express.Router();
const Snippet = require('../models/Snippet');

// Save a snippet
router.post('/save', async (req, res) => {
  const { title, code, language } = req.body;

  try {
    const snippet = new Snippet({ title, code, language });
    await snippet.save();
    res.json({ message: 'Snippet saved!', snippet });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all snippets
router.get('/all', async (req, res) => {
  try {
    const snippets = await Snippet.find().sort({ createdAt: -1 });
    res.json({ snippets });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a snippet
router.delete('/delete/:id', async (req, res) => {
  try {
    await Snippet.findByIdAndDelete(req.params.id);
    res.json({ message: 'Snippet deleted!' });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;