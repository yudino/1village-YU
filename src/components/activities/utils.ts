import GameIcon from 'src/svg/navigation/game-icon.svg';
import IndiceIcon from 'src/svg/navigation/indice-culturel.svg';
import KeyIcon from 'src/svg/navigation/key-icon.svg';
import QuestionIcon from 'src/svg/navigation/question-icon.svg';
import ReactionIcon from 'src/svg/navigation/reaction-icon.svg';
import ReportageIcon from 'src/svg/navigation/reportage-icon.svg';
import SymbolIcon from 'src/svg/navigation/symbol-icon.svg';
import TargetIcon from 'src/svg/navigation/target-icon.svg';
import UserIcon from 'src/svg/navigation/user-icon.svg';
import { ActivityType } from 'types/activity.type';

export const titles = {
  [ActivityType.MASCOTTE]: 'créé une mascotte',
  [ActivityType.PRESENTATION]: 'créé une présentation',
  [ActivityType.DEFI]: 'créé un défi',
  [ActivityType.GAME]: 'lancé un jeu',
  [ActivityType.ENIGME]: 'créé une énigme',
  [ActivityType.QUESTION]: 'posé une question',
  [ActivityType.CONTENU_LIBRE]: 'envoyé un message à ses Pélicopains',
  [ActivityType.INDICE]: 'créé un indice culturel',
  [ActivityType.SYMBOL]: 'créé un symbole',
  [ActivityType.REPORTAGE]: 'réalisé un reportage',
  [ActivityType.REACTION]: 'réagi à',
};

export const icons = {
  [ActivityType.MASCOTTE]: UserIcon,
  [ActivityType.PRESENTATION]: UserIcon,
  [ActivityType.DEFI]: TargetIcon,
  [ActivityType.GAME]: GameIcon,
  [ActivityType.ENIGME]: KeyIcon,
  [ActivityType.QUESTION]: QuestionIcon,
  [ActivityType.CONTENU_LIBRE]: '',
  [ActivityType.INDICE]: IndiceIcon,
  [ActivityType.SYMBOL]: SymbolIcon,
  [ActivityType.REPORTAGE]: ReportageIcon,
  [ActivityType.REACTION]: ReactionIcon,
};

export const DESC = {
  [ActivityType.MASCOTTE]: 'une mascotte',
  [ActivityType.PRESENTATION]: 'une presentation',
  [ActivityType.DEFI]: 'un défi',
  [ActivityType.GAME]: 'un jeu',
  [ActivityType.ENIGME]: 'une énigme',
  [ActivityType.QUESTION]: 'une question',
  [ActivityType.CONTENU_LIBRE]: 'un message',
  [ActivityType.INDICE]: 'un indice culturel',
  [ActivityType.SYMBOL]: 'un symbole',
  [ActivityType.REPORTAGE]: 'un reportage',
  [ActivityType.REACTION]: 'une réaction',
};

export const REACTIONS = {
  [ActivityType.MASCOTTE]: 'cette mascotte',
  [ActivityType.PRESENTATION]: 'cette présentation',
  [ActivityType.DEFI]: 'ce défi',
  [ActivityType.GAME]: 'ce jeu',
  [ActivityType.ENIGME]: 'cette énigme',
  [ActivityType.QUESTION]: 'cette question',
  [ActivityType.CONTENU_LIBRE]: 'ce message',
  [ActivityType.INDICE]: 'cet indice culturel',
  [ActivityType.SYMBOL]: 'ce symbole',
  [ActivityType.REPORTAGE]: 'ce reportage',
  [ActivityType.REACTION]: 'cette réaction',
};

export const labels = {
  [ActivityType.MASCOTTE]: 'Réagir à cette activité par :',
  [ActivityType.PRESENTATION]: 'Réagir à cette activité par :',
  [ActivityType.DEFI]: 'Réagir à cette activité par :',
  [ActivityType.GAME]: 'Réagir à cette activité par :',
  [ActivityType.ENIGME]: 'Réagir à cette activité par :',
  [ActivityType.QUESTION]: 'Répondre à cette question par :',
  [ActivityType.CONTENU_LIBRE]: 'Répondre à cette publication par :',
  [ActivityType.INDICE]: 'Répondre à cet indice culturel par :',
  [ActivityType.SYMBOL]: 'Répondre à ce symbole par :',
  [ActivityType.REPORTAGE]: 'Répondre à ce reportage par :',
  [ActivityType.REACTION]: 'Répondre à cette réaction par :',
};

const specificActivityPhase = {
  [ActivityType.MASCOTTE]: [1],
  [ActivityType.PRESENTATION]: [1, 2, 3],
  [ActivityType.DEFI]: [2],
  [ActivityType.GAME]: [2],
  [ActivityType.ENIGME]: [2],
  [ActivityType.QUESTION]: [1, 2, 3],
  [ActivityType.CONTENU_LIBRE]: [1, 2, 3],
  [ActivityType.INDICE]: [1],
  [ActivityType.SYMBOL]: [1],
  [ActivityType.REPORTAGE]: [2],
  [ActivityType.REACTION]: [2],
};
export const getActivityPhase = (activityType: number, activePhase: number) => {
  const availablePhases = specificActivityPhase[activityType] || [1, 2, 3];
  if (availablePhases.length === 0) {
    return activePhase; // should not happen
  } else if (availablePhases.length === 1) {
    return availablePhases[0];
  } else if (specificActivityPhase[activityType].includes(activePhase)) {
    return activePhase;
  }
  return availablePhases
    .filter((p) => p <= activePhase)
    .concat([1])
    .sort((a, b) => b - a)[0];
};
