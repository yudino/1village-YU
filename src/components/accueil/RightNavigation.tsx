import Image from 'next/image';
import React from 'react';

import { Button } from '@mui/material';

import { isMascotte } from 'src/activity-types/anyActivity';
import { Map } from 'src/components/Map';
import { icons, DESC } from 'src/components/activities/utils';
import { UserContext } from 'src/contexts/userContext';
import { useActivities } from 'src/services/useActivities';
import { useActivity } from 'src/services/useActivity';
import { useWeather } from 'src/services/useWeather';
import { primaryColor } from 'src/styles/variables.const';
import UserIcon from 'src/svg/navigation/user-icon.svg';
import { getMapPosition } from 'src/utils/getMapPosition';
import { getUserDisplayName, toDate } from 'src/utils';
import type { User } from 'types/user.type';
import { UserType } from 'types/user.type';

import { AvatarImg } from '../Avatar';
import { Flag } from '../Flag';
import { CommentIcon } from '../activities/ActivityCard/CommentIcon';

export const RightNavigation = ({ activityUser }: { activityUser: User }) => {
  const [position, setPosition] = React.useState<[number, number] | null>(null);
  const [localTime, setLocalTime] = React.useState<string | null>(null);
  const { user } = React.useContext(UserContext);
  const weather = useWeather({ activityUser });
  const { activity: userMascotte } = useActivity(activityUser.mascotteId || -1);
  const { activities } = useActivities({
    limit: 200,
    page: 0,
    type: [],
    userId: activityUser?.id ?? 0,
  });
  const isPelico = activityUser.type > UserType.TEACHER;

  // ---- Get user position ----
  const getPosition = React.useCallback(async () => {
    if (activityUser === null) {
      setPosition(null);
    } else {
      const pos = await getMapPosition(activityUser);
      setPosition(pos);
    }
  }, [activityUser]);
  React.useEffect(() => {
    getPosition().catch();
  }, [activityUser, getPosition]);

  // ---- Get user weather and time ----
  React.useEffect(() => {
    if (weather !== null) {
      const timezone = weather.timezone;
      const updateLocalTime = () => {
        const time = new Date();
        time.setHours(time.getHours() + time.getTimezoneOffset() / 60 + timezone / 3600);
        setLocalTime(`${`0${time.getHours()}`.slice(-2)}h${`0${time.getMinutes()}`.slice(-2)}`);
      };
      updateLocalTime();
      const interval = window.setInterval(updateLocalTime, 10000); // every 10 seconds
      return () => {
        window.clearInterval(interval);
      };
    } else {
      return () => {};
    }
  }, [weather]);

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
            {isPelico || activityUser.avatar ? (
              <AvatarImg user={activityUser} size="extra-small" noLink />
            ) : (
              <UserIcon style={{ fill: 'currentcolor' }} width="30px" />
            )}
          </span>
          {isPelico ? (
            <span className="text">
              <strong>Pelico</strong>
            </span>
          ) : userMascotte && isMascotte(userMascotte) ? (
            <span
              className="text"
              style={{ fontSize: '0.9rem', margin: '0 0.25rem', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}
            >
              <strong>{userMascotte.data.mascotteName}</strong>, notre mascotte
            </span>
          ) : (
            <span
              className="text"
              style={{ fontSize: '0.9rem', margin: '0 0.25rem', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}
            >
              {getUserDisplayName(activityUser, user !== null && user.id === activityUser.id)}
            </span>
          )}
        </div>
        {!isPelico && (
          <span style={{ marginLeft: '0.25rem', display: 'flex' }}>
            <Flag country={activityUser.country.isoCode}></Flag>
          </span>
        )}
      </div>
      <div className="bg-secondary vertical-bottom-margin" style={{ borderRadius: '10px', overflow: 'hidden' }}>
        {position !== null && (
          <div style={{ height: '14rem' }}>
            <Map position={position} zoom={5} markers={[{ position: position, label: activityUser?.address }]} />
          </div>
        )}
      </div>
      {weather !== null && (
        <div
          className="bg-secondary vertical-bottom-margin"
          style={{
            fontWeight: 'bold',
            padding: '1rem',
            borderRadius: '10px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          <div style={{ marginBottom: '1rem' }}>
            <Flag country={activityUser?.country.isoCode}></Flag> {activityUser?.city}
          </div>
          {localTime}
          <Image layout="fixed" width="100px" height="100px" objectFit="contain" src={weather.iconUrl} unoptimized />
          {weather.temperature}°C
        </div>
      )}
      <div
        className="bg-secondary vertical-bottom-margin"
        style={{ padding: '1rem', borderRadius: '10px', display: 'flex', justifyContent: 'center', flexDirection: 'column' }}
      >
        <h3>
          <b>Dernières activités</b>
        </h3>
        {activities.slice(0, 3).map((activity, index) => {
          const ActivityIcon = icons[activity.type] || null;
          return (
            <div key={index}>
              <div style={{ fontSize: 'smaller', paddingBottom: '1rem' }}>
                <strong>{DESC[activity.type]},&nbsp;</strong>
                le {toDate(activity.createDate as string)}
                {ActivityIcon && (
                  <ActivityIcon
                    style={{ float: 'right', fill: primaryColor, margin: '0 0.65rem', width: '2rem', height: 'auto', alignSelf: 'center' }}
                  />
                )}
              </div>
              <div style={{ float: 'right', paddingBottom: '1rem' }}>
                <CommentIcon count={activity.commentCount} activityId={activity.id} />
                <Button component="a" color="primary" variant="outlined" href={`/activite/${activity.id}`}>
                  {"Voir l'activité"}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
