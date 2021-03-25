import Link from 'next/link';
import React from 'react';

import Paper from '@material-ui/core/Paper';

import { AnyActivity } from 'src/activities/anyActivities.types';
import { isEnigme, isPresentation, isQuestion } from 'src/activities/anyActivity';
import { getEnigmeTimeLeft } from 'src/activities/enigme.const';
import { isMascotte, isThematique } from 'src/activities/presentation.const';
import { AvatarImg } from 'src/components/Avatar';
import { Flag } from 'src/components/Flag';
import { primaryColor } from 'src/styles/variables.const';
import Timer from 'src/svg/enigme/timer.svg';
import GameIcon from 'src/svg/navigation/game-icon.svg';
import KeyIcon from 'src/svg/navigation/key-icon.svg';
import QuestionIcon from 'src/svg/navigation/question-icon.svg';
import TargetIcon from 'src/svg/navigation/target-icon.svg';
import UserIcon from 'src/svg/navigation/user-icon.svg';
import PelicoNeutre from 'src/svg/pelico/pelico_neutre.svg';
import { getUserDisplayName, toDate } from 'src/utils';
import { ActivityType } from 'types/activity.type';
import { UserType } from 'types/user.type';

import { EnigmeCard } from './EnigmeCard';
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
  isDraft = false,
  onDelete = () => {},
}: ActivityCardProps<AnyActivity>) => {
  if (!user) {
    return null;
  }
  const userIsPelico = user.type >= UserType.MEDIATOR;
  const ActivityIcon = icons[activity.type] || null;

  const timeLeft = isEnigme(activity) ? getEnigmeTimeLeft(activity) : 0;

  return (
    <Paper variant="outlined" square style={{ margin: '1rem 0' }}>
      <div className="activity-card__header">
        {user.mascotteId ? (
          <Link href={`/activite/${user.mascotteId}`}>
            <a href={`/activite/${user.mascotteId}`}>
              <AvatarImg user={user} size="small" style={{ margin: '0.25rem 0rem 0.25rem 0.25rem' }} />
            </a>
          </Link>
        ) : (
          <AvatarImg user={user} size="small" style={{ margin: '0.25rem 0rem 0.25rem 0.25rem' }} />
        )}
        <div className="activity-card__header_info">
          <p className="text">
            {user.mascotteId ? (
              <>
                <Link href={`/activite/${user.mascotteId}`}>
                  <a href={`/activite/${user.mascotteId}`}>{`${getUserDisplayName(user, isSelf)}`}</a>
                </Link>
                {' a '}
                <strong>{titles[activity.type]}</strong>
              </>
            ) : (
              <>
                {`${getUserDisplayName(user, isSelf)} a `}
                <strong>{titles[activity.type]}</strong>
              </>
            )}
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
        {!showEditButtons && isEnigme(activity) && (
          <>
            <Timer style={{ alignSelf: 'center', height: '1.2rem', width: 'auto', marginRight: '0.25rem' }} />
            <div style={{ alignSelf: 'center', marginRight: '0.5rem', lineHeight: '0.875rem' }}>
              <span className="text text--small text--error">{timeLeft > 0 ? `Temps restant: ${timeLeft}j` : 'La réponse est disponible !'}</span>
            </div>
          </>
        )}
        {ActivityIcon && <ActivityIcon style={{ fill: primaryColor, margin: '0 0.65rem', width: '2rem', height: 'auto', alignSelf: 'center' }} />}
      </div>
      <div className="activity-card__content">
        {isPresentation(activity) && isMascotte(activity) && (
          <MascotteCard
            activity={activity}
            user={user}
            isSelf={isSelf}
            noButtons={noButtons}
            showEditButtons={showEditButtons}
            isDraft={isDraft}
            onDelete={onDelete}
          />
        )}
        {isPresentation(activity) && isThematique(activity) && (
          <PresentationCard
            activity={activity}
            user={user}
            isSelf={isSelf}
            noButtons={noButtons}
            showEditButtons={showEditButtons}
            isDraft={isDraft}
            onDelete={onDelete}
          />
        )}
        {isQuestion(activity) && (
          <QuestionCard
            activity={activity}
            user={user}
            isSelf={isSelf}
            noButtons={noButtons}
            showEditButtons={showEditButtons}
            isDraft={isDraft}
            onDelete={onDelete}
          />
        )}
        {isEnigme(activity) && (
          <EnigmeCard
            activity={activity}
            user={user}
            isSelf={isSelf}
            noButtons={noButtons}
            showEditButtons={showEditButtons}
            isDraft={isDraft}
            onDelete={onDelete}
          />
        )}
      </div>
    </Paper>
  );
};
