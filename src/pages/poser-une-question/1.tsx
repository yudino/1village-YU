import { useRouter } from 'next/router';
import React from 'react';

import { Button } from '@mui/material';

import { isQuestion } from 'src/activity-types/anyActivity';
import { AvatarImg } from 'src/components/Avatar';
import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import { StepsButton } from 'src/components/StepsButtons';
import { UserDisplayName } from 'src/components/UserDisplayName';
import { BackButton } from 'src/components/buttons/BackButton';
import { ActivityContext } from 'src/contexts/activityContext';
import { UserContext } from 'src/contexts/userContext';
import { VillageContext } from 'src/contexts/villageContext';
import { useActivities } from 'src/services/useActivities';
import { useActivityRequests } from 'src/services/useActivity';
import { useVillageUsers } from 'src/services/useVillageUsers';
import { bgPage } from 'src/styles/variables.const';
import { ActivityType } from 'types/activity.type';
import { UserType } from 'types/user.type';

const Question1 = () => {
  const router = useRouter();
  const { user } = React.useContext(UserContext);
  const { village, selectedPhase } = React.useContext(VillageContext);
  const { activity, createNewActivity } = React.useContext(ActivityContext);
  const { users } = useVillageUsers();
  const isMediator = user !== null && user.type > UserType.TEACHER;
  const { activities } = useActivities({
    limit: 200,
    page: 0,
    countries:
      village && (isMediator || village.activePhase >= 2)
        ? village.countries.map((c) => c.isoCode.toUpperCase())
        : user
        ? [user.country.isoCode.toUpperCase()]
        : [],
    pelico: true,
    type: ActivityType.QUESTION,
  });
  const { askSameQuestion } = useActivityRequests();

  const created = React.useRef(false);
  React.useEffect(() => {
    if (!created.current) {
      created.current = true;
      if (!('edit' in router.query)) {
        createNewActivity(ActivityType.QUESTION, selectedPhase);
      }
    }
  }, [activity, createNewActivity, router, selectedPhase]);

  const userMap = React.useMemo(
    () =>
      users.reduce<{ [key: number]: number }>((acc, u, index) => {
        acc[u.id] = index;
        return acc;
      }, {}),
    [users],
  );

  const questions = React.useMemo(() => {
    const q: Array<{ q: string; activityIndex: number }> = [];
    for (let i = 0, n = activities.length; i < n; i++) {
      q.push({
        q: activities[i].content[0].value,
        activityIndex: i,
      });
    }
    return q;
  }, [activities]);

  const onNext = () => {
    if (activity && isQuestion(activity)) {
      router.push('/poser-une-question/2');
    }
  };

  const onAskSame = (activityId: number) => async () => {
    if (!user || !user.id) {
      return;
    }
    await askSameQuestion(activityId);
  };

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <BackButton href="/" />
        <Steps
          steps={['Les questions', 'Poser ses questions', 'Prévisualiser']}
          urls={['/poser-une-question/1?edit', '/poser-une-question/2', '/poser-une-question/3']}
          activeStep={0}
        />
        <div className="width-900">
          <h1>Les questions déjà posées</h1>
          <p className="text">
            Vous avez ici les questions qui ont été posées par les Pélicopains, si vous vous posez la même question, vous pouvez cliquer sur “Je me
            pose la même question”. Après avoir pris connaissance des questions des autres vous pourrez proposer vos propres questions.
          </p>

          {questions.length === 0 && (
            <div style={{ backgroundColor: bgPage, padding: '0.5rem 1rem', borderRadius: '10px', margin: '1rem 0' }}>
              <p style={{ margin: '0' }} className="text text--bold">
                {"Aucune question n'a été posée dans votre village monde, soyez la première classe à poser une question !"}
              </p>
            </div>
          )}

          {questions.map((question, index) => {
            const activity = activities[question.activityIndex];
            if (!activity || !isQuestion(activity)) {
              return null;
            }
            const questionUser = users[userMap[activity.userId]];
            if (!questionUser) {
              return null;
            }
            const isSelf = questionUser?.id === user?.id;
            const askSame = !activity.data.askSame ? [] : ((activity.data.askSame as string) || '').split(',').map((n) => parseInt(n, 10) || 0);
            return (
              <div key={index} style={{ display: 'flex', alignItems: 'flex-start', margin: '1rem 0' }}>
                {questionUser && <AvatarImg user={questionUser} size="small" style={{ margin: '0.25rem' }} />}
                <div style={{ flex: 1, minWidth: 0, backgroundColor: bgPage, padding: '0.5rem 1rem', borderRadius: '10px' }}>
                  <p style={{ margin: '0' }} className="text">
                    <strong>
                      <UserDisplayName user={questionUser} />
                    </strong>
                    <br />
                    <span>{question.q}</span>
                  </p>
                  {!isSelf && (
                    <div style={{ width: '100%', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                        <Button
                          style={user && askSame.includes(user.id) ? {} : { padding: '6px 16px', backgroundColor: 'white' }}
                          onClick={onAskSame(activity.id)}
                          color="primary"
                          variant={user && askSame.includes(user.id) ? 'contained' : 'text'}
                        >
                          <span className="text text--bold">Je me pose la même question</span>
                        </Button>
                        {askSame.length > 0 && (
                          <span className="text text--primary" style={{ marginLeft: '0.25rem' }}>
                            + {askSame.length}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          <StepsButton next={onNext} />
        </div>
      </div>
    </Base>
  );
};

export default Question1;
