import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import Backdrop from '@material-ui/core/Backdrop';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import { isEnigme } from 'src/activities/anyActivity';
import { ENIGME_TYPES, ENIGME_DATA } from 'src/activities/enigme.const';
import { EnigmeData } from 'src/activities/enigme.types';
import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import { SimpleActivityView } from 'src/components/activities';
import { BackButton } from 'src/components/buttons/BackButton';
import { EditButton } from 'src/components/buttons/EditButton';
import { ActivityContext } from 'src/contexts/activityContext';
import { ActivityStatus } from 'types/activity.type';

const EnigmeStep4: React.FC = () => {
  const router = useRouter();
  const { activity, save } = React.useContext(ActivityContext);
  const [isLoading, setIsLoading] = React.useState(false);

  const data = (activity?.data as EnigmeData) || null;
  const indiceContentIndex = data?.indiceContentIndex ?? 0;
  const isEdit = activity !== null && activity.id !== 0 && activity.status !== ActivityStatus.DRAFT;

  React.useEffect(() => {
    if (activity === null && !('activity-id' in router.query) && !sessionStorage.getItem('activity')) {
      router.push('/creer-une-enigme');
    } else if (activity && !isEnigme(activity)) {
      router.push('/creer-une-enigme');
    }
  }, [activity, router]);

  const onPublish = async () => {
    setIsLoading(true);
    const success = await save(true);
    if (success) {
      router.push('/creer-une-enigme/success');
    }
    setIsLoading(false);
  };

  if (data === null || !isEnigme(activity)) {
    return <div></div>;
  }

  const enigmeType = ENIGME_TYPES[activity.subType ?? 0] ?? ENIGME_TYPES[0];
  const enigmeData = ENIGME_DATA[activity.subType ?? 0] ?? ENIGME_DATA[0];

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <BackButton href={`/creer-une-enigme/3`} label={isEdit ? 'Modifier' : 'Retour'} />
        <Steps
          steps={[
            enigmeData[data.theme]?.step ?? 'Choix de la catégorie',
            enigmeType.step2 ?? "Description de l'objet",
            "Création de l'indice",
            'Prévisualisation',
          ]}
          activeStep={3}
        />
        <div className="width-900">
          <h1>Pré-visualisez votre énigme{!isEdit && ', et publiez-la'}</h1>
          <p className="text" style={{ fontSize: '1.1rem' }}>
            Voici la pré-visualisation de votre énigme.
            {isEdit
              ? " Vous pouvez la modifier à l'étape précédente, et enregistrer vos changements ici."
              : ' Vous pouvez la modifier, et quand vous êtes prêts : publiez-la dans votre village-monde !'}
          </p>
          {isEdit ? (
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', margin: '1rem 0' }}>
              <Link href="/creer-une-enigme/3">
                <Button component="a" color="secondary" variant="contained" href="/creer-une-enigme/3">
                  {"Modifier à l'étape précédente"}
                </Button>
              </Link>
              <Button variant="outlined" color="primary" onClick={onPublish}>
                Enregistrer les changements
              </Button>
            </div>
          ) : (
            <div style={{ width: '100%', textAlign: 'right', margin: '1rem 0' }}>
              <Button variant="outlined" color="primary" onClick={onPublish}>
                Publier
              </Button>
            </div>
          )}

          <span className="text text--small text--success">{"Catégorie de l'énigme"}</span>
          <div className="preview-block">
            <EditButton
              onClick={() => {
                router.push(`/creer-une-enigme/1?edit=${activity.id}`);
              }}
              isGreen
              style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}
            />
            <p style={{ margin: '0.5rem 0' }}>
              Notre {enigmeType.titleStep2Short} mystère est <strong>{(enigmeData[data.theme]?.step ?? 'autre').toLowerCase()}</strong>.
            </p>
          </div>

          <span className="text text--small text--success">{enigmeType.step2 ?? "Description de l'objet"}</span>
          <div className="preview-block">
            <EditButton
              onClick={() => {
                router.push('/creer-une-enigme/2');
              }}
              isGreen
              style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}
            />
            <SimpleActivityView activity={activity} content={activity.processedContent.slice(0, indiceContentIndex)} />
          </div>

          <span className="text text--small text--success">Indice présenté aux autres classes</span>
          <div className="preview-block">
            <EditButton
              onClick={() => {
                router.push('/creer-une-enigme/3');
              }}
              isGreen
              style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}
            />
            <SimpleActivityView activity={activity} content={activity.processedContent.slice(indiceContentIndex, activity.processedContent.length)} />
          </div>
        </div>
      </div>
      <Backdrop style={{ zIndex: 2000, color: 'white' }} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Base>
  );
};

export default EnigmeStep4;
