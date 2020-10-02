import { model, Schema, Document } from 'mongoose';
import IGameModel from '../lib/interfaces/IGameModel';
import { initializedGameScoresItem, initializedPlayerListItem, initializedPrivatePlayerListItem } from '../lib/interfaces/IGameModel';
import { IUserModel } from '../lib/interfaces/IUserModel';

type mongooseIdType = string | Schema.Types.ObjectId;
export interface IGameSchema extends IGameModel<mongooseIdType, mongooseIdType>, Document {
    _id: mongooseIdType;
}

const GameSchema: Schema = new Schema({
    status: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },

    roundNumber: { type: Number, default: 0 },
    handNumber: { type: Number, default: 0 },

    playerList: {
        type: [
            {
                id: { type: Schema.Types.ObjectId, ref: 'User' },
                name: { type: String },
                bot: { type: Boolean, required: true },
                bet: { type: Number, default: 0 },
                score: { type: Number, default: 0 },
                ots: { type: Number, default: 0 },
                totalScore: { type: Number, default: 0 },
                betPlaced: { type: Boolean, default: false },
            }
        ]
    },

    gameScores: {
        type: [{
            roundNumber: { type: Number },
            playerId: { type: Schema.Types.ObjectId, ref: 'User' },
            score: { type: Number }
        }]
    },
    playedHands: {
        type: [[{ suit: { type: String }, value: { type: String }, playedBy: { type: String } }]]
    },
    cardsOnTable: {
        type: [
            { suit: { type: String }, value: { type: String }, playedBy: { type: String } }
        ]
    },

    currentTurn: { type: Schema.Types.ObjectId, ref: 'User' },
    currentSuit: { type: String, required: false },
    currentWinningCard: { type: { suit: { type: String }, value: { type: String }, playedBy: { type: String } }, required: false },
    overriddenBySpade: { type: Boolean, default: false },

    gameType: { type: String },
    start: { type: Date },
    end: { type: Date },

    privatePlayerList: {
        type: [
            {
                id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
                name: { type: String },
                bot: { type: Boolean, default: false },
                cards: { type: [{ suit: { type: String }, value: { type: String }, playedBy: { type: String } }], default: [] },
                possibleMoves: { type: [{ suit: { type: String }, value: { type: String }, playedBy: { type: String } }], default: [] }
            }
        ]
    }
});

GameSchema.methods = {
    addUserToGame(user: IUserModel<mongooseIdType>) {
        this.playerList.push(initializedPlayerListItem(user));
        this.privatePlayerList.push(initializedPrivatePlayerListItem(user));
        this.gameScores.push(initializedGameScoresItem(user._id));
    }
};

GameSchema.statics = {};

export default model<IGameSchema>('Game', GameSchema);