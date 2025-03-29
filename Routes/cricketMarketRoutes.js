const express = require('express');
const router = express.Router();
const betController = require('../controller/cricketMarketController');

router.post('/api/cricket-market/bets', betController.createBet);
router.get('/api/cricket-market/getbets', betController.getAllBets);
router.get('/api/cricket-market/:userId', betController.getBetsByUser);
router.get('/api/cricket-market-match/:matbet', betController.getBetsByMatch);
router.get('/api/cricket-market/:id', betController.deleteBet);
router.delete('/reset', betController.resetAllBet);
module.exports = router;
