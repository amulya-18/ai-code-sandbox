const express = require('express');
const router = express.Router();
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

router.post('/run', async (req, res) => {
  const { code, language } = req.body;

  try {
    const ext = language === 'python' ? 'py' : language === 'javascript' ? 'js' : 'cpp';
    const filename = path.join(__dirname, '..', 'temp', `temp_${Date.now()}.${ext}`);
    fs.writeFileSync(filename, code, { encoding: 'utf8' });

    let command;

    if (language === 'python') {
      command = `python "${filename}"`;
    } else if (language === 'javascript') {
      command = `node "${filename}"`;
    } else if (language === 'cpp') {
      const outFile = filename.replace('.cpp', '.exe');
      command = `g++ "${filename}" -o "${outFile}" && "${outFile}"`;
    }

    exec(command, { timeout: 10000 }, (error, stdout, stderr) => {
      try {
        if (fs.existsSync(filename)) fs.unlinkSync(filename);
        if (language === 'cpp') {
          const outFile = filename.replace('.cpp', '.exe');
          if (fs.existsSync(outFile)) fs.unlinkSync(outFile);
        }
      } catch (e) {}

      if (stderr) {
        return res.json({ output: stderr.replace(/\r\n/g, '\n').trim(), isError: true });
      }
      if (error) {
        return res.json({ output: error.message.replace(/\r\n/g, '\n').trim(), isError: true });
      }
      res.json({ output: stdout.replace(/\r\n/g, '\n').trim(), isError: false });
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;