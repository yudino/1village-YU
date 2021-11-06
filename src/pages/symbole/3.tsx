import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import Backdrop from '@mui/material/Backdrop';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

import { isSymbol } from 'src/activity-types/anyActivity';
import { getSymbol } from 'src/activity-types/symbol.constants';
import type { SymbolData } from 'src/activity-types/symbol.types';
import { Base } from 'src/components/Base';
import { StepsButton } from 'src/components/StepsButtons';
import { Steps } from 'src/components/Steps';
import { ContentView } from 'src/components/activities/content/ContentView';
import { EditButton } from 'src/components/buttons/EditButton';
import { ActivityContext } from 'src/contexts/activityContext';
import { ActivityStatus } from 'types/activity.type';

const SymbolStep3 = () => {
  const router = useRouter();
  const { activity, save } = React.useContext(ActivityContext);
  const [isLoading, setIsLoading] = React.useState(false);

  const isEdit = activity !== null && activity.id !== 0 && activity.status !== ActivityStatus.DRAFT;
  const data = (activity?.data as SymbolData) || null;

  React.useEffect(() => {
    if (activity === null && !('activity-id' in router.query) && !sessionStorage.getItem('activity')) {
      router.push('/indice-culturel');
    } else if (activity && !isSymbol(activity)) {
      router.push('/indice-culturel');
    }
  }, [activity, router]);

  const isValid = React.useMemo(() => {
    if (activity !== null && activity.content.filter((c) => c.value.length > 0 && c.value !== '<p></p>\n').length === 0) {
      return false;
    }
    return true;
  }, [activity]);

  const onPublish = async () => {
    if (!isValid) {
      return;
    }
    setIsLoading(true);
    const success = await save(true);
    if (success) {
      router.push('/symbole/success');
    }
    setIsLoading(false);
  };

  if (activity === null || data === null) {
    return <div></div>;
  }

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <Steps
          steps={[getSymbol(activity.subType, data).step1, 'Créer le symbole', 'Prévisualiser']}
          activeStep={2}
          errorSteps={isValid ? [] : [1]}
        />
        <div className="width-900">
          <h1>Pré-visualisez votre publication{!isEdit && ' et publiez-la.'}</h1>
          <p className="text" style={{ fontSize: '1.1rem' }}>
            Voici la pré-visualisation de votre publication.
            {isEdit
              ? " Vous pouvez la modifier à l'étape précédente, et enregistrer vos changements ici."
              : ' Vous pouvez la modifier, et quand vous êtes prêts : publiez-la dans votre village-monde !'}
          </p>
          {isEdit ? (
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', margin: '1rem 0' }}>
              <Link href="/symbole/2" passHref>
                <Button component="a" color="secondary" variant="contained" href="/symbole/2">
                  {"Modifier à l'étape précédente"}
                </Button>
              </Link>
              <Button variant="outlined" color="primary" onClick={onPublish}>
                Enregistrer les changements
              </Button>
            </div>
          ) : (
            <div style={{ width: '100%', textAlign: 'right', margin: '1rem 0' }}>
              <Button variant="outlined" color="primary" onClick={onPublish} disabled={!isValid}>
                Publier
              </Button>
            </div>
          )}

          <span className={'text text--small text--success'}>Thème</span>
          <div className="preview-block">
            <EditButton
              onClick={() => {
                router.push('/symbole/1?edit');
              }}
              status="success"
              style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}
            />
            <p style={{ margin: '0.5rem 0' }}>{getSymbol(activity.subType, data).title}</p>
          </div>

          <span className={`text text--small ${isValid ? 'text--success' : 'text--warning'}`}>Symbole</span>
          <div className={classNames('preview-block', { 'preview-block--warning': !isValid })}>
            <EditButton
              onClick={() => {
                router.push('/symbole/2');
              }}
              status={isValid ? 'success' : 'warning'}
              style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}
            />
            <ContentView content={activity.content} />
          </div>

          <StepsButton prev="/symbole/2" />
        </div>
      </div>
      <Backdrop style={{ zIndex: 2000, color: 'white' }} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Base>
  );
};

export default SymbolStep3;
