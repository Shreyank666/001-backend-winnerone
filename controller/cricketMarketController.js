const Bet = require('../models/cricketMarketModel');
const User_Wallet = require('../models/Wallet');
const MatchK = require("../models/marketLogicModel")
// Create a new bet
exports.createBet = async (req, res) => {
    try {
        console.log("Received Data:", req.body);
        const { myBets } = req.body;

        if (!myBets || !Array.isArray(myBets)) {
            return res.status(400).json({ error: "Invalid bet data" });
        }

        const betsToSave = [];

        for (const betData of myBets) {
            const {
                userId,
                label: matbet,
                type: mode,
                odds,
                rate,
                stake,
                teamAProfit: profitA,
                teamBProfit: profitB,
                balance,
                exposure,
                currentExposure
            } = betData;

            const parsedExposure = Number(currentExposure) || 0;

            // Check if user wallet exists
            let userWallet = await User_Wallet.findOne({ user: userId });

            if (!userWallet) {
                console.log(`User wallet not found for userId: ${userId}`);
                return res.status(400).json({ error: "User wallet not found" });
            }

            // Update User Wallet
            userWallet.balance = balance;
            userWallet.exposureBalance += parsedExposure;
            await userWallet.save();

            console.log(`Updated wallet for ${userId}: Balance = ${userWallet.balance}, Exposure = ${userWallet.exposureBalance}`);

            // Create Bet Entry
            const bet = new Bet({
                userId,
                matbet,
                mode,
                odds,
                rate,
                stake,
                profitA,
                profitB,
                balance,
                exposure
            });

            betsToSave.push(bet);
        }

        console.log("Bets to be saved:", betsToSave);

        // Save all bets in one go
        if (betsToSave.length > 0) {
            const savedBets = await Bet.insertMany(betsToSave);
            console.log("Saved Bets:", savedBets);
            return res.status(201).json(savedBets);
        } else {
            return res.status(400).json({ error: "No bets to save" });
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: error.message });
    }
};




// Get all bets
exports.getAllBets = async (req, res) => {
    try {
        const bets = await Bet.find();
        console.log(bets, "bets");
        res.json(bets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get bets by userId
exports.getBetsByUser = async (req, res) => {
    try {
        console.log(req.params.userId);
        // const matchOddsData = await MatchK.find({ userId: req.params.userId }).sort({ createdAt: -1 });

        const bets = await Bet.find({ userId: req.params.userId }).sort({ createdAt: -1 });

        

        res.json(bets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getBetsByMatch = async (req, res) => {
    try {
        // console.log(req.params.userId);
        const bets = await Bet.find({ matbet: req.params.matbet }).sort({ createdAt: -1 });
        res.json(bets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete bet by ID
exports.deleteBet = async (req, res) => {
    try {
        await Bet.findByIdAndDelete(req.params.id);
        res.json({ message: 'Bet deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.resetAllBet = async (req, res) => {
    try {
        await Bet.deleteMany({});
        res.json({ message: 'All bets deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
