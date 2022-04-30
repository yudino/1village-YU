import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import { isEnigme } from 'src/activity-types/anyActivity';
import { Base } from 'src/components/Base';
import { RightNavigation } from 'src/components/accueil/RightNavigation';
import { ActivityComments } from 'src/components/activities/ActivityComments';
import { ActivityView } from 'src/components/activities/ActivityView';
import { UserContext } from 'src/contexts/userContext';
import { VillageContext } from 'src/contexts/villageContext';
import { useActivity } from 'src/services/useActivity';
import { useVillageUsers } from 'src/services/useVillageUsers';
import HomeIcon from 'src/svg/navigation/home-icon.svg';
import { getQueryString } from 'src/utils';
import type { AnyData, Activity as ActivityInterface } from 'types/activity.type';
import { ActivityType } from 'types/activity.type';
import type { User } from 'types/user.type';

const titles: Record<number, (activity: ActivityInterface<AnyData>) => string> = {
  [ActivityType.MASCOTTE]: () => 'Mascotte',
  [ActivityType.PRESENTATION]: () => 'Présentation',
  [ActivityType.DEFI]: () => 'Défi',
  [ActivityType.ENIGME]: () => 'Énigme',
  [ActivityType.QUESTION]: () => 'Question',
  [ActivityType.CONTENU_LIBRE]: (a) => (a.displayAsUser ? `Message` : 'Message de Pelico'),
  [ActivityType.INDICE]: () => 'Indice culturel',
  [ActivityType.SYMBOL]: () => 'Symbole',
  [ActivityType.REPORTAGE]: () => 'Reportage',
  [ActivityType.REACTION]: () => 'Réaction',
  [ActivityType.VERSE_RECORD]: () => 'Couplet',
};

const Activity = () => {
  const router = useRouter();
  const activityId = React.useMemo(() => parseInt(getQueryString(router.query.id), 10) ?? null, [router]);
  const { user } = React.useContext(UserContext);
  const { setSelectedPhase } = React.useContext(VillageContext);
  const { activity } = useActivity(activityId);
  const { users } = useVillageUsers();
  const isAnswer = activity && isEnigme(activity) && 'reponse' in router.query;

  const usersMap = React.useMemo(() => {
    return users.reduce<{ [key: number]: User }>((acc, user) => {
      acc[user.id] = user;
      return acc;
    }, {});
  }, [users]);
  const activityUser = activity === null ? null : usersMap[activity.userId] ?? null;
  const userIsSelf = activityUser !== null && user !== null && activityUser.id === user.id;

  const activityPhase = activity ? activity.phase : -1;
  React.useEffect(() => {
    if (activityPhase !== -1) {
      setSelectedPhase(activityPhase);
    }
  }, [setSelectedPhase, activityPhase]);

  if (activity === null || activityUser === null) {
    return null;
  }

  const title = (titles[activity.type] || (() => ''))(activity);

  return (
    <Base rightNav={<RightNavigation activityUser={activityUser} displayAsUser={activity.displayAsUser} />} hideLeftNav showSubHeader>
      <div className="activity__back-container">
        <Link href="/">
          <a className="activity__back-button">
            <HomeIcon className="activity__back-button-icon" />
            Accueil
          </a>
        </Link>
        {isAnswer && isEnigme(activity) ? (
          <>
            <ChevronRightIcon />
            <Link href={`/activite/${activity.id}`}>
              <a href={`/activite/${activity.id}`} className="activity__back-button">
                Activité - {title}
              </a>
            </Link>
            <ChevronRightIcon />
            <span className="activity__back-button activity__back-button--lighter">{"Réponse à l'énigme"}</span>
          </>
        ) : (
          <>
            <ChevronRightIcon />
            <span className="activity__back-button activity__back-button--lighter">Activité - {title}</span>
          </>
        )}
      </div>

      <div className="activity__container">
        <ActivityView activity={activity} user={activityUser} isSelf={userIsSelf} />

        {!isAnswer && <ActivityComments activityId={activity.id} activityType={activity.type} activityPhase={activity.phase} usersMap={usersMap} />}
      </div>
    </Base>
  );
};

export default Activity;
