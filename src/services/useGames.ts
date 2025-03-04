import React from 'react';

import { VillageContext } from 'src/contexts/villageContext';
import { serializeToQueryUrl } from 'src/utils';
import { axiosRequest } from 'src/utils/axiosRequest';
import type { Game, GameType } from 'types/game.type';
import type { GameResponse } from 'types/gameResponse.type';

export const useGameRequests = () => {
  const { village } = React.useContext(VillageContext);

  /**
   * Return all games by type or games by type and user id from village
   *
   * @param type - type of game
   * @param villageId - id of village
   * @param userId - indicate self to retrieve all games from user by type - optional
   *
   * @returns games
   *
   */
  const getUserCreatedGamesCount = React.useCallback(
    async (type: GameType, userId?: 'self') => {
      if (!village) {
        return 0;
      }
      const response = await axiosRequest({
        method: 'GET',
        url: `/games${serializeToQueryUrl({
          type,
          villageId: village.id,
          userId,
        })}`,
      });
      if (response.error) {
        return 0;
      }
      return (response.data as Array<Game>).length;
    },
    [village],
  );

  /**
   * Return number of games available to play
   *
   * @param type - type of game
   * @param villageId - id of village
   *
   * @returns count
   *
   */

  const getAvailableGamesCount = React.useCallback(
    async (type: GameType) => {
      if (!village) {
        return 0;
      }
      const response = await axiosRequest({
        method: 'GET',
        url: `/games/ableToPlay${serializeToQueryUrl({
          villageId: village.id,
          type,
        })}`,
      });
      if (response.error) {
        return 0;
      }
      return response.data.count as number;
    },
    [village],
  );

  /**
   * Return of a random game
   *
   * @param type - type of game
   * @param villageId - id of village
   *
   * @returns Game
   *
   */

  const getRandomGame = React.useCallback(
    async (type: GameType) => {
      if (!village) {
        return undefined;
      }
      const response = await axiosRequest({
        method: 'GET',
        url: `/games/play${serializeToQueryUrl({
          villageId: village.id,
          type,
        })}`,
      });
      if (response.error) {
        return undefined;
      }
      return response.data as Game;
    },
    [village],
  );

  /**
   * Send a response for game
   *
   * @param id - id of game
   * @param value - value of the response
   *
   * @returns boolean
   *
   */

  const sendNewGameResponse = React.useCallback(async (id: number, value: string) => {
    const response = await axiosRequest({
      method: 'PUT',
      url: `/games/play/${id}`,
      data: { value },
    });
    if (response.error) {
      return false;
    }
    return true;
  }, []);

  /**
   * Return stats game
   *
   * @param id - id type of game
   *
   * @returns GameResponse[]
   *
   */
  const getGameStats = React.useCallback(async (id: number) => {
    const response = await axiosRequest({
      method: 'GET',
      url: `/games/stats/${id}`,
    });
    if (response.error) {
      return [];
    }
    return response.data as GameResponse[];
  }, []);

  return { getUserCreatedGamesCount, getAvailableGamesCount, getRandomGame, sendNewGameResponse, getGameStats };
};
