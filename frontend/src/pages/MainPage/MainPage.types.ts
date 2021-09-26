export interface GameStatus {
  miniumBet: number;
  numberOfPlayers: number;
  numberWinner: number;
  totalBet: number;
}

export interface CallResult {
  callResults: {
    [chainId: number]: {
      [callKey: string]: {
        blockNumber?: number;
        data?: string | null;
        fetchingBlockNumber?: number;
      };
    };
  };
}
