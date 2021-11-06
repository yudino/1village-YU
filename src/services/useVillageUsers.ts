import type { QueryFunction } from 'react-query';
import { useQuery } from 'react-query';
import React from 'react';

import { UserContext } from 'src/contexts/userContext';
import { VillageContext } from 'src/contexts/villageContext';
import { serializeToQueryUrl } from 'src/utils';
import type { User } from 'types/user.type';
import { UserType } from 'types/user.type';

export const useVillageUsers = (): { users: User[] } => {
  const { axiosLoggedRequest } = React.useContext(UserContext);
  const { village } = React.useContext(VillageContext);
  const { user } = React.useContext(UserContext);

  const villageId = village ? village.id : null;
  const activePhase = village ? village.activePhase : 1;
  const isPelico = user !== null && user.type > UserType.TEACHER;
  const userCountryIsoCode = user ? user.country.isoCode : null;

  const getUsers: QueryFunction<User[]> = React.useCallback(async () => {
    if (villageId === null || userCountryIsoCode === null) {
      return [];
    }
    const response = await axiosLoggedRequest({
      method: 'GET',
      url: `/users${serializeToQueryUrl({ villageId })}`,
    });
    if (response.error) {
      return [];
    }
    if (activePhase === 1 && !isPelico) {
      return (response.data as User[]).filter((user) => user.country.isoCode === userCountryIsoCode);
    }
    return response.data as User[];
  }, [villageId, activePhase, userCountryIsoCode, isPelico, axiosLoggedRequest]);

  const { data, isLoading, error } = useQuery<User[], unknown>(['village-users', { villageId, activePhase, userCountryIsoCode, isPelico }], getUsers);

  return {
    users: isLoading || error ? [] : data || [],
  };
};
