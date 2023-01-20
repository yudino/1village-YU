import type {
  DefiActivity,
  CookingDefiActivity,
  CookingDefiData,
  EcoDefiActivity,
  EcoDefiData,
  LanguageDefiActivity,
  LanguageDefiData,
  FreeDefiActivity,
  FreeDefiData,
} from './defi.types';
import { replaceTokens } from 'src/utils';

export const COOKING_DEFIS = [
  {
    title: 'Réalisez notre recette à votre tour',
    description: 'Les Pelicopains devront créer une présentation sous forme de texte, son, image ou une vidéo',
  },
  {
    title: 'Présentez-nous une de vos recettes traditionnelles',
    description: 'Les Pelicopains devront créer une présentation sous forme de texte, son, image ou une vidéo',
  },
];
export const ECO_ACTIONS = [
  'Ramassage des déchets dans notre région',
  'Recyclage d’un objet du quotidien',
  'Mise en place d’écogestes dans la classe',
  'Actions auprès d’une association locale',
  'Action libre',
];
export const ECO_DEFIS = [
  {
    title: 'Réaliser cette action pour la planète à votre tour',
    description: 'Les Pelicopains devront refaire votre action chez eux',
  },
  {
    title: 'Imaginer et réaliser  une nouvelle action pour la planète',
    description: 'Les Pelicopains devront réaliser une autre action',
  },
];
export const LANGUAGE_SCHOOL = [
  'maternelle chez tous les élèves',
  'maternelle chez certains élèves',
  'qu’on utilise pour faire cours',
  'qu’on apprend comme langue étrangère',
];
export const LANGUAGE_OBJECTS = [
  {
    title: 'Un mot précieux',
    title2: 'le mot précieux',
    desc1: "Choisissez un mot 'précieux' qui a quelque chose d'original (prononciation,origine...) dans la langue {{language}}.",
    desc2: 'Expliquez pourquoi vous avez choisi ce mot précieux, ce qu’il signifie et quand vous l’utilisez.',
  },
  {
    title: 'Une expression',
    title2: "l'expression",
    desc1: 'Choisissez une expression surprenante dans la langue {{language}}.',
    desc2: 'Expliquez pourquoi vous avez choisi cette expression, ce qu’elle signifie et quand vous l’utilisez.',
  },
  {
    title: 'Une poésie',
    title2: 'la poésie',
    desc1: 'Choisissez une poésie écrite dans la langue {{language}}.',
    desc2: 'Expliquez pourquoi vous avez choisi cette poésie, ce qu’elle signifie et quand vous l’utilisez.',
  },
  {
    title: 'Une chanson',
    title2: 'la chanson',
    desc1: 'Choisissez une chanson écrite dans la langue {{language}}.',
    desc2: 'Expliquez pourquoi vous avez choisi cette chanson, ce qu’elle signifie et quand vous l’utilisez.',
  },
  // {
  //   title: 'Autre',
  //   title2: '',
  //   desc1: 'Choisissez vous-même le thème.',
  //   desc2: 'Expliquez pourquoi votre choix, ce qu’il signifie et quand vous l’utilisez.',
  // },
];
export const LANGUAGE_DEFIS = [
  {
    title: 'Trouvez {{object}} qui veut dire la même chose dans une autre langue',
    description: 'Les Pelicopains devront envoyer un texte, un son ou une vidéo.',
  },
  {
    title: 'Répétez à l’oral {{object}} en {{language}}',
    description: 'Les Pelicopains devront envoyer un son ou une vidéo.',
  },
  {
    title: 'Écrivez {{object}} en {{language}}',
    description: 'Les Pelicopains devront envoyer une image ou une vidéo.',
  },
];

export const FREE_DEFIS = [
  {
    title: 'Réalisez notre action à votre tour',
    description: 'Les Pelicopains devront réaliser la même action que vous',
  },
  {
    title: 'Réalisez une autre action sur le même thème',
    description: 'Les Pelicopains devront réaliser une action sur le thème {{theme}}',
  },
];
export const DEFI = {
  COOKING: 0,
  ECO: 1,
  LANGUAGE: 2,
  FREE: 3,
};

//TODO : factoriser en mode clean code le getDefi
//https://stackoverflow.com/questions/8900652/what-does-do-in-javascript
export const getDefi = (subtype: number, data: CookingDefiData | EcoDefiData | LanguageDefiData | FreeDefiData): string => {
  if (subtype === DEFI.ECO) {
    return data.defiIndex === -1 && data.defi ? data.defi : ECO_DEFIS[(data.defiIndex ?? 0) % ECO_DEFIS.length].title;
  }
  if (subtype === DEFI.LANGUAGE) {
    const defi = data.defiIndex === -1 && data.defi ? data.defi : LANGUAGE_DEFIS[(data.defiIndex ?? 0) % LANGUAGE_DEFIS.length].title;
    if ((data as LanguageDefiData).objectIndex === -1) {
      return '';
    }
    // We are going to implement this later when we add "other" category in language challenge.
    // if ((data as LanguageDefiData).objectIndex === 4 && data.defiIndex === 0) {
    //   return 'Trouvez la même chose dans une autre langue';
    // }
    return replaceTokens(defi, {
      object:
        data.defiIndex === 0
          ? LANGUAGE_OBJECTS[(data as LanguageDefiData).objectIndex % LANGUAGE_OBJECTS.length].title.toLowerCase()
          : LANGUAGE_OBJECTS[(data as LanguageDefiData).objectIndex % LANGUAGE_OBJECTS.length].title2,
      language: (data as LanguageDefiData).language,
    });
  }
  if (subtype === DEFI.FREE) {
    return data.defiIndex === -1 && data.defi ? data.defi : FREE_DEFIS[(data.defiIndex ?? 0) % FREE_DEFIS.length].title;
  }
  return data.defiIndex === -1 && data.defi ? data.defi : COOKING_DEFIS[(data.defiIndex ?? 0) % COOKING_DEFIS.length].title;
};

export const getLanguageObject = (data: LanguageDefiData): string => {
  const object = 'Voila {{object}} en {{language}}, une langue {{school}}.';
  return replaceTokens(object, {
    object: data.objectIndex === -1 ? 'un défi' : LANGUAGE_OBJECTS[data.objectIndex % LANGUAGE_OBJECTS.length].title.toLowerCase(),
    language: data.language,
    school: LANGUAGE_SCHOOL[(data.languageIndex - 1) % LANGUAGE_SCHOOL.length],
  });
};

export const isCooking = (activity: DefiActivity): activity is CookingDefiActivity => {
  return activity.subType === DEFI.COOKING;
};
export const isEco = (activity: DefiActivity): activity is EcoDefiActivity => {
  return activity.subType === DEFI.ECO;
};
export const isLanguage = (activity: DefiActivity): activity is LanguageDefiActivity => {
  return activity.subType === DEFI.LANGUAGE;
};
export const isFree = (activity: DefiActivity): activity is FreeDefiActivity => {
  return activity.subType === DEFI.FREE;
};
