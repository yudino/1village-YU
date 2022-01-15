import classNames from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import Backdrop from '@mui/material/Backdrop';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';

import { isDefi } from 'src/activity-types/anyActivity';
import { isCooking, getDefi, DEFI } from 'src/activity-types/defi.constants';
import type { CookingDefiData } from 'src/activity-types/defi.types';
import { Base } from 'src/components/Base';
import { StepsButton } from 'src/components/StepsButtons';
import { Steps } from 'src/components/Steps';
import { ContentView } from 'src/components/activities/content/ContentView';
import { getErrorSteps } from 'src/components/activities/defiChecksCooking';
import { EditButton } from 'src/components/buttons/EditButton';
import { ActivityContext } from 'src/contexts/activityContext';
import { ActivityStatus } from 'types/activity.type';

const DefiStep4 = () => {
  const router = useRouter();
  const { activity, save } = React.useContext(ActivityContext);
  const [isLoading, setIsLoading] = React.useState(false);

  const data = (activity?.data as CookingDefiData) || null;
  const isEdit = activity !== null && activity.id !== 0 && activity.status !== ActivityStatus.DRAFT;

  const errorSteps = React.useMemo(() => {
    const fieldStep2 = activity?.content.filter((d) => d.value !== ''); // if value is empty in step 2
    if (data !== null && fieldStep2?.length === 0) {
      const errors = getErrorSteps(data, 2);
      errors.push(1); //corresponding to step 2
      return errors;
    }
    if (data !== null) return getErrorSteps(data, 2);
    return [];
  }, [activity?.content, data]);
  const isValid = errorSteps.length === 0;

  React.useEffect(() => {
    if (activity === null && !('activity-id' in router.query) && !sessionStorage.getItem('activity')) {
      router.push('/lancer-un-defi');
    } else if (activity && (!isDefi(activity) || (isDefi(activity) && !isCooking(activity)))) {
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

  if (data === null || activity === null || !isDefi(activity) || (isDefi(activity) && !isCooking(activity))) {
    return <div></div>;
  }

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <Steps
          steps={['Votre plat', 'La recette', 'Le défi', 'Prévisualisation']}
          urls={['/lancer-un-defi/culinaire/1?edit', '/lancer-un-defi/culinaire/2', '/lancer-un-defi/culinaire/3', '/lancer-un-defi/culinaire/4']}
          activeStep={3}
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
              <Link href="/lancer-un-defi/culinaire/4" passHref>
                <Button component="a" color="secondary" variant="contained" href="/lancer-un-defi/culinaire/4">
                  {"Modifier à l'étape précédente"}
                </Button>
              </Link>
              <Button variant="outlined" color="primary" onClick={onPublish}>
                Enregistrer les changements
              </Button>
            </div>
          ) : (
            <div style={{ width: '100%', textAlign: 'right', margin: '1rem 0' }}>
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

          <span className={classNames('text text--small text--success', { 'text text--small text--warning': !isValid && errorSteps.includes(0) })}>
            Description de votre plat
          </span>
          <div className={classNames('preview-block', { 'preview-block--warning': !isValid && errorSteps.includes(0) })}>
            <EditButton
              onClick={() => {
                router.push(`/lancer-un-defi/culinaire/1?edit=${activity.id}`);
              }}
              status={errorSteps.includes(0) ? 'warning' : 'success'}
              style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}
            />
            <div className="text-center" style={{ marginBottom: '1rem' }}>
              <h3>{data.name}</h3>
            </div>
            <Grid container spacing={2}>
              {data.image && (
                <Grid item xs={12} md={4}>
                  <div style={{ width: '100%', height: '100%', minHeight: '200px', position: 'relative' }}>
                    <Image layout="fill" objectFit="contain" alt="image du plat" unoptimized src={data.image} />
                  </div>
                </Grid>
              )}
              <Grid item xs={12} md={data.image ? 8 : 12}>
                <p>{data.history}</p>
                <p>{data.explanation}</p>
              </Grid>
            </Grid>
          </div>

          <span className={classNames('text text--small text--success', { 'text text--small text--warning': !isValid && errorSteps.includes(1) })}>
            La recette
          </span>
          <div className={classNames('preview-block', { 'preview-block--warning': !isValid && errorSteps.includes(1) })}>
            <EditButton
              onClick={() => {
                router.push('/lancer-un-defi/culinaire/2');
              }}
              status={errorSteps.includes(1) ? 'warning' : 'success'}
              style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}
            />
            <ContentView content={activity.content} />
          </div>

          <span className={classNames('text text--small text--success', { 'text text--small text--warning': !isValid && errorSteps.includes(2) })}>
            Le défi lancé aux Pélicopains
          </span>
          <div className={classNames('preview-block', { 'preview-block--warning': !isValid && errorSteps.includes(2) })}>
            <EditButton
              onClick={() => {
                router.push('/lancer-un-defi/culinaire/3');
              }}
              status={errorSteps.includes(2) ? 'warning' : 'success'}
              style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}
            />
            Votre défi : {data?.defiIndex !== null ? getDefi(DEFI.COOKING, data) : ''}
          </div>

          <StepsButton prev="/lancer-un-defi/culinaire/3" />
        </div>
      </div>
      <Backdrop style={{ zIndex: 2000, color: 'white' }} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Base>
  );
};

export default DefiStep4;
