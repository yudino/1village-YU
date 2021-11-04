import ReactPlayer from 'react-player';
import type { ChangeEventHandler } from 'react';
import React from 'react';

import { TextField, Grid, Button } from '@mui/material';

import { Base } from 'src/components/Base';
import { StepsButton } from 'src/components/StepsButtons';
import { VideoModals } from 'src/components/activities/content/editors/VideoEditor/VideoModals';
import { ActivityContext } from 'src/contexts/activityContext';
import { UserContext } from 'src/contexts/userContext';
import UploadIcon from 'src/svg/jeu/add-video.svg';
import type { MimicData } from 'types/game.type';

interface MimicSelectorProps {
  MimicData: MimicData;
  mimicNumber: string;
  onDataChange(key: keyof MimicData): ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onVideoChange(newValue: string): void;
  onNext: (() => void) | null;
  onPrev: (() => void) | null;
}

const MimicSelector: React.FC<MimicSelectorProps> = ({ MimicData, mimicNumber, onDataChange, onVideoChange, onNext, onPrev }: MimicSelectorProps) => {
  const [isError, setIsError] = React.useState<boolean>(false);
  const { user } = React.useContext(UserContext);
  const { save } = React.useContext(ActivityContext);
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const isValid = () => {
    return (
      MimicData.origine != null &&
      MimicData.origine.length > 0 &&
      MimicData.signification != null &&
      MimicData.signification.length > 0 &&
      MimicData.fakeSignification1 != null &&
      MimicData.fakeSignification1.length > 0 &&
      MimicData.fakeSignification2 != null &&
      MimicData.fakeSignification2.length > 0 &&
      MimicData.video != null &&
      MimicData.video.length > 0
    );
  };

  const isFieldValid = (value: string | null) => {
    return value != null && value.length > 0;
  };

  const nextPage = () => {
    save().catch(console.error);
    if (isValid()) {
      onNext?.();
    } else {
      setIsError(true);
    }
  };

  const prevPage = () => {
    save().catch(console.error);
    onPrev?.();
  };

  if (!user || !MimicData) {
    return (
      <Base>
        <div></div>
      </Base>
    );
  }

  return (
    <>
      <div className="width-900">
        <h1>Présentez en vidéo une {mimicNumber} mimique à vos Pélicopains</h1>
        <p>
          Votre vidéo est un plan unique tourné à l’horizontal, qui montre un élève faisant la mimique et la situation dans laquelle on l’utilise..
          Gardez le mystère, et ne révélez pas à l’oral sa signification !
        </p>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            {isFieldValid(MimicData.video) && (
              <div style={{ width: '100%', height: '100%', marginTop: '0.2rem' }}>
                <ReactPlayer width="100%" height="70%" light url={MimicData.video || ''} controls />
                <Button name="video" style={{ width: '100%', marginTop: '0.4rem' }} onClick={toggleModal} variant="outlined" color="primary">
                  changer de video
                </Button>
              </div>
            )}
            {!isFieldValid(MimicData.video) && (
              <div>
                {!isError && (
                  <Button name="video" style={{ width: '100%' }} onClick={toggleModal} variant="outlined" color="primary">
                    {<UploadIcon style={{ fill: 'currentcolor', width: '3rem', height: '3rem', margin: '30px' }} />}
                  </Button>
                )}
                {isError && (
                  <div style={{ marginTop: '1.5rem' }}>
                    <Button name="video" style={{ width: '100%', borderColor: '#d93939' }} onClick={toggleModal} variant="outlined" color="primary">
                      {<UploadIcon style={{ color: '#d93939', width: '3rem', height: '3rem', margin: '30px' }} />}
                    </Button>
                    <span style={{ fontSize: '0.7rem', marginLeft: '1rem', color: '#d93939' }}>Ce champ est obligatoire</span>
                  </div>
                )}
                <p>Mettre en ligne la vidéo de la {mimicNumber} mimique</p>
              </div>
            )}
            <VideoModals
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
              videoUrl={MimicData.video}
              value={MimicData.video || ''}
              setVideoUrl={onVideoChange}
              id={0}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <h4>Que signifie cette mimique ?</h4>
            <TextField
              variant="outlined"
              value={MimicData.signification || ''}
              label="Signification réelle"
              onChange={onDataChange('signification')}
              style={{ width: '100%', margin: '10px' }}
              error={isError && !isFieldValid(MimicData.signification)}
              helperText={isError && !isFieldValid(MimicData.signification) ? 'Ce champ est obligatoire' : ''}
              inputProps={{
                maxLength: 800,
              }}
              multiline
            />
            {!(isError && !isFieldValid(MimicData.signification)) && (
              <div style={{ width: '100%', textAlign: 'right' }}>
                <span className="text text--small">{MimicData.signification?.length}/800</span>
              </div>
            )}
            <h4>Quelle est l’origine de cette mimique ?</h4>
            <TextField
              variant="outlined"
              label="Origine"
              value={MimicData.origine || ''}
              onChange={onDataChange('origine')}
              style={{ width: '100%', margin: '10px' }}
              error={isError && !isFieldValid(MimicData.origine)}
              helperText={isError && !isFieldValid(MimicData.origine) ? 'Ce champ est obligatoire' : ''}
              inputProps={{
                maxLength: 800,
              }}
              multiline
            />
            {!(isError && !isFieldValid(MimicData.origine)) && (
              <div style={{ width: '100%', textAlign: 'right' }}>
                <span className="text text--small">{MimicData.origine?.length}/800</span>
              </div>
            )}
          </Grid>
        </Grid>
        <h1>Inventez deux significations fausses à cette mimique</h1>
        <p>
          Vos Pélicopains verront la vidéo de votre mimique, et devront trouver sa signification parmi la vraie, et ces deux fausses, qu’il faut
          inventer :
        </p>
        <TextField
          variant="outlined"
          label="Signification inventée 1"
          value={MimicData.fakeSignification1 || ''}
          onChange={onDataChange('fakeSignification1')}
          style={{ width: '100%', margin: '10px' }}
          error={isError && !isFieldValid(MimicData.fakeSignification1)}
          helperText={isError && !isFieldValid(MimicData.fakeSignification1) ? 'Ce champ est obligatoire' : ''}
          inputProps={{
            maxLength: 800,
          }}
          multiline
        />
        {!(isError && !isFieldValid(MimicData.fakeSignification1)) && (
          <div style={{ width: '100%', textAlign: 'right' }}>
            <span className="text text--small">{MimicData.fakeSignification1?.length}/800</span>
          </div>
        )}
        <TextField
          variant="outlined"
          label="Signification inventée 2"
          value={MimicData.fakeSignification2 || ''}
          onChange={onDataChange('fakeSignification2')}
          style={{ width: '100%', margin: '10px' }}
          error={isError && !isFieldValid(MimicData.fakeSignification2)}
          helperText={isError && !isFieldValid(MimicData.fakeSignification2) ? 'Ce champ est obligatoire' : ''}
          inputProps={{
            maxLength: 800,
          }}
          multiline
        />
        {!(isError && !isFieldValid(MimicData.fakeSignification2)) && (
          <div style={{ width: '100%', textAlign: 'right' }}>
            <span className="text text--small">{MimicData.fakeSignification2?.length}/800</span>
          </div>
        )}
        <StepsButton prev={onPrev ? prevPage : undefined} next={nextPage} />
      </div>
    </>
  );
};

export default MimicSelector;
