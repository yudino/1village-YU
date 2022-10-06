import { useRouter } from 'next/router';
import React from 'react';

import { Button } from '@mui/material';

import { AvatarImg } from '../Avatar';
import { CommentIcon } from '../activities/ActivityCard/CommentIcon';
import { icons, DESC } from 'src/components/activities/utils';
import { useActivities } from 'src/services/useActivities';
import { primaryColor } from 'src/styles/variables.const';
import { getUserDisplayName, toDate } from 'src/utils';
import { ActivityType } from 'types/activity.type';
import type { User } from 'types/user.type';

export const PelicoProfilNavigation = ({ activeUser, displayAsUser = false }: { activeUser: User; displayAsUser?: boolean }) => {
  const router = useRouter();
  const { activities } = useActivities({
    limit: 200,
    page: 0,
    type: [],
    userId: activeUser?.id ?? 0,
  });

  const onclick = React.useCallback(() => {
    router.push(`/activite/${activeUser.mascotteId}`);
  }, [activeUser.mascotteId, router]);

  return (
    <>
      <div
        className="bg-secondary vertical-bottom-margin with-sub-header-height"
        style={{
          borderRadius: '10px',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 0.5rem',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', minWidth: 0 }}>
          <span style={{ marginRight: '0.3rem', display: 'flex' }}>
            <AvatarImg user={activeUser} size="extra-small" noLink displayAsUser={displayAsUser} onClick={onclick} style={{ cursor: 'pointer' }} />
          </span>
          <span className="text">
            <strong>{getUserDisplayName(activeUser, false, displayAsUser)}</strong>
          </span>
        </div>
      </div>
      <div
        className="bg-secondary vertical-bottom-margin"
        style={{ padding: '1rem', borderRadius: '10px', display: 'flex', justifyContent: 'center', flexDirection: 'column' }}
      >
        <h3>
          <b>Dernières activités de Pelico</b>
        </h3>
        {activities.slice(0, 3).map((activity, index) => {
          const ActivityIcon = icons[activity.type] || null;
          return (
            <div key={index}>
              {activity.type !== ActivityType.GAME && (
                <>
                  <div style={{ fontSize: 'smaller', paddingBottom: '1rem' }}>
                    <strong>{DESC[activity.type]},&nbsp;</strong>
                    le {toDate(activity.createDate as string)}
                    {ActivityIcon && (
                      <ActivityIcon
                        style={{
                          float: 'right',
                          fill: primaryColor,
                          margin: '1.5rem 0.65rem 0 0',
                          width: '2rem',
                          height: 'auto',
                          alignSelf: 'center',
                        }}
                      />
                    )}
                  </div>
                  <div style={{ paddingBottom: '1rem' }}>
                    <CommentIcon count={activity.commentCount} activityId={activity.id} />
                    <Button component="a" color="primary" variant="outlined" href={`/activite/${activity.id}`}>
                      {"Voir l'activité"}
                    </Button>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};
