import { useRouter } from 'next/router';
import React from 'react';

import { isEnigme } from 'src/activity-types/anyActivity';
import { ENIGME_DATA, ENIGME_TYPES } from 'src/activity-types/enigme.constants';
import type { EnigmeData } from 'src/activity-types/enigme.types';
import { Base } from 'src/components/Base';
import { StepsButton } from 'src/components/StepsButtons';
import { Steps } from 'src/components/Steps';
import { ContentEditor } from 'src/components/activities/content';
import { getErrorSteps } from 'src/components/activities/enigmeChecks';
import { ActivityContext } from 'src/contexts/activityContext';
import { capitalize } from 'src/utils';
import type { ActivityContent, ActivityContentType } from 'types/activity.type';

const EnigmeStep2 = () => {
  const router = useRouter();
  const { activity, updateActivity, addContent, deleteContent, save } = React.useContext(ActivityContext);

  const data = (activity?.data as EnigmeData) || null;
  const indiceContentIndex = Math.max(data?.indiceContentIndex ?? 0, 0);

  const errorSteps = React.useMemo(() => {
    if (data !== null) {
      return getErrorSteps(data, 1);
    }
    return [];
  }, [data]);

  React.useEffect(() => {
    if (activity === null && !('activity-id' in router.query) && !sessionStorage.getItem('activity')) {
      router.push('/creer-une-enigme');
    } else if (activity && !isEnigme(activity)) {
      router.push('/creer-une-enigme');
    }
  }, [activity, router]);

  const updateContent = (content: ActivityContent[]): void => {
    if (!activity) {
      return;
    }
    updateActivity({ content: [...content, ...activity.content.slice(indiceContentIndex, activity.content.length)] });
  };
  const addDescriptionContent = (type: ActivityContentType, value?: string) => {
    addContent(type, value, indiceContentIndex);
    updateActivity({ data: { ...data, indiceContentIndex: indiceContentIndex + 1 } });
  };
  const deleteDescriptionContent = (index: number) => {
    deleteContent(index);
    updateActivity({ data: { ...data, indiceContentIndex: indiceContentIndex - 1 } });
  };

  if (data === null || activity === null || !isEnigme(activity)) {
    return <div></div>;
  }

  const enigmeType = ENIGME_TYPES[activity.subType ?? 0] ?? ENIGME_TYPES[0];
  const enigmeData = ENIGME_DATA[activity.subType ?? 0] ?? ENIGME_DATA[0];

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <Steps
          steps={[
            data.theme === -1 ? capitalize(data.themeName ?? '') : enigmeData[data.theme]?.step ?? 'Choix de la catégorie',
            enigmeType.step1 ?? "Description de l'objet",
            "Création de l'indice",
            'Prévisualisation',
          ]}
          urls={['/creer-une-enigme/1?edit', '/creer-une-enigme/2', '/creer-une-enigme/3', '/creer-une-enigme/4']}
          activeStep={1}
          errorSteps={errorSteps}
        />
        <div className="width-900">
          <h1>{enigmeType.titleStep2}</h1>
          <p className="text" style={{ fontSize: '1.1rem' }}>
            Décrivez ici votre {enigmeType.titleStep2Short}, il s’agira de la <strong>réponse</strong> partagée aux autres classes. Votre réponse ne
            sera visible que 7 jours après la publication de votre énigme, pour laisser le temps à vos Pélicopains de faire des recherches, et de vous
            poser des questions !
          </p>
          <ContentEditor
            content={activity.content.slice(0, indiceContentIndex)}
            updateContent={updateContent}
            addContent={addDescriptionContent}
            deleteContent={deleteDescriptionContent}
            save={save}
          />
          <StepsButton prev={`/creer-une-enigme/1?edit=${activity.id}`} next="/creer-une-enigme/3" />
        </div>
      </div>
    </Base>
  );
};

export default EnigmeStep2;
