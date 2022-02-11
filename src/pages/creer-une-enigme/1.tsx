import { useRouter } from 'next/router';
import React from 'react';

import { Button, TextField } from '@mui/material';

import { isEnigme } from 'src/activity-types/anyActivity';
import { ENIGME_DATA, ENIGME_TYPES } from 'src/activity-types/enigme.constants';
import type { EnigmeData } from 'src/activity-types/enigme.types';
import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import { BackButton } from 'src/components/buttons/BackButton';
import { ThemeChoiceButton } from 'src/components/buttons/ThemeChoiceButton';
import { ActivityContext } from 'src/contexts/activityContext';
import { getQueryString } from 'src/utils';
import { ActivityStatus, ActivityType } from 'types/activity.type';

const EnigmeStep1 = () => {
  const router = useRouter();
  const { activity, createNewActivity, updateActivity } = React.useContext(ActivityContext);
  const selectRef = React.useRef<HTMLDivElement>(null);
  const [otherOpen, setIsOtherOpen] = React.useState(false);
  const data = (activity?.data as EnigmeData) || null;
  const isEdit = activity !== null && activity.id !== 0 && activity.status !== ActivityStatus.DRAFT;

  // enigme sub-type
  const enigmeTypeIndex =
    activity !== null && 'edit' in router.query && isEnigme(activity)
      ? activity.subType ?? 0
      : parseInt(getQueryString(router.query['category']) ?? '-1', 10) ?? 0;

  const c = data?.themeName || '';
  const opened = React.useRef(false);
  React.useEffect(() => {
    if (c && !opened.current) {
      setIsOtherOpen(true);
      opened.current = true;
    }
  }, [c]);

  const created = React.useRef(false);
  React.useEffect(() => {
    if (!created.current) {
      const responseActivityId = 'responseActivityId' in router.query ? parseInt(getQueryString(router.query.responseActivityId), 10) ?? null : null;
      const responseActivityType =
        'responseActivityType' in router.query ? parseInt(getQueryString(router.query.responseActivityType), 10) ?? null : null;
      if (!('edit' in router.query)) {
        created.current = true;
        createNewActivity(
          ActivityType.ENIGME,
          enigmeTypeIndex,
          {
            theme: null,
            indiceContentIndex: 1,
          },
          responseActivityId,
          responseActivityType,
        );
        if (responseActivityId !== null) {
          if (selectRef.current) {
            selectRef.current.scrollIntoView({ behavior: 'smooth' });
          }
        }
      } else if (activity && (!isEnigme(activity) || activity.subType !== enigmeTypeIndex)) {
        created.current = true;
        createNewActivity(
          ActivityType.ENIGME,
          enigmeTypeIndex,
          {
            theme: null,
            indiceContentIndex: 1,
          },
          responseActivityId,
          responseActivityType,
        );
        if (responseActivityId !== null) {
          if (selectRef.current) {
            selectRef.current.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }
    }
  }, [activity, createNewActivity, enigmeTypeIndex, router]);

  const onClick = (index: number) => () => {
    if (index === -1) {
      if (!data.themeName) {
        return;
      }
      updateActivity({ data: { ...data, theme: index, themeName: data.themeName.toLowerCase() } });
    } else {
      const newData = data;
      delete newData.themeName;
      updateActivity({ data: { ...newData, theme: index } });
    }
    router.push('/creer-une-enigme/2');
  };

  if (data === null || activity === null || !isEnigme(activity)) {
    return <div></div>;
  }

  const enigmeType = ENIGME_TYPES[activity.subType ?? 0] ?? ENIGME_TYPES[0];
  const enigmeData = ENIGME_DATA[activity.subType ?? 0] ?? ENIGME_DATA[0];

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        {!isEdit && <BackButton href="/creer-une-enigme" />}
        <Steps
          steps={['Choix de la catégorie', enigmeType.step1 ?? "Description de l'objet", "Création de l'indice", 'Prévisualisation']}
          urls={['/creer-une-enigme/1?edit', '/creer-une-enigme/2', '/creer-une-enigme/3', '/creer-une-enigme/4']}
          activeStep={0}
        />
        <div className="width-900">
          <h1>{enigmeType.titleStep1}</h1>
          <p className="text" style={{ fontSize: '1.1rem' }}>
            {enigmeType.description}
          </p>
          <div>
            {enigmeData.map((t, index) => (
              <ThemeChoiceButton key={index} label={t.label} description={t.description} onClick={onClick(index)} />
            ))}
            <ThemeChoiceButton
              isOpen={otherOpen}
              onClick={() => {
                setIsOtherOpen(!otherOpen);
              }}
              additionalContent={
                <div className="text-center">
                  <h3>Donnez un nom à la catégorie :</h3>
                  <div style={{ display: 'inline-flex', alignItems: 'center', margin: '0.5rem 0' }}>
                    <span style={{ marginRight: '0.3rem' }}>{`${enigmeType.title2} est`}</span>
                    {data !== null && (
                      <TextField
                        variant="standard"
                        value={data.themeName || ''}
                        onChange={(event) => {
                          updateActivity({ data: { ...data, themeName: event.target.value } });
                        }}
                      />
                    )}
                  </div>
                  <br />
                  <p
                    className="text text--small"
                    style={{
                      display: 'inline-block',
                      textAlign: 'justify',
                      padding: '4px',
                      border: '1px dashed',
                      borderRadius: '4px',
                      maxWidth: '480px',
                    }}
                  >
                    Ne donnez pas le nom de votre {enigmeType.title.toLowerCase()}. La catégorie de {"l'énigme"} est un{' '}
                    <strong>indice supplémentaire</strong> pour les autres classes.
                  </p>
                  <br />
                  <Button color="primary" size="small" variant="outlined" onClick={onClick(-1)}>
                    Continuer
                  </Button>
                </div>
              }
              label="Autre"
              description={`Présentez ${enigmeType.title3} d’une autre catégorie.`}
            />
          </div>
        </div>
      </div>
    </Base>
  );
};

export default EnigmeStep1;
