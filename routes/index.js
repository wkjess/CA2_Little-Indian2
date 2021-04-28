const express = require('express'),
router = express.Router();

const Music = require('../models/music');

router.get('/', async (req, res) => { 
    const music = await Music.find();

    res.render('index', {
        music
    });
});

router.post('/add', (req, res) => {

    const music = new Music(req.body);
    music.save();
    res.redirect('/');    
}); 

router.get('/edit/:id', async (req, res) => {
    
    const { id } = req.params;
    const music = await Music.findById(id);
    res.render('edit', {
        music
    });
}); 

router.post('/edit/:id', async (req, res) => {
    
    const { id } = req.params;
    await Music.update ({ _id: id }, req.body);
    res.redirect('/');
});

router.get('/delete/:id', async (req, res) => {
    
    const { id } = req.params;
    await Music.remove({_id: id });
    res.redirect('/');
});

module.exports = router;