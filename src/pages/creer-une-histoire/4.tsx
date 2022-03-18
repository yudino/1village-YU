import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';

import AddIcon from '@mui/icons-material/Add';
import { TextField, Grid, ButtonBase, TextareaAutosize } from '@mui/material';

import { isStory } from 'src/activity-types/anyActivity';
import { Base } from 'src/components/Base';
import { KeepRatio } from 'src/components/KeepRatio';
import { StepsButton } from 'src/components/StepsButtons';
import { Steps } from 'src/components/Steps';
import { ImageModal } from 'src/components/activities/content/editors/ImageEditor/ImageModal';
import { BackButton } from 'src/components/buttons/BackButton';
import { DeleteButton } from 'src/components/buttons/DeleteButton';
import { ActivityContext } from 'src/contexts/activityContext';
import { primaryColor, bgPage } from 'src/styles/variables.const';
import { ActivityStatus } from 'types/activity.type';
import type { StoriesData, TaleElement } from 'types/story.type';

const StoryStep4 = () => {
  const router = useRouter();
  const { activity, updateActivity, save } = React.useContext(ActivityContext);
  const [isImageModalOpen, setIsImageModalOpen] = React.useState(false);
  const data = (activity?.data as StoriesData) || null;
  const isEdit = activity !== null && activity.status !== ActivityStatus.DRAFT;

  React.useEffect(() => {
    if (activity === null && !('activity-id' in router.query) && !sessionStorage.getItem('activity')) {
      router.push('/creer-une-histoire');
    } else if (activity && !isStory(activity)) {
      router.push('/creer-une-histoire');
    }
  }, [activity, router]);

  const dataChange = (key: keyof TaleElement) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const { tale } = data;
    const newData = { ...data, tale: { ...tale, [key]: value } };
    updateActivity({ data: newData });
  };

  // Update the "object step" image url, when upload an image.
  const setImage = (imageStory: string) => {
    const { tale } = data;
    updateActivity({ data: { ...data, tale: { ...tale, imageStory } } });
  };

  const onNext = () => {
    save().catch(console.error);
    router.push('/creer-une-histoire/5');
  };

  if (data === null || activity === null || !isStory(activity)) {
    return <div></div>;
  }

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <BackButton href="/creer-une-histoire" />
        <Steps
          steps={['Objet', 'Lieu', 'ODD', 'Histoire', 'Prévisualitation']}
          urls={['/creer-une-histoire/1?edit', '/creer-une-histoire/2', '/creer-une-histoire/3', '/creer-une-histoire/4', '/creer-une-histoire/5']}
          activeStep={3}
        />
        <div className="width-900">
          <h1>Illustrez et écrivez l’histoire de votre visite dans le village idéal</h1>
          <p className="text">
            Racontez à vos Pélicopains, comment Pelico est parvenu à atteindre l’ODD choisi grâce à l’objet et au lieu magiques. Illustrez votre
            histoire avec un dessin de votre visite dans le village idéal.
          </p>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <div style={{ marginTop: '1.5rem' }}>
                <ButtonBase onClick={() => setIsImageModalOpen(true)} style={{ width: '100%', color: `${primaryColor}` }}>
                  <KeepRatio ratio={2 / 3} width="100%">
                    <div
                      style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        border: `1px solid ${primaryColor}`,
                        borderRadius: '10px',
                        justifyContent: 'center',
                      }}
                    >
                      {data?.tale?.imageStory ? (
                        <Image layout="fill" objectFit="contain" alt="image du plat" src={data?.tale?.imageStory} unoptimized />
                      ) : (
                        <AddIcon style={{ fontSize: '80px' }} />
                      )}
                    </div>
                  </KeepRatio>
                </ButtonBase>
                {data?.tale?.imageStory && (
                  <div style={{ position: 'absolute', top: '0.25rem', right: '0.25rem' }}>
                    <DeleteButton
                      onDelete={() => {
                        setImage('');
                      }}
                      confirmLabel="Êtes-vous sur de vouloir supprimer l'image ?"
                      confirmTitle="Supprimer l'image"
                      style={{ backgroundColor: bgPage }}
                    />
                  </div>
                )}
                <ImageModal
                  id={0}
                  isModalOpen={isImageModalOpen}
                  setIsModalOpen={setIsImageModalOpen}
                  imageUrl={data?.tale?.imageStory || ''}
                  setImageUrl={setImage}
                />

                <span style={{ fontSize: '0.7rem', marginLeft: '1rem' }}>Ce champ est obligatoire</span>
              </div>
            </Grid>
            <TextField
              id="standard-multiline-static"
              label="Écrivez votre histoire du Village idéal"
              rows={8}
              multiline
              value={data?.tale?.tale || ''}
              onChange={dataChange('tale')}
              variant="outlined"
              style={{ width: '100%', marginTop: '25px', color: 'primary' }}
            />
          </Grid>
        </div>
        <StepsButton prev="/creer-une-histoire/3" next={onNext} />
      </div>
    </Base>
  );
};

export default StoryStep4;
