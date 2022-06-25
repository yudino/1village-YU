import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import { Tooltip, Button, Backdrop, CircularProgress } from '@mui/material';

import { isStory } from 'src/activity-types/anyActivity';
import { Base } from 'src/components/Base';
import { ImageStepContainer } from 'src/components/FinalStep/ImageStepContainer';
import { Steps } from 'src/components/Steps';
import { StepsButton } from 'src/components/StepsButtons';
import { getErrorSteps } from 'src/components/activities/storyChecks';
import { ActivityContext } from 'src/contexts/activityContext';
import { UserContext } from 'src/contexts/userContext';
import { ActivityStatus } from 'types/activity.type';
import type { StoriesData, StoryElement } from 'types/story.type';
import { UserType } from 'types/user.type';

const ReInventStoryStep5 = () => {
  const router = useRouter();
  const { activity, save, updateActivity } = React.useContext(ActivityContext);
  const { user } = React.useContext(UserContext);
  const [isLoading, setIsLoading] = React.useState(false);
  const data = (activity?.data as StoriesData) || null;
  const isEdit = activity !== null && activity.status !== ActivityStatus.DRAFT;
  const isUserObservator = user?.type === UserType.OBSERVATOR;

  const errorSteps = React.useMemo(() => {
    const errors = [];
    if (data !== null) {
      if (getErrorSteps(data.object, 1).length > 0) {
        errors.push(0);
      }
      if (getErrorSteps(data.place, 2).length > 0) {
        errors.push(1);
      }
      if (getErrorSteps(data.odd, 3).length > 0) {
        errors.push(2);
      }
      if (getErrorSteps(data.tale, 4).length > 0) {
        errors.push(3);
      }
      return errors;
    }
    return [];
  }, [data]);

  const isValid = errorSteps.length === 0;

  const dataStoryToUpdate = React.useCallback(
    (key: keyof StoriesData): StoriesData => {
      const { [key]: item } = data;
      return {
        ...data,
        [key]: {
          ...(item as StoryElement),
          inspiredStoryId: activity?.id,
        },
      };
    },
    [data, activity],
  );

  // useEffect here to update inspiredStoryId if equal to 0
  React.useEffect(() => {
    if (data !== null && data.object.inspiredStoryId === 0) {
      updateActivity({
        data: dataStoryToUpdate('object'),
      });
    } else if (data !== null && data.place.inspiredStoryId === 0) {
      updateActivity({
        data: dataStoryToUpdate('place'),
      });
    } else if (data !== null && data.odd.inspiredStoryId === 0) {
      updateActivity({
        data: dataStoryToUpdate('odd'),
      });
    }
  }, [data, dataStoryToUpdate, updateActivity]);

  React.useEffect(() => {
    if (activity === null && !('activity-id' in router.query) && !sessionStorage.getItem('activity')) {
      router.push('/re-inventer-une-histoire');
    } else if (activity && !isStory(activity)) {
      router.push('/re-inventer-une-histoire');
    }
  }, [activity, router]);

  const onPublish = async () => {
    window.sessionStorage.setItem(`re-invent-a-story-step-1-next`, 'false');
    setIsLoading(true);
    const success = await save(true);
    if (success) {
      router.push('/re-inventer-une-histoire/success');
    }
    setIsLoading(false);
  };

  if (data === null || activity === null || !isStory(activity)) {
    return <div></div>;
  }

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <Steps
          steps={['Objet', 'Lieu', 'ODD', 'Histoire', 'Prévisualisation']}
          urls={[
            '/re-inventer-une-histoire/1?edit',
            '/re-inventer-une-histoire/2',
            '/re-inventer-une-histoire/3',
            '/re-inventer-une-histoire/4',
            '/re-inventer-une-histoire/5',
          ]}
          activeStep={4}
          errorSteps={errorSteps}
        />

        <div className="width-900">
          <h1>Pré-visualisez votre histoire{!isEdit && ', et publiez-la'}</h1>
          <p className="text" style={{ fontSize: '1.1rem' }}>
            {isEdit
              ? " Vous pouvez la modifier à l'étape précédente, et enregistrer vos changements ici."
              : ' Vous pouvez la modifier, et quand vous êtes prêts : publiez-la dans votre village-monde !'}
          </p>

          {isEdit ? (
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', margin: '1rem 0' }}>
              <Link href="/re-inventer-une-histoire/2" passHref>
                <Button component="a" color="secondary" variant="contained" href="/re-inventer-une-histoire/2">
                  {"Modifier à l'étape précédente"}
                </Button>
              </Link>
              <Button variant="outlined" color="primary" onClick={onPublish} disabled={isUserObservator}>
                Enregistrer les changements
              </Button>
            </div>
          ) : (
            <>
              {!isValid && (
                <p>
                  <b>Avant de publier votre histoire, il faut corriger les étapes incomplètes, marquées en orange.</b>
                </p>
              )}
              <div style={{ width: '100%', textAlign: 'right', margin: '1rem 0' }}>
                {isUserObservator ? (
                  <Tooltip title="Action non autorisée" arrow>
                    <span>
                      <Button variant="outlined" color="primary" disabled>
                        Publier
                      </Button>
                    </span>
                  </Tooltip>
                ) : (
                  <Button variant="outlined" color="primary" onClick={onPublish} disabled={!isValid}>
                    Publier
                  </Button>
                )}
              </div>
            </>
          )}

          {/* Object */}
          <ImageStepContainer
            urlStep={`/re-inventer-une-histoire/1?edit=${activity.id}`}
            imageUrl={data?.object?.imageUrl}
            isValid={isValid}
            error={errorSteps.includes(0)}
            description={data?.object?.description}
          />

          {/* Place */}
          <ImageStepContainer
            urlStep={`/re-inventer-une-histoire/2`}
            imageUrl={data?.place?.imageUrl}
            isValid={isValid}
            error={errorSteps.includes(1)}
            description={data?.place?.description}
          />

          {/* ODD */}
          <ImageStepContainer
            urlStep={`/re-inventer-une-histoire/3`}
            imageUrl={data?.odd?.imageUrl}
            isValid={isValid}
            error={errorSteps.includes(2)}
            description={data?.odd?.description}
          />

          {/* Tale */}
          <ImageStepContainer
            urlStep={`/re-inventer-une-histoire/4`}
            imageUrl={data?.tale?.imageStory}
            isValid={isValid}
            error={errorSteps.includes(3)}
            description={data?.tale?.tale}
          />
        </div>
        <StepsButton prev="/re-inventer-une-histoire/4" />
      </div>
      <Backdrop style={{ zIndex: 2000, color: 'white' }} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Base>
  );
};

export default ReInventStoryStep5;
