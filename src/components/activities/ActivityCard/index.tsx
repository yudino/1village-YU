import React from 'react';

import Paper from '@material-ui/core/Paper';

import { AnyActivity } from 'src/activities/anyActivities.types';
import { isPresentation, isQuestion } from 'src/activities/anyActivity';
import { isMascotte, isThematique } from 'src/activities/presentation.const';
import { AvatarImg } from 'src/components/Avatar';
import { Flag } from 'src/components/Flag';
import { primaryColor } from 'src/styles/variables.const';
import GameIcon from 'src/svg/navigation/game-icon.svg';
import KeyIcon from 'src/svg/navigation/key-icon.svg';
import QuestionIcon from 'src/svg/navigation/question-icon.svg';
import TargetIcon from 'src/svg/navigation/target-icon.svg';
import UserIcon from 'src/svg/navigation/user-icon.svg';
import PelicoNeutre from 'src/svg/pelico/pelico_neutre.svg';
import { getUserDisplayName, toDate } from 'src/utils';
import { ActivityType } from 'types/activity.type';
import { UserType } from 'types/user.type';

import { MascotteCard } from './MascotteCard';
import { PresentationCard } from './PresentationCard';
import { QuestionCard } from './QuestionCard';
import { ActivityCardProps } from './activity-card.types';

const titles = {
  [ActivityType.PRESENTATION]: 'créé une présentation',
  [ActivityType.DEFI]: 'créé un défi',
  [ActivityType.GAME]: 'lancé un jeu',
  [ActivityType.ENIGME]: 'créé une énigme',
  [ActivityType.QUESTION]: 'posé une question',
};
const icons = {
  [ActivityType.PRESENTATION]: UserIcon,
  [ActivityType.DEFI]: TargetIcon,
  [ActivityType.GAME]: GameIcon,
  [ActivityType.ENIGME]: KeyIcon,
  [ActivityType.QUESTION]: QuestionIcon,
};

export const ActivityCard: React.FC<ActivityCardProps<AnyActivity>> = ({
  activity,
  user,
  isSelf = false,
  noButtons = false,
  showEditButtons = false,
  onDelete = () => {},
}: ActivityCardProps<AnyActivity>) => {
  if (!user) {
    return null;
  }
  const userIsPelico = user.type >= UserType.MEDIATOR;
  const ActivityIcon = icons[activity.type] || null;

  return (
    <Paper variant="outlined" square style={{ margin: '1rem 0' }}>
      <div className="activity-card__header">
        <AvatarImg user={user} size="small" style={{ margin: '0.25rem' }} />
        <div className="activity-card__header_info">
          <p className="text">
            {`${getUserDisplayName(user, isSelf)} a `}
            <strong>{titles[activity.type]}</strong>
          </p>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <p className="text text--small">Publié le {toDate(activity.createDate as string)} </p>
            {userIsPelico ? (
              <PelicoNeutre style={{ marginLeft: '0.6rem', height: '16px', width: 'auto' }} />
            ) : (
              <Flag country={user.countryCode} size="small" style={{ marginLeft: '0.6rem' }} />
            )}
          </div>
        </div>
        {ActivityIcon && <ActivityIcon style={{ fill: primaryColor, margin: '0 0.65rem' }} height="45px" />}
      </div>
      <div className="activity-card__content">
        {isPresentation(activity) && isMascotte(activity) && (
          <MascotteCard activity={activity} user={user} isSelf={isSelf} noButtons={noButtons} showEditButtons={showEditButtons} onDelete={onDelete} />
        )}
        {isPresentation(activity) && isThematique(activity) && (
          <PresentationCard
            activity={activity}
            user={user}
            isSelf={isSelf}
            noButtons={noButtons}
            showEditButtons={showEditButtons}
            onDelete={onDelete}
          />
        )}
        {isQuestion(activity) && (
          <QuestionCard activity={activity} user={user} isSelf={isSelf} noButtons={noButtons} showEditButtons={showEditButtons} onDelete={onDelete} />
        )}
      </div>
    </Paper>
  );
};
