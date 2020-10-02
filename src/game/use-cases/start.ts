import Game from '../game.model';
import User from '../../user/user.model';
import CustomError from '../../lib/classes/CustomError';
import { RequestHandler } from 'express';
import gameResponse from '../helpers/game-response';
import Deck from '../../lib/classes/Deck';
import { gameStatus } from '../../lib/enums/enums';

const fetchBotUserAccounts = async () => {
    const botUserAccounts = await User.find({ role: 'bot' });
    return botUserAccounts;
}

const start: RequestHandler = async (req, res, next) => {
    const userId = req.userId;
    const gameId = req.params.gameId;

    if (!userId) {
        throw new CustomError('The user does not exist.', 404);
    }

    try {
        const game = await Game.findById(gameId);
        if (!game) {
            throw new CustomError('The game does not exist.', 404);
        }

        const playerIsHost = String(game.createdBy) === userId;
        if (playerIsHost && game.handNumber === 0) {
            if (game.roundNumber === 1) {
                let botUserAccounts = await fetchBotUserAccounts();
                let botUserAccount;
                while (game.privatePlayerList.length < 4) {
                    botUserAccount = botUserAccounts.shift();
                    if (botUserAccount) {
                        game.addUserToGame(botUserAccount);
                    }
                }
                game.status = gameStatus.ACTIVE;
            }

            // betting turn
            game.currentTurn = game.playerList[game.roundNumber % 4].id;

            const { arrayOfDealtCards } = Deck.dealCards(13, 4);
            for (let i = 0; i < 4; i++) {
                game.privatePlayerList[i].cards = arrayOfDealtCards[i];
                // reset necessary info for new round 
                game.playerList[i].bet = 1;
                game.playerList[i].betPlaced = false;
                game.playerList[i].ots = 0;
                game.playerList[i].score = 0;
            }

            game.cardsOnTable = [];
            game.handNumber = 1;
            game.end = new Date();
            const savedGame = await game.save();

            res.status(200).json(gameResponse(userId, savedGame));
        } else {
            throw new CustomError('You cannot start game!', 401);
        }
    } catch (err) {
        next(err);
    }
};

export default start;