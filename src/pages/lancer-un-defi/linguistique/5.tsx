import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import Backdrop from '@mui/material/Backdrop';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

import { isDefi } from 'src/activity-types/anyActivity';
import { isLanguage, getDefi, getLanguageObject, DEFI, LANGUAGE_OBJECTS } from 'src/activity-types/defi.constants';
import type { LanguageDefiData } from 'src/activity-types/defi.types';
import { Base } from 'src/components/Base';
import { StepsButton } from 'src/components/StepsButtons';
import { Steps } from 'src/components/Steps';
import { ContentView } from 'src/components/activities/content/ContentView';
import { getErrorSteps } from 'src/components/activities/defiLanguageChecks';
import { EditButton } from 'src/components/buttons/EditButton';
import { ActivityContext } from 'src/contexts/activityContext';
import { ActivityStatus } from 'types/activity.type';

const DefiStep5 = () => {
  const router = useRouter();
  const { activity, save } = React.useContext(ActivityContext);
  const [isLoading, setIsLoading] = React.useState(false);

  const data = (activity?.data as LanguageDefiData) || null;
  const explanationContentIndex = Math.max(data?.explanationContentIndex ?? 0, 0);
  const isEdit = activity !== null && activity.id !== 0 && activity.status !== ActivityStatus.DRAFT;

  const errorSteps = React.useMemo(() => {
    const fieldStep2 = activity?.content.slice(0, activity?.content.length - 1).filter((d) => d.value !== '' && d.value !== '<p></p>\n'); // if value is empty in step 2
    const fieldStep3 = activity?.content.slice(1, activity?.content.length).filter((d) => d.value !== '' && d.value !== '<p></p>\n'); // if value is empty in step 3

    if (data !== null) {
      const errors = getErrorSteps(data, 1); // corresponde to step 1
      if (fieldStep2?.length === 0) errors.push(1); //corresponding to step 2
      if (fieldStep3?.length === 0) errors.push(2); //corresponding to step 3
      if (data.defiIndex === null) errors.push(3); //corresponding to step 4
      return errors;
    }
    return [];
  }, [activity?.content, data]);

  const isValid = errorSteps.length === 0;

  React.useEffect(() => {
    if (activity === null && !('activity-id' in router.query) && !sessionStorage.getItem('activity')) {
      router.push('/lancer-un-defi');
    } else if (activity && (!isDefi(activity) || (isDefi(activity) && !isLanguage(activity)))) {
      router.push('/lancer-un-defi');
    }
  }, [activity, router]);

  const onPublish = async () => {
    setIsLoading(true);
    const success = await save(true);
    if (success) {
      router.push('/lancer-un-defi/success');
    }
    setIsLoading(false);
  };

  if (data === null || activity === null || !isDefi(activity) || (isDefi(activity) && !isLanguage(activity))) {
    return <div></div>;
  }

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <Steps
          steps={['Choix de la langue', "Choix de l'objet", 'Explication', 'Le défi', 'Prévisualisation']}
          urls={[
            '/lancer-un-defi/linguistique/1?edit',
            '/lancer-un-defi/linguistique/2',
            '/lancer-un-defi/linguistique/3',
            '/lancer-un-defi/linguistique/4',
            '/lancer-un-defi/linguistique/5',
          ]}
          activeStep={4}
          errorSteps={errorSteps}
        />
        <div className="width-900">
          <h1>Pré-visualisez votre défi{!isEdit && ', et publiez-la'}</h1>
          <p className="text" style={{ fontSize: '1.1rem' }}>
            Voici la pré-visualisation de votre défi.
            {isEdit
              ? " Vous pouvez le modifier à l'étape précédente, et enregistrer vos changements ici."
              : ' Vous pouvez le modifier, et quand vous êtes prêts : publiez-le dans votre village-monde !'}
          </p>
          {isEdit ? (
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', margin: '1rem 0' }}>
              <Link href="/lancer-un-defi/linguistique/5" passHref>
                <Button component="a" color="secondary" variant="contained" href="/lancer-un-defi/linguistique/5">
                  {"Modifier à l'étape précédente"}
                </Button>
              </Link>
              <Button variant="outlined" color="primary" onClick={onPublish}>
                Enregistrer les changements
              </Button>
            </div>
          ) : (
            <div style={{ width: '100%', margin: '1rem 0' }}>
              {!isValid && (
                <p>
                  <b>Avant de publier votre présentation, il faut corriger les étapes incomplètes, marquées en orange.</b>
                </p>
              )}
              <div style={{ width: '100%', textAlign: 'right', margin: '1rem 0' }}>
                <Button variant="outlined" color="primary" onClick={onPublish} disabled={!isValid}>
                  Publier
                </Button>
              </div>
            </div>
          )}

          <div className={classNames('preview-block', { 'preview-block--warning': !isValid && errorSteps.includes(0) })}>
            <EditButton
              onClick={() => {
                router.push(`/lancer-un-defi/linguistique/1?edit=${activity.id}`);
              }}
              status={errorSteps.includes(0) ? 'warning' : 'success'}
              style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}
            />
            {data.languageIndex !== 0 ? getLanguageObject(data) : ''}
          </div>

          <span className={classNames('text text--small text--success', { 'text text--small text--warning': !isValid && errorSteps.includes(1) })}>
            L&apos;expression
          </span>
          <div className={classNames('preview-block', { 'preview-block--warning': !isValid && errorSteps.includes(1) })}>
            <EditButton
              onClick={() => {
                router.push('/lancer-un-defi/linguistique/2');
              }}
              status={errorSteps.includes(1) ? 'warning' : 'success'}
              style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}
            />
            <span>
              {LANGUAGE_OBJECTS[data?.objectIndex % LANGUAGE_OBJECTS.length]?.title} :
              <span>
                <ContentView content={activity.content.slice(0, explanationContentIndex)} />
              </span>
            </span>
          </div>

          <span className={classNames('text text--small text--success', { 'text text--small text--warning': !isValid && errorSteps.includes(2) })}>
            Explication
          </span>
          <div className={classNames('preview-block', { 'preview-block--warning': !isValid && errorSteps.includes(2) })}>
            <EditButton
              onClick={() => {
                router.push('/lancer-un-defi/linguistique/3');
              }}
              status={errorSteps.includes(2) ? 'warning' : 'success'}
              style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}
            />
            <ContentView content={activity.content.slice(explanationContentIndex, activity.content.length)} />
          </div>

          <span className={classNames('text text--small text--success', { 'text text--small text--warning': !isValid && errorSteps.includes(3) })}>
            Le défi lancé aux Pélicopains
          </span>
          <div className={classNames('preview-block', { 'preview-block--warning': !isValid && errorSteps.includes(3) })}>
            <EditButton
              onClick={() => {
                router.push('/lancer-un-defi/linguistique/4');
              }}
              status={errorSteps.includes(3) ? 'warning' : 'success'}
              style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}
            />
            Votre défi : {data.defiIndex === null ? '' : getDefi(DEFI.LANGUAGE, data)}
          </div>

          <StepsButton prev="/lancer-un-defi/linguistique/4" />
        </div>
      </div>
      <Backdrop style={{ zIndex: 2000, color: 'white' }} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Base>
  );
};

export default DefiStep5;
