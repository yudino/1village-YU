import React from 'react';

import { AnyActivity } from 'src/activity-types/anyActivities.types';
import { UserContext } from 'src/contexts/userContext';
import { useVillageUsers } from 'src/services/useVillageUsers';

import { ActivityCard } from './ActivityCard';

interface ActivitiesProps {
  activities: AnyActivity[];
}

export const Activities: React.FC<ActivitiesProps> = ({ activities }: ActivitiesProps) => {
  const { user } = React.useContext(UserContext);
  const { users } = useVillageUsers();
  const userMap = React.useMemo(
    () =>
      users.reduce<{ [key: number]: number }>((acc, u, index) => {
        acc[u.id] = index;
        return acc;
      }, {}),
    [users],
  );

  return (
    <div>
      {activities.map((activity, index) => (
        <ActivityCard
          activity={activity}
          isSelf={user && activity.userId === user.id}
          user={userMap[activity.userId] !== undefined ? users[userMap[activity.userId]] : undefined}
          key={index}
        />
      ))}
    </div>
  );
};
